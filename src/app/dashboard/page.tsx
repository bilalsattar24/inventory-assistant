"use client";
import React, { useState } from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import {
  Box,
  Container,
  Table,
  Td,
  Tr,
  Thead,
  Tbody,
  Text,
  Badge,
  Slider,
  SliderTrack,
  SliderThumb,
  Grid,
  Input,
  Card,
  CardBody,
  Button,
  Tooltip,
  VStack,
  HStack,
  Heading,
  Collapse,
  SliderFilledTrack,
  Th,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from "@chakra-ui/icons";

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

// Add this function to calculate daily inventory levels
function calculateDailyInventory(item: any, days: number = 100) {
  const dailyInventory = [];
  let currentInventory = item.currentStock;
  const dailySales = item.averageDailySales;

  for (let i = 0; i < days; i++) {
    dailyInventory.push({
      day: i,
      inventory: Math.max(0, currentInventory - dailySales * i),
    });
  }

  return dailyInventory;
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [parameters, setParameters] = useState({
    leadTime: 30,
    safetyStock: 14,
    orderQuantity: 100,
  });

  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const inventoryItems = [
    {
      id: "1",
      name: "Product A",
      sku: "SKU001",
      currentStock: 150,
      averageDailySales: 2.5,
      reorderPoint: 75,
      status: "Healthy",
    },
    {
      id: "2",
      name: "Product B",
      sku: "SKU002",
      currentStock: 50,
      averageDailySales: 3,
      reorderPoint: 90,
      status: "Warning",
    },
    {
      id: "3",
      name: "Product C",
      sku: "SKU003",
      currentStock: 25,
      averageDailySales: 1.5,
      reorderPoint: 45,
      status: "Critical",
    },
  ];

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleParameterChange = (
    parameter: keyof typeof parameters,
    value: number
  ) => {
    setParameters((prev) => ({ ...prev, [parameter]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "green";
      case "warning":
        return "yellow";
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  const calculateDaysUntilStockout = (item: any) => {
    return Math.floor(item.currentStock / item.averageDailySales);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack  align="stretch">
        <Box>
          <Heading size="lg" mb={6}>
            Inventory Dashboard
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <ParameterCard
              title="Lead Time"
              value={parameters.leadTime}
              onChange={(value) => handleParameterChange("leadTime", value)}
              min={1}
              max={90}
              step={1}
              tooltip="Average time in days from order placement to delivery"
            />
            <ParameterCard
              title="Safety Stock Days"
              value={parameters.safetyStock}
              onChange={(value) => handleParameterChange("safetyStock", value)}
              min={0}
              max={30}
              step={1}
              tooltip="Buffer stock to maintain for unexpected demand or delays"
            />
            <ParameterCard
              title="Order Quantity"
              value={parameters.orderQuantity}
              onChange={(value) => handleParameterChange("orderQuantity", value)}
              min={10}
              max={1000}
              step={10}
              tooltip="Standard quantity to order for each restock"
            />
          </Grid>
        </Box>

        <Card variant="outline">
          <CardBody>
            <Box overflowX="auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Product Name</Th>
                    <Th>SKU</Th>
                    <Th isNumeric>Current Stock</Th>
                    <Th isNumeric>Daily Sales</Th>
                    <Th isNumeric>Reorder Point</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventoryItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <Tr>
                        <Td>{item.name}</Td>
                        <Td>{item.sku}</Td>
                        <Td isNumeric>{item.currentStock}</Td>
                        <Td isNumeric>{item.averageDailySales.toFixed(1)}</Td>
                        <Td isNumeric>{item.reorderPoint}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            onClick={() => toggleExpanded(item.id)}
                            rightIcon={
                              expanded[item.id] ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            }
                          >
                            Details
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td colSpan={7} p={0}>
                          <Collapse in={expanded[item.id]} animateOpacity>
                            <Box p={4} bg={bgColor} borderColor={borderColor}>
                              <Grid
                                templateColumns={{
                                  base: "1fr",
                                  md: "repeat(2, 1fr)",
                                }}
                                gap={4}
                              >
                                <Card>
                                  <CardBody>
                                    <VStack align="start" spacing={4}>
                                      <Heading size="sm">Stock Analysis</Heading>
                                      <StockoutIndicator
                                        days={calculateDaysUntilStockout(item)}
                                      />
                                      <Text>
                                        Order Date:{" "}
                                        {calculateOrderDate(
                                          calculateDaysUntilStockout(item)
                                        )}
                                      </Text>
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </Grid>
                            </Box>
                          </Collapse>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
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
      <CardBody>
        <VStack spacing={4}>
          <HStack>
            <Text fontWeight="semibold">{title}</Text>
            <Tooltip label={tooltip}>
              <InfoIcon color="gray.500" />
            </Tooltip>
          </HStack>
          <HStack w="100%" spacing={4}>
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              width="80px"
            />
            <Slider
              flex="1"
              value={value}
              onChange={onChange}
              min={min}
              max={max}
              step={step}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

function StockoutIndicator({ days }: { days: number }) {
  const getStockoutStatus = () => {
    if (days > 30) {
      return { color: "green", message: "Healthy" };
    } else if (days > 14) {
      return { color: "yellow", message: "Monitor" };
    } else {
      return { color: "red", message: "Critical" };
    }
  };

  const status = getStockoutStatus();

  return (
    <HStack spacing={2}>
      <Text>Days until stockout:</Text>
      <Badge colorScheme={status.color}>
        {days} days ({status.message})
      </Badge>
    </HStack>
  );
}

function calculateOrderDate(daysUntilStockout: number): string {
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() + daysUntilStockout);
  return orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
