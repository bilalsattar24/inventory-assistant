'use client';

import { useEffect, useState } from 'react';
import { Order, fetchOrders } from '@/lib/orders';

interface ProductOrdersProps {
  productId: number;
}

export default function ProductOrders({ productId }: ProductOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders(productId);
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    if (productId) {
      loadOrders();
    }
  }, [productId]);

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Recent Orders</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {orders.slice(0, 3).map((order) => (
          <div 
            key={order.id} 
            className="min-w-[200px] max-w-[250px] p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order #{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm">
                <div>Quantity: {order.quantity}</div>
                <div className="text-xs text-gray-500">
                  Expected: {order.expected_delivery_date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
