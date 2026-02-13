import { API_BASE_URL } from "../config/api";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, ShoppingBagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart: CartItem[] = location.state?.cart || [];
  const tableId = location.state?.tableId || null;
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({ menu_item_id: item.id, quantity: item.quantity })),
        table_number: tableId ? String(tableId) : undefined,
        notes: specialInstructions || undefined
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      navigate('/menu', { state: { clearCart: true } });
      // Could also navigate to order status: navigate(`/order-status/${response.data.order_number}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/auth');
      } else {
        alert(error.response?.data?.detail || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center max-w-md w-full">
          <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1a2233] mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-6">Add some delicious items from our menu first!</p>
          <button onClick={() => navigate('/menu')} className="px-6 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold hover:bg-[#e6c200] transition-colors">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2233] mb-6 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Menu
        </button>

        <h1 className="text-2xl font-bold text-[#1a2233] mb-6">Order Summary</h1>

        {/* Table info */}
        {tableId && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-5 flex items-center gap-2">
            <span className="text-blue-600 text-sm font-medium">📍 Table {tableId}</span>
          </div>
        )}

        {/* Items Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1a2233]">Items ({cart.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {item.quantity}×
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#1a2233] truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400">Rs. {item.price.toFixed(0)} each</p>
                </div>
                <span className="text-sm font-semibold text-[#1a2233]">Rs. {(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-6">
          <label className="block text-sm font-medium text-[#1a2233] mb-2">
            Special Instructions
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests for your order..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all resize-none"
            rows={3}
          />
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-600">Total</span>
            <span className="text-2xl font-bold text-[#1a2233]">Rs. {cartTotal.toFixed(0)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/menu')} disabled={loading} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex-1 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
