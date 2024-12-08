"use client";
import React, { useState } from "react";
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
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, InfoOutlineIcon } from "@chakra-ui/icons";

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

// Add these utility functions at the top
function calculateNextOrderInfo(
  currentStock: number,
  dailySales: number,
  safetyStockDays: number,
  leadTime: number
) {
  // Calculate days until safety stock is reached
  const daysUntilSafetyStock = Math.floor(
    (currentStock - safetyStockDays * dailySales) / dailySales
  );

  // Calculate when to place the order (considering lead time)
  const daysUntilOrder = Math.max(0, daysUntilSafetyStock - leadTime);
  
  // Calculate the next order date
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() + daysUntilOrder);
  
  // Calculate the shipping date (order date + lead time)
  const shipDate = new Date(orderDate);
  shipDate.setDate(shipDate.getDate() + leadTime);

  // Calculate optimal order quantity:
  // Cover lead time + safety stock period + 30 days of sales
  const orderQuantity = Math.ceil(dailySales * (leadTime + safetyStockDays + 30));

  return {
    orderDate,
    shipDate,
    orderQuantity,
    daysUntilOrder,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  averageDailySales: number;
  status: string;
}

export default function Dashboard() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [parameters, setParameters] = useState({
    leadTime: 30,
    safetyStock: 14,
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Product A",
      sku: "SKU001",
      currentStock: 150,
      averageDailySales: 2.5,
      status: "Healthy",
    },
    {
      id: "2",
      name: "Product B",
      sku: "SKU002",
      currentStock: 50,
      averageDailySales: 3,
      status: "Warning",
    },
    {
      id: "3",
      name: "Product C",
      sku: "SKU003",
      currentStock: 25,
      averageDailySales: 1.5,
      status: "Critical",
    },
  ]);

  const handleInventoryChange = (
    id: string,
    field: "currentStock" | "averageDailySales",
    value: string
  ) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;

    setInventoryItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: numValue };
          // Update status based on new values
          const daysOfStock = updatedItem.currentStock / updatedItem.averageDailySales;
          updatedItem.status = 
            daysOfStock > 45 ? "Healthy" :
            daysOfStock > 30 ? "Warning" : "Critical";
          return updatedItem;
        }
        return item;
      })
    );
  };

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

  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="stretch">
        <Box>
          <Heading size="lg" mb={6}>
            Inventory Dashboard
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
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
                    <Th>Next Order Date</Th>
                    <Th isNumeric>Recommended Order</Th>
                    <Th>Expected Arrival</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventoryItems.map((item) => {
                    const nextOrder = calculateNextOrderInfo(
                      item.currentStock,
                      item.averageDailySales,
                      parameters.safetyStock,
                      parameters.leadTime
                    );
                    
                    return (
                      <React.Fragment key={item.id}>
                        <Tr>
                          <Td>{item.name}</Td>
                          <Td>{item.sku}</Td>
                          <Td isNumeric>
                            <Input
                              type="number"
                              value={item.currentStock}
                              onChange={(e) => 
                                handleInventoryChange(item.id, "currentStock", e.target.value)
                              }
                              size="sm"
                              width="80px"
                              textAlign="right"
                              min={0}
                            />
                          </Td>
                          <Td isNumeric>
                            <Input
                              type="number"
                              value={item.averageDailySales}
                              onChange={(e) => 
                                handleInventoryChange(item.id, "averageDailySales", e.target.value)
                              }
                              size="sm"
                              width="80px"
                              textAlign="right"
                              min={0}
                              step={0.1}
                            />
                          </Td>
                          <Td>
                            <Text color={nextOrder.daysUntilOrder <= 7 ? "red.500" : undefined}>
                              {formatDate(nextOrder.orderDate)}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Text fontWeight="semibold">
                              {nextOrder.orderQuantity}
                            </Text>
                          </Td>
                          <Td>{formatDate(nextOrder.shipDate)}</Td>
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
                                  <Icon as={ChevronUpIcon} />
                                ) : (
                                  <Icon as={ChevronDownIcon} />
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
                                        <Heading size="sm">
                                          Stock Analysis
                                        </Heading>
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
                    );
                  })}
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
              <Box as="span">
                <Icon as={InfoOutlineIcon} color="gray.500" />
              </Box>
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
