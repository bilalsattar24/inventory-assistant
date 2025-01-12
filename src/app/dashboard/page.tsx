"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Container, Heading, Button, HStack } from "@chakra-ui/react";
import { addDays, startOfWeek, differenceInDays } from "date-fns";
import { InventoryParameters } from "./components/InventoryParameters";
import { ForecastTable } from "./components/ForecastTable";
import { OrderShipments } from "./components/OrderShipments";
import { InventoryParams, WeeklyForecast, OrderShipment } from "./types";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/products";
import { fetchOrders } from "@/lib/orders";
import Link from "next/link";
import ProductOrders from "./components/ProductOrders";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [showParams, setShowParams] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", productId],
    queryFn: () => fetchOrders(Number(productId)),
    enabled: !!productId,
  });

  const product = products?.find((p) => p.id === Number(productId));

  const [params, setParams] = useState<InventoryParams>({
    safetyStockDays: 45,
    productionLeadTime: 30,
    shippingLeadTime: 50,
    maxStockDays: 100,
    currentFBAStock: 0, // Start with 0 as we'll update this when product loads
  });

  // Update params when product data is loaded
  useEffect(() => {
    if (product) {
      setParams({
        safetyStockDays: product.safety_stock_days,
        productionLeadTime: product.production_lead_time_days,
        shippingLeadTime: product.shipping_lead_time,
        maxStockDays: product.max_stock_days,
        currentFBAStock: product.current_stock_units,
      });
    }
  }, [product]);

  // Calculate weekly forecasts
  const calculateForecasts = () => {
    const today = new Date();
    const mondayOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });

    // Initialize base forecasts
    const forecasts = Array.from({ length: 24 }, (_, i) => ({
      date: addDays(mondayOfThisWeek, i * 7),
      incomingShipments: 0,
      amazonInventory: i === 0 ? params.currentFBAStock : 0,
      forecastedDailySales: 10,
      daysOfStock: 0,
    }));

    // Add order quantities to the appropriate weeks if orders exist
    if (orders) {
      console.log("Processing orders:", orders);
      orders.forEach((order) => {
        const deliveryDate = new Date(order.expected_arrival_date);
        const weekStart = startOfWeek(deliveryDate, { weekStartsOn: 1 });

        // Find the week index by comparing dates
        const weekIndex = forecasts.findIndex((forecast) => {
          const forecastDate = new Date(forecast.date);
          return (
            forecastDate.getFullYear() === weekStart.getFullYear() &&
            forecastDate.getMonth() === weekStart.getMonth() &&
            forecastDate.getDate() === weekStart.getDate()
          );
        });

        console.log("Order processing:", {
          order,
          deliveryDate,
          weekStart,
          mondayOfThisWeek,
          weekIndex,
        });

        // Only add if the week is within our forecast range
        if (weekIndex >= 0 && weekIndex < forecasts.length) {
          forecasts[weekIndex].incomingShipments += order.units;
          console.log(`Added ${order.units} units to week ${weekIndex}`);
        }
      });
    }

    // Calculate running inventory and days of stock
    let runningInventory = params.currentFBAStock;
    forecasts.forEach((week, index) => {
      // Add incoming shipments to inventory
      runningInventory += week.incomingShipments;
      week.amazonInventory = runningInventory;

      // Subtract weekly sales from inventory
      const weeklySales = week.forecastedDailySales * 7;
      runningInventory = Math.max(0, runningInventory - weeklySales);

      // Calculate days of stock based on daily sales rate
      week.daysOfStock =
        week.forecastedDailySales > 0
          ? Math.round(week.amazonInventory / week.forecastedDailySales)
          : 0;
    });

    console.log("Final forecasts:", forecasts);
    return forecasts;
  };

  // Update weekly forecasts whenever params or orders change
  const [weeklyForecasts, setWeeklyForecasts] = useState<WeeklyForecast[]>(() =>
    calculateForecasts()
  );

  useEffect(() => {
    setWeeklyForecasts(calculateForecasts());
  }, [params, orders]); // Recalculate when params or orders change

  const [orderShipments, setOrderShipments] = useState<OrderShipment[]>([]);

  const handleParamChange =
    (param: keyof InventoryParams) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setParams((prev) => ({ ...prev, [param]: value }));
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
      setWeeklyForecasts((prevForecasts) =>
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

    for (const week of weeklyForecasts) {
      if (week.date <= date) {
        inventory =
          inventory -
          week.forecastedDailySales * 7 +
          (week.incomingShipments || 0);
      }
    }

    return inventory;
  };

  const calculateMinInventoryBeforeArrival = (
    startDate: Date,
    arrivalDate: Date
  ): number => {
    let minInventory = Infinity;
    let currentDate = startDate;

    while (currentDate <= arrivalDate) {
      const inventory = calculateProjectedInventory(currentDate);
      minInventory = Math.min(minInventory, inventory);
      currentDate = addDays(currentDate, 1);
    }

    return minInventory;
  };

  useEffect(() => {
    const totalLeadTime = params.productionLeadTime + params.shippingLeadTime;
    const today = new Date();
    const avgDailySales = calculateAverageDailySales(
      today,
      addDays(today, totalLeadTime)
    );

    let daysUntilSafetyStock = Math.floor(
      (params.currentFBAStock - params.safetyStockDays * avgDailySales) /
        avgDailySales
    );

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
  ]);

  useEffect(() => {
    const updatedForecasts = weeklyForecasts.map((week) => ({
      ...week,
      // Preserve existing incomingShipments instead of resetting to 0
      incomingShipments: week.incomingShipments,
    }));

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
          incomingShipments:
            updatedForecasts[weekIndex].incomingShipments +
            shipment.shipQuantity,
        };
      }
    });

    const finalForecasts = updatedForecasts.reduce<WeeklyForecast[]>(
      (acc, week, index) => {
        if (index === 0) {
          const daysOfStock =
            week.forecastedDailySales > 0
              ? params.currentFBAStock / week.forecastedDailySales
              : 0;
          acc.push({
            ...week,
            amazonInventory: params.currentFBAStock,
            daysOfStock,
          });
        } else {
          const previousWeek = acc[index - 1];
          const newInventory =
            previousWeek.amazonInventory -
            previousWeek.forecastedDailySales * 7 +
            week.incomingShipments;

          const daysOfStock =
            week.forecastedDailySales > 0
              ? newInventory / week.forecastedDailySales
              : 0;

          acc.push({
            ...week,
            amazonInventory: newInventory,
            daysOfStock,
          });
        }
        return acc;
      },
      []
    );

    // Only update if there's a meaningful change
    const hasChanged =
      JSON.stringify(finalForecasts) !== JSON.stringify(weeklyForecasts);
    const hasValidValues = finalForecasts.every(
      (forecast) =>
        !isNaN(forecast.amazonInventory) &&
        !isNaN(forecast.daysOfStock) &&
        isFinite(forecast.amazonInventory) &&
        isFinite(forecast.daysOfStock)
    );

    if (hasChanged && hasValidValues) {
      setWeeklyForecasts(finalForecasts);
    }
  }, [
    orderShipments,
    params.shippingLeadTime,
    params.currentFBAStock,
    weeklyForecasts,
  ]);

  return (
    <Container maxW="container.xl" py={8}>
      <HStack mb={6} justify="space-between" align="center">
        <Link href="/products">
          <Button colorScheme="gray" size="sm">
            Back to Products
          </Button>
        </Link>
        {product && <Heading size="lg">{product.name}</Heading>}
      </HStack>
      <Heading mb={6}>Inventory Dashboard</Heading>

      <InventoryParameters
        params={params}
        showParams={showParams}
        onParamChange={handleParamChange}
        onToggleParams={() => setShowParams(!showParams)}
        isLoading={productsLoading}
      />
      {productId && (
        <ProductOrders
          orders={orders || []}
          isLoading={ordersLoading}
        />
      )}
      <OrderShipments shipments={orderShipments} />

      <ForecastTable
        forecasts={weeklyForecasts}
        onForecastChange={handleForecastChange}
        onFillDown={handleFillDown}
      />
    </Container>
  );
}
