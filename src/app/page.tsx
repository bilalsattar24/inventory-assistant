"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          color: "white",
          py: 10,
        }}>
        <Container>
          <Box maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold">
              Optimize Your Amazon Inventory Management
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 4 }}>
              Make data-driven restocking decisions and never run out of
              inventory again. Perfect timing, optimal quantities, maximum
              profits.
            </Typography>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}>
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Smart Reorder Predictions"
                description="AI-powered algorithms calculate optimal reorder dates based on your sales velocity and lead times."
                icon={<BarChartIcon sx={{ fontSize: 40 }} />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Inventory Optimization"
                description="Balance storage costs and stockout risks with intelligent inventory level recommendations."
                icon={<InventoryIcon sx={{ fontSize: 40 }} />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Real-time Monitoring"
                description="Track your inventory levels across all Amazon warehouses in real-time."
                icon={<PhoneAndroidIcon sx={{ fontSize: 40 }} />}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container>
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to Optimize Your Amazon Business?
            </Typography>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}>
              Try It Free
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}>
      <Box sx={{ color: "primary.main", mb: 2 }}>{icon}</Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Paper>
  );
}
