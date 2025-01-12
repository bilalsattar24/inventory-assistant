'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EditableCell } from '@/components/EditableCell';
import { Product, NewProduct, fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';

export default function ProductPage() {
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    safety_stock_days: 0,
    production_lead_time_days: 0,
    shipping_lead_time: 0,
    max_stock_days: 0,
    current_stock_units: 0,
  });

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleUpdate = async (id: number, field: keyof NewProduct, value: string | number) => {
    await updateProduct(id, { [field]: value });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  const handleAddNew = async () => {
    await createProduct(newProduct);
    setIsAddingNew(false);
    setNewProduct({
      name: '',
      safety_stock_days: 0,
      production_lead_time_days: 0,
      shipping_lead_time: 0,
      max_stock_days: 0,
      current_stock_units: 0,
    });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isAddingNew && (
              <tr>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Product name"
                  />
                </td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newProduct.safety_stock_days}
                    onChange={(e) => setNewProduct({ ...newProduct, safety_stock_days: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newProduct.production_lead_time_days}
                    onChange={(e) => setNewProduct({ ...newProduct, production_lead_time_days: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newProduct.shipping_lead_time}
                    onChange={(e) => setNewProduct({ ...newProduct, shipping_lead_time: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newProduct.max_stock_days}
                    onChange={(e) => setNewProduct({ ...newProduct, max_stock_days: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newProduct.current_stock_units}
                    onChange={(e) => setNewProduct({ ...newProduct, current_stock_units: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddNew}
                      className="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingNew(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.name}
                    onSave={(value) => handleUpdate(product.id, 'name', value)}
                    type="text"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.safety_stock_days}
                    onSave={(value) => handleUpdate(product.id, 'safety_stock_days', value)}
                    type="number"
                  />
                </td>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.production_lead_time_days}
                    onSave={(value) => handleUpdate(product.id, 'production_lead_time_days', value)}
                    type="number"
                  />
                </td>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.shipping_lead_time}
                    onSave={(value) => handleUpdate(product.id, 'shipping_lead_time', value)}
                    type="number"
                  />
                </td>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.max_stock_days}
                    onSave={(value) => handleUpdate(product.id, 'max_stock_days', value)}
                    type="number"
                  />
                </td>
                <td className="px-6 py-4">
                  <EditableCell
                    value={product.current_stock_units}
                    onSave={(value) => handleUpdate(product.id, 'current_stock_units', value)}
                    type="number"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
