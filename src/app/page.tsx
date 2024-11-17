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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";

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
export default function LandingPage() {
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

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "white" }}>
        <Container>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: "bold",
              color: themeColors.primary.main,
            }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<CheckCircleOutlineIcon />}
                title="Reduce Stockouts"
                description="Our predictive analytics help you maintain optimal inventory levels, reducing stockouts by up to 95%."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<SecurityIcon />}
                title="Save Time & Money"
                description="Automated calculations and recommendations save hours of manual work each week."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<StarIcon />}
                title="Increase Profits"
                description="Better inventory management leads to reduced storage fees and improved cash flow."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<PeopleIcon />}
                title="Easy to Use"
                description="Intuitive interface requires no technical expertise. Get started in minutes."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: "#F8F9FA",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "radial-gradient(circle at bottom right, rgba(246, 177, 122, 0.1), transparent 70%)",
          },
        }}>
        <Container>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: "bold",
              color: themeColors.primary.main,
            }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <TestimonialCard
                quote="This tool has completely transformed how we manage our Amazon inventory. We've reduced our stockouts by 90%."
                author="Sarah Johnson"
                role="E-commerce Manager"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TestimonialCard
                quote="The predictive analytics are spot-on. We've saved thousands in storage fees and improved our cash flow."
                author="Michael Chen"
                role="Business Owner"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TestimonialCard
                quote="Setup was quick and the interface is intuitive. This is exactly what we needed for our Amazon business."
                author="David Smith"
                role="Operations Director"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "white" }}>
        <Container>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: "bold",
              color: themeColors.primary.main,
            }}>
            Simple, Transparent Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <PricingCard
                title="Starter"
                price="$49"
                period="/month"
                features={[
                  "Up to 100 SKUs",
                  "Basic Analytics",
                  "Email Support",
                  "7-Day History",
                ]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PricingCard
                title="Professional"
                price="$99"
                period="/month"
                featured={true}
                features={[
                  "Unlimited SKUs",
                  "Advanced Analytics",
                  "Priority Support",
                  "30-Day History",
                  "Custom Parameters",
                ]}
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

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
      <Box
        sx={{
          color: themeColors.accent.orange,
          p: 1,
          borderRadius: "8px",
          bgcolor: "rgba(246, 177, 122, 0.1)",
        }}>
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: themeColors.primary.main,
            fontWeight: 600,
            mb: 1,
          }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>
    </Box>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        height: "100%",
        borderRadius: "12px",
        bgcolor: "white",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        },
      }}>
      <Typography
        sx={{
          mb: 3,
          fontStyle: "italic",
          color: "text.secondary",
          lineHeight: 1.6,
        }}>
        "{quote}"
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color={themeColors.primary.main}>
        {author}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {role}
      </Typography>
    </Paper>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <Paper
      elevation={featured ? 4 : 0}
      sx={{
        p: 4,
        height: "100%",
        borderRadius: "12px",
        bgcolor: "white",
        border: featured
          ? `2px solid ${themeColors.accent.orange}`
          : "1px solid #eee",
        transition: "all 0.2s ease-in-out",
        transform: featured ? "scale(1.05)" : "none",
        "&:hover": {
          transform: featured ? "scale(1.05)" : "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        },
      }}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color={themeColors.primary.main}>
          {price}
        </Typography>
        <Typography color="text.secondary">{period}</Typography>
      </Box>
      <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
        {features.map((feature, index) => (
          <Box
            key={index}
            component="li"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
            <CheckCircleOutlineIcon sx={{ color: themeColors.accent.orange }} />
            <Typography>{feature}</Typography>
          </Box>
        ))}
      </Box>
      <Button
        variant={featured ? "contained" : "outlined"}
        fullWidth
        sx={{
          mt: 3,
          bgcolor: featured ? themeColors.accent.orange : "transparent",
          color: featured ? themeColors.primary.dark : themeColors.primary.main,
          borderColor: featured ? "transparent" : themeColors.primary.main,
          "&:hover": {
            bgcolor: featured
              ? themeColors.accent.peach
              : "rgba(45, 50, 80, 0.05)",
          },
        }}>
        Get Started
      </Button>
    </Paper>
  );
}
