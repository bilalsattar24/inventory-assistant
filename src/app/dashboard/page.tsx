"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Container, Heading } from "@chakra-ui/react";
import { addDays, startOfWeek, differenceInDays } from "date-fns";
import { InventoryParameters } from "./components/InventoryParameters";
import { ForecastTable } from "./components/ForecastTable";
import { OrderShipments } from "./components/OrderShipments";
import { InventoryParams, WeeklyForecast, OrderShipment } from "./types";

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
      const startDate = startOfWeek(new Date());
      return Array.from({ length: 24 }, (_, i) => ({
        date: addDays(startDate, i * 7),
        incomingShipments: 0,
        amazonInventory: i === 0 ? params.currentFBAStock : 0,
        forecastedDailySales: 10,
        daysOfStock: 0,
      }));
    }
  );

  const [orderShipments, setOrderShipments] = useState<OrderShipment[]>([]);

  const handleParamChange =
    (param: keyof InventoryParams) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setParams((prev) => ({ ...prev, [param]: value }));
    };

  const handleForecastChange =
    (
      index: number,
      field: keyof Pick<WeeklyForecast, "incomingShipments" | "forecastedDailySales">
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

  const calculateAverageDailySales = (startDate: Date, endDate: Date): number => {
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
      incomingShipments: 0,
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
          incomingShipments: shipment.shipQuantity,
        };
      }
    });

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
          const newInventory =
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

    // Only update if there's a meaningful change
    const hasChanged = JSON.stringify(finalForecasts) !== JSON.stringify(weeklyForecasts);
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
  }, [orderShipments, params.shippingLeadTime, params.currentFBAStock]);

  return (
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" size="lg" mb={6}>
        Inventory Dashboard
      </Heading>
      
      <InventoryParameters
        params={params}
        showParams={showParams}
        onParamChange={handleParamChange}
        onToggleParams={() => setShowParams(!showParams)}
      />

      <ForecastTable
        forecasts={weeklyForecasts}
        onForecastChange={handleForecastChange}
        onFillDown={handleFillDown}
      />

      <OrderShipments shipments={orderShipments} />
    </Container>
  );
}
