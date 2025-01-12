'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  created_at: string;
  name: string;
  safety_stock_days: number;
  production_lead_time_days: number;
  shipping_lead_time: number;
  max_stock_days: number;
  current_stock_units: number;
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from('Product')
    .select('*');
  
  if (error) throw error;
  return data;
}

export default function ProductPage() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Stock Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Lead Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Lead Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Stock Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.safety_stock_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.production_lead_time_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.shipping_lead_time} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.max_stock_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.current_stock_units} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
