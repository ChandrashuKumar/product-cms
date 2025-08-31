'use client';

import { useState } from 'react';

interface Product {
  product_id: number;
  product_name: string;
  product_desc: string;
  status: 'Draft' | 'Published' | 'Archived';
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
}

interface DeleteConfirmationProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmation({ product, onClose, onSuccess }: DeleteConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatedBy, setUpdatedBy] = useState('admin');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${product.product_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updated_by: updatedBy || 'admin'
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch {
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white text-gray-900">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Delete Product
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Are you sure?</h4>
                <p className="text-sm text-gray-500">
                  This will soft-delete the product &ldquo;{product.product_name}&rdquo;. The product will be hidden from the main view but can be recovered if needed.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h5 className="font-medium text-gray-900 mb-2">Product Details:</h5>
              <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {product.product_name}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong> {product.status}</p>
              <p className="text-sm text-gray-600"><strong>Created by:</strong> {product.created_by}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name/Username
            </label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Enter your name for audit trail"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !updatedBy}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}