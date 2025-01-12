import React from 'react';
import {
  VStack,
  Box,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { OrderShipment } from '../types';

interface OrderShipmentsProps {
  shipments: OrderShipment[];
}

export function OrderShipments({ shipments }: OrderShipmentsProps) {
  return (
    <VStack align="stretch" spacing={4}>
      {shipments.map((shipment, index) => (
        <Box key={index} p={4} borderWidth={1} borderRadius="md">
          <Text>
            Order Date: {format(shipment.orderDate, "MMM d, yyyy")}
          </Text>
          <Text>Order Quantity: {shipment.orderQuantity}</Text>
          <Text>
            Ship Date: {format(shipment.shipDate, "MMM d, yyyy")}
          </Text>
          <Text>Ship Quantity: {shipment.shipQuantity}</Text>
          {shipment.lowStockAlert && (
            <Alert status="warning" mt={2}>
              <AlertIcon />
              {shipment.lowStockAlert}
            </Alert>
          )}
        </Box>
      ))}
    </VStack>
  );
}
