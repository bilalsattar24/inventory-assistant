import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { WeeklyForecast } from "../types";
import { supabase } from "@/lib/supabase";

interface ForecastTableProps {
  productId: number;
  forecasts: WeeklyForecast[];
  onForecastChange: (
    index: number,
    field: keyof Pick<
      WeeklyForecast,
      "incomingShipments" | "forecastedDailySales"
    >
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFillDown: (index: number) => void;
}

export function ForecastTable({
  productId,
  forecasts,
  onForecastChange,
  onFillDown,
}: ForecastTableProps) {
  const saveForecast = async (index: number, value: number) => {
    const forecast = forecasts[index];
    const weekStartDate = forecast.date.toISOString().split("T")[0];

    await supabase.from("WeeklyForecastedSales").upsert(
      {
        product_id: productId,
        week_start_date: weekStartDate,
        daily_forecasted_sales: value,
      },
      {
        onConflict: "product_id,week_start_date",
      }
    );
  };

  const handleForecastChange =
    (
      index: number,
      field: keyof Pick<WeeklyForecast, "forecastedDailySales">
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      onForecastChange(index, field)(e);
      if (field === "forecastedDailySales") {
        saveForecast(index, value);
      }
    };
  console.log(
    "Rendering ForecastTable with",
    forecasts.length,
    "weeks",
    forecasts
  );
  return (
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
        {forecasts.map((week, index) => (
          <Tr key={week.date.toISOString()}>
            <Td>{format(new Date(week.date), "MMM d, yyyy")}</Td>
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
                  onChange={handleForecastChange(index, "forecastedDailySales")}
                  size="sm"
                  width="100px"
                />
                <IconButton
                  aria-label="Fill down"
                  icon={<ChevronDownIcon />}
                  size="sm"
                  onClick={() => onFillDown(index)}
                  title="Copy this value to all rows below"
                />
              </Stack>
            </Td>
            <Td
              fontSize="md"
              fontWeight="medium"
              color={week.daysOfStock < 45 ? "red.500" : "inherit"}
            >
              {Math.round(week.daysOfStock)}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
