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
  const themeColors = {
    primary: {
      main: "#2D3250", // Deep navy blue
      light: "#424769", // Lighter navy
      dark: "#1B1F31", // Darker navy
      gradient: "linear-gradient(135deg, #2D3250 0%, #1B1F31 100%)",
    },
    accent: {
      orange: "#F6B17A", // Warm orange
      peach: "#FFD9B7", // Light peach
    },
  };
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: themeColors.primary.gradient,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "radial-gradient(circle at top right, rgba(246, 177, 122, 0.1), transparent 70%)",
          },
        }}>
        <Container>
          <Box maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
                mb: 3,
              }}>
              Optimize Your Amazon
              <Box component="span" sx={{ color: themeColors.accent.orange }}>
                {" "}
                Inventory Management
              </Box>
            </Typography>
            <Typography
              variant="h5"
              paragraph
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: "600px",
                lineHeight: 1.6,
              }}>
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
                bgcolor: themeColors.accent.orange,
                color: themeColors.primary.dark,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 4px 14px 0 rgba(246, 177, 122, 0.39)",
                "&:hover": {
                  bgcolor: themeColors.accent.peach,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease-in-out",
              }}>
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#F8F9FA" }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Smart Reorder Predictions"
                description="AI-powered algorithms calculate optimal reorder dates based on your sales velocity and lead times."
                icon={<BarChartIcon sx={{ fontSize: 48 }} />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Inventory Optimization"
                description="Balance storage costs and stockout risks with intelligent inventory level recommendations."
                icon={<InventoryIcon sx={{ fontSize: 48 }} />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Real-time Monitoring"
                description="Track your inventory levels across all Amazon warehouses in real-time."
                icon={<PhoneAndroidIcon sx={{ fontSize: 48 }} />}
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
