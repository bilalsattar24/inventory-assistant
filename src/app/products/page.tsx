'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EditableCell } from '@/components/EditableCell';
import { Product, NewProduct, fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';

function AddProductButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Add New Product
    </button>
  );
}

function ProductForm({ 
  newProduct, 
  setNewProduct, 
  onSave, 
  onCancel 
}: { 
  newProduct: NewProduct;
  setNewProduct: (product: NewProduct) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border p-8">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Add New Product</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="safety_stock" className="block text-sm font-medium text-gray-700">
              Safety Stock Days
            </label>
            <div className="mt-1 relative">
              <input
                id="safety_stock"
                type="number"
                value={newProduct.safety_stock_days}
                onChange={(e) => setNewProduct({ ...newProduct, safety_stock_days: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="45"
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Minimum stock level to maintain</p>
          </div>

          <div>
            <label htmlFor="production_lead_time" className="block text-sm font-medium text-gray-700">
              Production Lead Time
            </label>
            <div className="mt-1 relative">
              <input
                id="production_lead_time"
                type="number"
                value={newProduct.production_lead_time_days}
                onChange={(e) => setNewProduct({ ...newProduct, production_lead_time_days: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Time needed to produce new stock</p>
          </div>

          <div>
            <label htmlFor="shipping_lead_time" className="block text-sm font-medium text-gray-700">
              Shipping Lead Time
            </label>
            <div className="mt-1 relative">
              <input
                id="shipping_lead_time"
                type="number"
                value={newProduct.shipping_lead_time}
                onChange={(e) => setNewProduct({ ...newProduct, shipping_lead_time: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="15"
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Time needed for shipping</p>
          </div>

          <div>
            <label htmlFor="max_stock" className="block text-sm font-medium text-gray-700">
              Maximum Stock Days
            </label>
            <div className="mt-1 relative">
              <input
                id="max_stock"
                type="number"
                value={newProduct.max_stock_days}
                onChange={(e) => setNewProduct({ ...newProduct, max_stock_days: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="90"
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Maximum days of stock to hold</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <div className="mt-1 relative">
              <input
                id="current_stock"
                type="number"
                value={newProduct.current_stock_units}
                onChange={(e) => setNewProduct({ ...newProduct, current_stock_units: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">units</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Current inventory level</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

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

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">No Products Available</h2>
          <p className="mt-2 text-gray-500">It seems you haven't added any products yet.</p>
        </div>
        {!isAddingNew ? (
          <AddProductButton onClick={() => setIsAddingNew(true)} />
        ) : (
          <ProductForm
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            onSave={handleAddNew}
            onCancel={() => setIsAddingNew(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <AddProductButton onClick={() => setIsAddingNew(true)} />
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
