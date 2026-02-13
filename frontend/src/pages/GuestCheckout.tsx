import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const GuestCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, tableNumber, guestName } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart || !tableNumber) {
    navigate('/menu');
    return null;
  }

  const getTotalPrice = () => cart.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        table_number: parseInt(tableNumber),
        guest_name: guestName,
        items: cart.map((item: CartItem) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getTotalPrice(),
        status: 'pending',
        order_type: 'dine_in'
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders/guest`, orderData);

      if (response.data?.order_number) {
        localStorage.removeItem(`guest_cart_table_${tableNumber}`);
        navigate(`/order-status/${response.data.order_number}`, {
          state: { tableNumber, guestName },
          replace: true
        });
      } else {
        setError('Order placed but no order number received');
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2233] mb-6 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Menu
        </button>

        <h1 className="text-2xl font-bold text-[#1a2233] mb-6">Confirm Your Order</h1>

        {/* Order Meta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                <span className="text-lg">🪑</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2233]">Table {tableNumber}</p>
                {guestName && <p className="text-xs text-gray-500">{guestName}</p>}
              </div>
            </div>
            <span className="text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
              Guest Order
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1a2233]">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {item.quantity}×
                </span>
                <span className="flex-1 text-sm font-medium text-[#1a2233]">{item.name}</span>
                <span className="text-sm font-semibold text-[#1a2233]">Rs. {(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t-2 border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-base font-bold text-[#1a2233]">Total</span>
            <span className="text-xl font-bold text-[#FFD700]">Rs. {getTotalPrice().toFixed(0)}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} disabled={submitting} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="flex-1 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />
                Placing...
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

export default GuestCheckout;
