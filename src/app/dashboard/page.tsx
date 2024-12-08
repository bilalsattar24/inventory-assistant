"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Stack,
  Alert,
  AlertIcon,
  IconButton,
  Collapse,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { addDays, startOfWeek, format, differenceInDays } from "date-fns";

interface InventoryParams {
  safetyStockDays: number;
  productionLeadTime: number;
  shippingLeadTime: number;
  maxStockFBA: number;
  currentFBAStock: number;
}

interface WeeklyForecast {
  date: Date;
  incomingShipments: number;
  amazonInventory: number;
  forecastedDailySales: number;
  daysOfStock: number;
}

interface OrderShipment {
  orderDate: Date;
  orderQuantity: number;
  shipDate: Date;
  shipQuantity: number;
  lowStockAlert: string | null;
}

export default function Dashboard() {
  const [showParams, setShowParams] = useState(false);
  const [params, setParams] = useState<InventoryParams>({
    safetyStockDays: 30,
    productionLeadTime: 60,
    shippingLeadTime: 30,
    maxStockFBA: 1000,
    currentFBAStock: 500,
  });

  const [weeklyForecasts, setWeeklyForecasts] = useState<WeeklyForecast[]>(
    () => {
      // Initialize 12 weeks of forecasts
      const startDate = startOfWeek(new Date());
      return Array.from({ length: 12 }, (_, i) => ({
        date: addDays(startDate, i * 7),
        incomingShipments: 0,
        amazonInventory: i === 0 ? params.currentFBAStock : 0,
        forecastedDailySales: 10, // Default forecast
        daysOfStock: 0,
      }));
    }
  );

  const [orderShipments, setOrderShipments] = useState<OrderShipment[]>([]);

  useEffect(() => {
    calculateInventoryTimeline();
    calculateOrderShipments();
  }, [params, weeklyForecasts]);

  const calculateInventoryTimeline = () => {
    const updatedForecasts = [...weeklyForecasts];

    // Calculate inventory levels and days of stock for each week
    updatedForecasts.forEach((week, index) => {
      if (index === 0) {
        week.amazonInventory = params.currentFBAStock;
      } else {
        const previousWeek = updatedForecasts[index - 1];
        week.amazonInventory =
          previousWeek.amazonInventory +
          week.incomingShipments -
          previousWeek.forecastedDailySales * 7;
      }

      week.daysOfStock = week.amazonInventory / week.forecastedDailySales;
    });

    setWeeklyForecasts(updatedForecasts);
  };

  const calculateOrderShipments = () => {
    const totalLeadTime = params.productionLeadTime + params.shippingLeadTime;
    const today = new Date();

    // Calculate DUR (Days Until Reorder)
    const avgDailySales = calculateAverageDailySales(
      today,
      addDays(today, totalLeadTime)
    );
    const DUR = Math.floor(
      (params.currentFBAStock - params.safetyStockDays * avgDailySales) /
        avgDailySales
    );

    const orderDate = addDays(today, DUR);
    const shipDate = addDays(orderDate, params.productionLeadTime);
    const arrivalDate = addDays(shipDate, params.shippingLeadTime);

    // Calculate order quantity
    const projectedInventory = calculateProjectedInventory(arrivalDate);
    const orderQuantity = params.maxStockFBA - projectedInventory;

    // Check for low stock alert
    const minInventory = calculateMinInventoryBeforeArrival(today, arrivalDate);
    const lowStockAlert =
      minInventory < params.safetyStockDays * avgDailySales
        ? `Low stock alert: ${Math.floor(
            minInventory / avgDailySales
          )} days of stock before arrival`
        : null;

    const newOrderShipment: OrderShipment = {
      orderDate,
      orderQuantity: Math.max(0, orderQuantity),
      shipDate,
      shipQuantity: Math.max(0, orderQuantity),
      lowStockAlert,
    };

    setOrderShipments([newOrderShipment]);
  };

  const calculateAverageDailySales = (
    startDate: Date,
    endDate: Date
  ): number => {
    const days = differenceInDays(endDate, startDate);
    let totalSales = 0;
    let daysCount = 0;

    weeklyForecasts.forEach((week) => {
      const weekStart = week.date;
      const weekEnd = addDays(weekStart, 7);

      if (weekStart <= endDate && weekEnd >= startDate) {
        const overlapStart = Math.max(startDate.getTime(), weekStart.getTime());
        const overlapEnd = Math.min(endDate.getTime(), weekEnd.getTime());
        const overlapDays = Math.ceil(
          (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)
        );

        totalSales += week.forecastedDailySales * overlapDays;
        daysCount += overlapDays;
      }
    });

    return daysCount > 0 ? totalSales / daysCount : 0;
  };

  const calculateProjectedInventory = (date: Date): number => {
    let inventory = params.currentFBAStock;
    const today = new Date();

    weeklyForecasts.forEach((week) => {
      if (week.date >= today && week.date <= date) {
        inventory -= week.forecastedDailySales * 7;
        inventory += week.incomingShipments;
      }
    });

    return inventory;
  };

  const calculateMinInventoryBeforeArrival = (
    startDate: Date,
    arrivalDate: Date
  ): number => {
    let minInventory = params.currentFBAStock;
    let currentInventory = params.currentFBAStock;

    weeklyForecasts.forEach((week) => {
      if (week.date >= startDate && week.date <= arrivalDate) {
        currentInventory -= week.forecastedDailySales * 7;
        minInventory = Math.min(minInventory, currentInventory);
      }
    });

    return minInventory;
  };

  const handleParamChange =
    (param: keyof InventoryParams) => (e: ChangeEvent<HTMLInputElement>) => {
      setParams({ ...params, [param]: Number(e.target.value) });
    };

  const handleForecastChange =
    (
      index: number,
      field: keyof Pick<
        WeeklyForecast,
        "incomingShipments" | "forecastedDailySales"
      >
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newForecasts = [...weeklyForecasts];
      newForecasts[index][field] = Number(e.target.value);
      setWeeklyForecasts(newForecasts);
    };

  return (
    <Container maxW="container.xl" py={4}>
      {/* Parameters Section */}
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}>
          <Heading size="lg">Inventory Management Dashboard</Heading>
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            onClick={() => setShowParams(!showParams)}
          />
        </Box>

        <Collapse in={showParams}>
          <Box p={6} mb={3} shadow="md" borderWidth="1px" borderRadius="md">
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Safety Stock (days)</FormLabel>
                <Input
                  type="number"
                  value={params.safetyStockDays}
                  onChange={handleParamChange("safetyStockDays")}
                />
                <FormHelperText>
                  Minimum number of days of inventory you want to maintain
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Production Lead Time (days)</FormLabel>
                <Input
                  type="number"
                  value={params.productionLeadTime}
                  onChange={handleParamChange("productionLeadTime")}
                />
                <FormHelperText>
                  Time needed for production to complete an order
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Shipping Lead Time (days)</FormLabel>
                <Input
                  type="number"
                  value={params.shippingLeadTime}
                  onChange={handleParamChange("shippingLeadTime")}
                />
                <FormHelperText>
                  Time needed to ship from factory to Amazon FBA
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Max Stock at Amazon FBA (units)</FormLabel>
                <Input
                  type="number"
                  value={params.maxStockFBA}
                  onChange={handleParamChange("maxStockFBA")}
                />
                <FormHelperText>
                  Maximum inventory units you want to store at Amazon FBA
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Current FBA Stock (units)</FormLabel>
                <Input
                  type="number"
                  value={params.currentFBAStock}
                  onChange={handleParamChange("currentFBAStock")}
                />
                <FormHelperText>
                  Current inventory units at Amazon FBA
                </FormHelperText>
              </FormControl>
            </VStack>
          </Box>
        </Collapse>
      </Box>

      {/* Orders and Shipments Table */}
      <Heading size="md" mb={4}>
        Orders and Shipments
      </Heading>
      <Box
        mb={4}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        overflow="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order Date</Th>
              <Th>Order Quantity</Th>
              <Th>Ship Date</Th>
              <Th>Ship Quantity</Th>
              <Th>Low Stock Alert</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderShipments.map((shipment, index) => (
              <Tr key={index}>
                <Td>{format(shipment.orderDate, "MM/dd/yyyy")}</Td>
                <Td>{shipment.orderQuantity}</Td>
                <Td>{format(shipment.shipDate, "MM/dd/yyyy")}</Td>
                <Td>{shipment.shipQuantity}</Td>
                <Td>
                  {shipment.lowStockAlert && (
                    <Alert status="error" variant="subtle">
                      <AlertIcon />
                      {shipment.lowStockAlert}
                    </Alert>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Forecast and Inventory Timeline Table */}
      <Heading size="md" mb={4}>
        Forecast and Inventory Timeline
      </Heading>
      <Box shadow="md" borderWidth="1px" borderRadius="md" overflow="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Week Starting</Th>
              <Th>Incoming Shipments</Th>
              <Th>Amazon Inventory</Th>
              <Th>Forecasted Daily Sales</Th>
              <Th>Days of Stock</Th>
            </Tr>
          </Thead>
          <Tbody>
            {weeklyForecasts.map((week, index) => (
              <Tr key={index}>
                <Td>{format(week.date, "MM/dd/yyyy")}</Td>
                <Td>
                  <Input
                    type="number"
                    size="sm"
                    value={week.incomingShipments}
                    onChange={handleForecastChange(index, "incomingShipments")}
                  />
                </Td>
                <Td>{Math.round(week.amazonInventory)}</Td>
                <Td>
                  <Input
                    type="number"
                    size="sm"
                    value={week.forecastedDailySales}
                    onChange={handleForecastChange(
                      index,
                      "forecastedDailySales"
                    )}
                  />
                </Td>
                <Td
                  bg={
                    week.daysOfStock <= params.safetyStockDays
                      ? "red.100"
                      : week.daysOfStock >=
                        params.maxStockFBA / week.forecastedDailySales
                      ? "yellow.100"
                      : undefined
                  }>
                  {Math.round(week.daysOfStock)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
