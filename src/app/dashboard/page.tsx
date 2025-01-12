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
import { SettingsIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { addDays, startOfWeek, format, differenceInDays } from "date-fns";

interface InventoryParams {
  safetyStockDays: number;
  productionLeadTime: number;
  shippingLeadTime: number;
  maxStockDays: number;
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
  const [showParams, setShowParams] = useState(true);
  const [params, setParams] = useState<InventoryParams>({
    safetyStockDays: 45,
    productionLeadTime: 30,
    shippingLeadTime: 50,
    maxStockDays: 100,
    currentFBAStock: 1200,
  });

  const [weeklyForecasts, setWeeklyForecasts] = useState<WeeklyForecast[]>(
    () => {
      // Initialize 12 weeks of forecasts
      const startDate = startOfWeek(new Date());
      return Array.from({ length: 24 }, (_, i) => ({
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
    // Calculate order shipments
    const totalLeadTime = params.productionLeadTime + params.shippingLeadTime;
    const today = new Date();
    const avgDailySales = calculateAverageDailySales(
      today,
      addDays(today, totalLeadTime)
    );

    // Find when we'll hit safety stock
    let daysUntilSafetyStock = Math.floor(
      (params.currentFBAStock - params.safetyStockDays * avgDailySales) /
        avgDailySales
    );

    // Calculate dates working backwards from when we need inventory to arrive
    const requiredArrivalDate = addDays(today, daysUntilSafetyStock);
    const shipDate = addDays(requiredArrivalDate, -params.shippingLeadTime);
    const orderDate = addDays(shipDate, -params.productionLeadTime);

    const projectedInventory = calculateProjectedInventory(requiredArrivalDate);
    const projectedDaysOfStock = projectedInventory / avgDailySales;
    const orderQuantity = Math.ceil(
      (params.maxStockDays - projectedDaysOfStock) * avgDailySales
    );
    const minInventory = calculateMinInventoryBeforeArrival(
      today,
      requiredArrivalDate
    );

    const newOrderShipment: OrderShipment = {
      orderDate,
      orderQuantity: Math.max(0, orderQuantity),
      shipDate,
      shipQuantity: Math.max(0, orderQuantity),
      lowStockAlert:
        minInventory < params.safetyStockDays * avgDailySales
          ? `Low stock alert: ${Math.floor(
              minInventory / avgDailySales
            )} days of stock before arrival`
          : null,
    };

    setOrderShipments([newOrderShipment]);
  }, [
    params.safetyStockDays,
    params.productionLeadTime,
    params.shippingLeadTime,
    params.maxStockDays,
    params.currentFBAStock,
    weeklyForecasts.map((f) => f.forecastedDailySales).join(","),
  ]);

  useEffect(() => {
    // First, reset all incoming shipments to 0
    const updatedForecasts = weeklyForecasts.map((week) => ({
      ...week,
      incomingShipments: 0,
    }));

    // Add incoming shipments based on order shipments
    orderShipments.forEach((shipment) => {
      const shipmentArrivalDate = addDays(
        shipment.shipDate,
        params.shippingLeadTime
      );
      const weekIndex = updatedForecasts.findIndex((week) => {
        const weekEnd = addDays(week.date, 6);
        return (
          shipmentArrivalDate >= week.date && shipmentArrivalDate <= weekEnd
        );
      });

      if (weekIndex !== -1) {
        updatedForecasts[weekIndex] = {
          ...updatedForecasts[weekIndex],
          incomingShipments: shipment.shipQuantity,
        };
      }
    });

    // Calculate inventory levels and days of stock
    const finalForecasts = updatedForecasts.reduce<WeeklyForecast[]>(
      (acc, week, index) => {
        if (index === 0) {
          acc.push({
            ...week,
            amazonInventory: params.currentFBAStock,
            daysOfStock: params.currentFBAStock / week.forecastedDailySales,
          });
        } else {
          const previousWeek = acc[index - 1];
          const newInventory: number =
            previousWeek.amazonInventory -
            previousWeek.forecastedDailySales * 7 +
            week.incomingShipments;

          acc.push({
            ...week,
            amazonInventory: newInventory,
            daysOfStock: newInventory / week.forecastedDailySales,
          });
        }
        return acc;
      },
      []
    );

    // Only update if the values have actually changed
    if (JSON.stringify(finalForecasts) !== JSON.stringify(weeklyForecasts)) {
      setWeeklyForecasts(finalForecasts);
    }
  }, [orderShipments, params.shippingLeadTime, params.currentFBAStock]);

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
      const newValue = Number(e.target.value);
      setWeeklyForecasts((prevForecasts: WeeklyForecast[]): WeeklyForecast[] =>
        prevForecasts.map((week, i) => {
          if (i === index) {
            return {
              ...week,
              [field]: newValue,
            };
          }
          return week;
        })
      );
    };

  const handleFillDown = (index: number) => {
    const valueToFill = weeklyForecasts[index].forecastedDailySales;
    setWeeklyForecasts((prevForecasts) =>
      prevForecasts.map((week, i) => {
        if (i >= index) {
          return {
            ...week,
            forecastedDailySales: valueToFill,
          };
        }
        return week;
      })
    );
  };

  const handleBulkEdit = (startIndex: number, endIndex: number, value: number) => {
    setWeeklyForecasts((prevForecasts) =>
      prevForecasts.map((week, i) => {
        if (i >= startIndex && i <= endIndex) {
          return {
            ...week,
            forecastedDailySales: value,
          };
        }
        return week;
      })
    );
  };

  const handlePercentageChange = (startIndex: number, endIndex: number, percentage: number) => {
    setWeeklyForecasts((prevForecasts) =>
      prevForecasts.map((week, i) => {
        if (i >= startIndex && i <= endIndex) {
          return {
            ...week,
            forecastedDailySales: week.forecastedDailySales * (1 + percentage / 100),
          };
        }
        return week;
      })
    );
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
                <FormLabel>Max Stock Days</FormLabel>
                <Input
                  type="number"
                  value={params.maxStockDays}
                  onChange={handleParamChange("maxStockDays")}
                />
                <FormHelperText>
                  Maximum number of days of inventory you want to store at
                  Amazon FBA
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
              <Th fontSize="md" fontWeight="bold">
                Week Starting
              </Th>
              <Th fontSize="md" fontWeight="bold">
                Incoming Shipments
              </Th>
              <Th fontSize="md" fontWeight="bold">
                Amazon Inventory
              </Th>
              <Th fontSize="md" fontWeight="bold">
                Forecasted Daily Sales
              </Th>
              <Th fontSize="md" fontWeight="bold">
                Days of Stock
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {weeklyForecasts.map((week, index) => (
              <Tr key={week.date.toISOString()}>
                <Td fontSize="md" fontWeight="medium">
                  {format(week.date, "MMM d, yyyy")}
                </Td>
                <Td fontSize="md" fontWeight="medium">
                  {week.incomingShipments === 0 ? "-" : week.incomingShipments}
                </Td>
                <Td fontSize="md" fontWeight="medium">
                  {Math.round(week.amazonInventory)}
                </Td>
                <Td>
                  <Stack direction="row" spacing={2} align="center">
                    <Input
                      type="number"
                      value={week.forecastedDailySales}
                      onChange={handleForecastChange(
                        index,
                        "forecastedDailySales"
                      )}
                      size="sm"
                      width="100px"
                    />
                    <IconButton
                      aria-label="Fill down"
                      icon={<ChevronDownIcon />}
                      size="sm"
                      onClick={() => handleFillDown(index)}
                      title="Copy this value to all rows below"
                    />
                  </Stack>
                </Td>
                <Td
                  fontSize="md"
                  fontWeight="medium"
                  bg={
                    week.daysOfStock <= params.safetyStockDays
                      ? "red.100"
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
