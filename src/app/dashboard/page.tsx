"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Slider,
  Grid,
  TextField,
  Card,
  CardContent,
  Button,
  Collapse,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Tooltip from "@mui/material/Tooltip";

// Base mock data
const baseInventoryData = [
  {
    id: 1,
    product: "Wireless Earbuds Pro",
    sku: "WEP-001",
    currentStock: 145,
    avgDailySales: 4.2,
    leadTimeInDays: 30,
    safetyStockDays: 14,
  },
  {
    id: 2,
    product: "Phone Stand Premium",
    sku: "PSP-002",
    currentStock: 89,
    avgDailySales: 3.8,
    leadTimeInDays: 25,
    safetyStockDays: 14,
  },
];

export default function Dashboard() {
  const [showParameters, setShowParameters] = useState(false);
  const [safetyStockMultiplier, setSafetyStockMultiplier] = useState(1.5);
  const [leadTimeBuffer, setLeadTimeBuffer] = useState(7);
  const [salesVelocityMultiplier, setSalesVelocityMultiplier] = useState(1.0);

  // Calculate derived data based on parameters
  const calculatedInventoryData = baseInventoryData.map((item) => {
    const adjustedDailySales = item.avgDailySales * salesVelocityMultiplier;
    const totalLeadTime = item.leadTimeInDays + leadTimeBuffer;
    const safetyStock = Math.ceil(
      adjustedDailySales * item.safetyStockDays * safetyStockMultiplier
    );
    const daysUntilStockout = Math.ceil(item.currentStock / adjustedDailySales);
    const recommendedOrderPoint = Math.ceil(
      adjustedDailySales * totalLeadTime + safetyStock
    );

    return {
      ...item,
      daysUntilStockout,
      recommendedOrderDate: calculateOrderDate(daysUntilStockout),
      recommendedQuantity: Math.max(
        0,
        recommendedOrderPoint - item.currentStock
      ),
      adjustedDailySales,
      safetyStock,
    };
  });

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Dashboard
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor and manage your Amazon inventory
          </Typography>
          <Button
            onClick={() => setShowParameters(!showParameters)}
            variant="outlined"
            endIcon={showParameters ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
            {showParameters ? "Hide Parameters" : "Adjust Parameters"}
          </Button>
        </Box>
      </Box>

      <Collapse in={showParameters}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Simulation Parameters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ParameterCard
                title="Safety Stock Multiplier"
                value={safetyStockMultiplier}
                onChange={(value) => setSafetyStockMultiplier(value)}
                min={1}
                max={3}
                step={0.1}
                tooltip="Multiplier for safety stock calculation. Higher values mean more buffer stock."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ParameterCard
                title="Lead Time Buffer (Days)"
                value={leadTimeBuffer}
                onChange={(value) => setLeadTimeBuffer(value)}
                min={0}
                max={120}
                step={1}
                tooltip="Additional buffer days added to the standard lead time"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ParameterCard
                title="Sales Velocity Multiplier"
                value={salesVelocityMultiplier}
                onChange={(value) => setSalesVelocityMultiplier(value)}
                min={0.5}
                max={2}
                step={0.1}
                tooltip="Adjust sales velocity predictions. Use this to simulate faster or slower sales."
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>
                <Tooltip title="Current inventory quantity in stock">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Current Stock (units)
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Average number of units sold per day, adjusted by the sales velocity multiplier">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Daily Sales (units/day)
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Estimated number of days until current stock runs out at current sales rate">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Days Until Stockout
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Minimum stock level to maintain as safety buffer">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Safety Stock (units)
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Recommended date to place the next order">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Order By Date
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Recommended quantity to order next">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Order Quantity (units)
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculatedInventoryData.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{item.product}</Typography>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                <TableCell>{item.adjustedDailySales.toFixed(1)}</TableCell>
                <TableCell>
                  <StockoutIndicator days={item.daysUntilStockout} />
                </TableCell>
                <TableCell>{item.safetyStock.toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip
                    title={`Order ${
                      item.daysUntilStockout - 30
                    } days from now`}>
                    <span>{item.recommendedOrderDate}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {item.recommendedQuantity.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

function ParameterCard({
  title,
  value,
  onChange,
  min,
  max,
  step,
  tooltip,
}: {
  title: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  tooltip: string;
}) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Tooltip title={tooltip}>
            <InfoIcon sx={{ ml: 1, color: "text.secondary" }} />
          </Tooltip>
        </Box>
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as number)}
          min={min}
          max={max}
          step={step}
          marks
          valueLabelDisplay="auto"
        />
        <TextField
          value={value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          type="number"
          size="small"
          inputProps={{
            min,
            max,
            step,
          }}
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );
}

function StockoutIndicator({ days }: { days: number }) {
  let color: "success" | "warning" | "error" = "success";
  if (days < 14) {
    color = "error";
  } else if (days < 30) {
    color = "warning";
  }

  return (
    <Chip
      label={`${days} days`}
      color={color}
      size="small"
      variant="outlined"
    />
  );
}

function calculateOrderDate(daysUntilStockout: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(0, daysUntilStockout - 30)); // Order 30 days before stockout
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
