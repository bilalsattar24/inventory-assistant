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

// Add these theme colors at the top of the file
const themeColors = {
  primary: {
    main: "#2D3250", // Deep navy blue
    light: "#424769", // Lighter navy
    dark: "#1B1F31", // Darker navy
  },
  secondary: {
    main: "#F6B17A", // Warm orange
    light: "#FFD9B7", // Light peach
  },
  success: {
    main: "#4E9F3D", // Forest green
    light: "#D7E6D5", // Light sage
  },
  warning: {
    main: "#FF7E67", // Coral
    light: "#FFB4A2", // Light coral
  },
  error: {
    main: "#E94560", // Ruby red
    light: "#FFD5DD", // Light pink
  },
};

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

// Add this function to calculate daily inventory levels
function calculateDailyInventory(item: any, days: number = 100) {
  const dailyForecasts = [];
  let remainingStock = item.currentStock;
  const today = new Date();

  for (let i = 0; i < days && remainingStock > 0; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    remainingStock = Math.max(0, remainingStock - item.adjustedDailySales);

    dailyForecasts.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      inventory: Math.round(remainingStock),
      daysFromNow: i,
    });
  }

  return dailyForecasts;
}

export default function Dashboard() {
  const [showParameters, setShowParameters] = useState(false);
  const [safetyStockDays, setSafetyStockDays] = useState(14);
  const [leadTimeBuffer, setLeadTimeBuffer] = useState(7);
  const [salesVelocityMultiplier, setSalesVelocityMultiplier] = useState(1.0);

  // Calculate derived data based on parameters
  const calculatedInventoryData = baseInventoryData.map((item) => {
    const adjustedDailySales = item.avgDailySales * salesVelocityMultiplier;
    const totalLeadTime = item.leadTimeInDays + leadTimeBuffer;
    const safetyStock = Math.ceil(adjustedDailySales * safetyStockDays);
    const daysUntilStockout = Math.ceil(item.currentStock / adjustedDailySales);

    // Calculate order quantity for 60 days of stock
    const targetStock = Math.ceil(adjustedDailySales * 60);
    const recommendedOrderPoint = Math.ceil(
      adjustedDailySales * totalLeadTime + safetyStock
    );
    const recommendedQuantity = Math.max(0, targetStock - item.currentStock);

    // Calculate shipping details
    const maxFBAStock = Math.ceil(adjustedDailySales * 100); // 100 days max in FBA
    const shippingLeadTime = 45; // 45 days shipping lead time

    // Calculate when stock will hit safety stock level
    const daysUntilSafetyStock = Math.ceil(
      (item.currentStock - safetyStock) / adjustedDailySales
    );

    // Calculate ship date to arrive when inventory hits safety stock
    const shipDate = new Date();
    shipDate.setDate(
      shipDate.getDate() + Math.max(0, daysUntilSafetyStock - shippingLeadTime)
    );

    // Calculate shipping quantity (limited by max FBA stock)
    const shippingQuantity = Math.min(
      recommendedQuantity,
      maxFBAStock -
        Math.max(
          0,
          item.currentStock - adjustedDailySales * daysUntilSafetyStock
        )
    );

    return {
      ...item,
      daysUntilStockout,
      recommendedOrderDate: calculateOrderDate(daysUntilStockout),
      recommendedQuantity,
      adjustedDailySales,
      safetyStock,
      shipDate: shipDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      shippingQuantity: Math.max(0, Math.ceil(shippingQuantity)),
    };
  });

  return (
    <Container sx={{ py: 4, bgcolor: "#F8F9FA" }}>
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
            variant="contained"
            sx={{
              bgcolor: themeColors.primary.main,
              "&:hover": {
                bgcolor: themeColors.primary.light,
              },
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
            }}
            endIcon={showParameters ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
            {showParameters ? "Hide Parameters" : "Adjust Parameters"}
          </Button>
        </Box>
      </Box>

      <Collapse in={showParameters}>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
          <Typography variant="h6" gutterBottom>
            Simulation Parameters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ParameterCard
                title="Safety Stock Days"
                value={safetyStockDays}
                onChange={(value) => setSafetyStockDays(value)}
                min={1}
                max={100}
                step={1}
                tooltip="Number of days of safety stock to maintain"
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

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          "& .MuiTableCell-head": {
            bgcolor: themeColors.primary.main,
            color: "white",
            fontWeight: 600,
          },
          "& .MuiTableRow-root:hover": {
            bgcolor: "rgba(0,0,0,0.02)",
          },
        }}>
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
              <TableCell>
                <Tooltip title="Date to ship inventory to arrive when stock hits safety level">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Ship Date
                    <InfoIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Quantity to ship (limited by Amazon FBA maximum)">
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}>
                    Ship Quantity (units)
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
                <TableCell>{item.shipDate}</TableCell>
                <TableCell>{item.shippingQuantity.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Daily Inventory Forecast
        </Typography>
        {calculatedInventoryData.map((item) => (
          <Box key={item.id} sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: themeColors.primary.main, fontWeight: 600 }}>
              {item.product} ({item.sku})
            </Typography>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Projected Inventory</TableCell>
                    <TableCell align="right">Days from Now</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculateDailyInventory(item).map((forecast) => (
                    <TableRow
                      key={forecast.date}
                      sx={{
                        bgcolor:
                          forecast.inventory < item.safetyStock
                            ? themeColors.error.light
                            : "inherit",
                      }}>
                      <TableCell>{forecast.date}</TableCell>
                      <TableCell align="right">
                        {forecast.inventory.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {forecast.daysFromNow}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
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
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.2s ease-in-out",
      }}>
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
  let color = themeColors.success.main;
  let bgColor = themeColors.success.light;

  if (days < 14) {
    color = themeColors.error.main;
    bgColor = themeColors.error.light;
  } else if (days < 30) {
    color = themeColors.warning.main;
    bgColor = themeColors.warning.light;
  }

  return (
    <Chip
      label={`${days} days`}
      sx={{
        color: color,
        bgcolor: bgColor,
        borderColor: color,
        fontWeight: 500,
        "& .MuiChip-label": {
          px: 2,
        },
      }}
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
