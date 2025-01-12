"use client";

import { Order, createOrder, updateOrder, deleteOrder } from "@/lib/orders";
import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ProductOrdersProps {
  orders: Order[];
  isLoading: boolean;
}

export default function ProductOrders({
  orders,
  isLoading,
}: ProductOrdersProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [units, setUnits] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get product_id from the first order since all orders are for the same product
  const productId = orders[0]?.product_id;

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />;
  }

  const handleSubmit = async () => {
    try {
      if (selectedOrder) {
        // Update existing order
        await updateOrder(selectedOrder.id, {
          units: parseInt(units),
          expected_arrival_date: expectedDate,
        });
        toast({ title: "Order updated successfully", status: "success" });
      } else {
        // Create new order
        await createOrder({
          units: parseInt(units),
          expected_arrival_date: expectedDate,
          product_id: productId,
        });
        toast({ title: "Order created successfully", status: "success" });
      }
      queryClient.invalidateQueries({ queryKey: ["orders", productId] });
      onClose();
      setSelectedOrder(null);
      setUnits("");
      setExpectedDate("");
    } catch (error) {
      toast({ title: "Error saving order", status: "error" });
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await deleteOrder(orderId);
      queryClient.invalidateQueries({ queryKey: ["orders", productId] });
      toast({ title: "Order deleted successfully", status: "success" });
    } catch (error) {
      toast({ title: "Error deleting order", status: "error" });
    }
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setUnits(order.units.toString());
    setExpectedDate(order.expected_arrival_date);
    onOpen();
  };

  const openCreateModal = () => {
    setSelectedOrder(null);
    setUnits("");
    setExpectedDate("");
    onOpen();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Orders</h3>
        {productId && (
          <Button size="sm" colorScheme="blue" onClick={openCreateModal}>
            New Order
          </Button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="min-w-[200px] max-w-[250px] p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order #{order.id}</span>
                <div className="flex gap-2">
                  <Button size="xs" onClick={() => openEditModal(order)}>
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="text-sm">
                <div>Units: {order.units}</div>
                <div className="text-xs text-gray-500">
                  Expected: {order.expected_arrival_date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedOrder ? "Edit Order" : "Create New Order"}
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Units</FormLabel>
              <Input
                type="number"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expected Arrival Date</FormLabel>
              <Input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {selectedOrder ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
