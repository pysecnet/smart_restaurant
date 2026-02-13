import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  table_number: number | null;
  guest_name: string | null;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

const steps = [
  { key: 'pending', label: 'Received', icon: '📝', description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', description: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Chef is preparing your food' },
  { key: 'ready', label: 'Ready', icon: '🍽️', description: 'Your order is ready for pickup' },
];

const OrderStatus: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!orderNumber) return;
    fetchOrder();
    const interval = setInterval(() => {
      fetchOrder();
      setLastRefresh(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [orderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/track/${orderNumber}`);
      setOrder(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : -1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-[#1a2233] mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">{error || 'Unable to find your order'}</p>
          <div className="flex gap-3">
            <button onClick={fetchOrder} className="flex-1 px-5 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold hover:bg-[#e6c200] transition-colors">
              Try Again
            </button>
            <button onClick={() => navigate(-1)} className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isComplete = isDelivered || isCancelled;

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2233] mb-6 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        {/* Status Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          {/* Status Banner */}
          <div className={`px-6 py-5 ${
            isCancelled ? 'bg-gradient-to-r from-red-500 to-red-600' :
            isDelivered ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
            'bg-gradient-to-r from-[#1a2233] to-[#2d3748]'
          }`}>
            <div className="text-center text-white">
              <div className="text-4xl mb-2">
                {isCancelled ? '❌' : isDelivered ? '✨' : steps[currentStepIndex]?.icon || '📦'}
              </div>
              <h1 className="text-2xl font-bold mb-1">
                {isCancelled ? 'Order Cancelled' : isDelivered ? 'Order Delivered!' : steps[currentStepIndex]?.description || 'Processing'}
              </h1>
              <p className="text-white/70 text-sm">Order #{order.order_number}</p>
            </div>
          </div>

          {/* Order Meta */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {order.table_number && <span>Table {order.table_number}</span>}
              {order.guest_name && <span>{order.guest_name}</span>}
              <span>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <button onClick={fetchOrder} className="text-gray-400 hover:text-[#1a2233] transition-colors">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="px-6 py-6">
              <div className="flex items-start justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-[#FFD700] transition-all duration-700 ease-out"
                    style={{
                      width: isDelivered ? '100%' : `${(currentStepIndex / (steps.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {steps.map((step, index) => {
                  const isActive = index <= currentStepIndex || isDelivered;
                  const isCurrent = index === currentStepIndex && !isDelivered;
                  return (
                    <div key={step.key} className="relative flex flex-col items-center text-center z-10" style={{ width: `${100 / steps.length}%` }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-[#FFD700] scale-110 shadow-lg shadow-[#FFD700]/30 ring-4 ring-[#FFD700]/20'
                          : isActive
                            ? 'bg-[#FFD700]'
                            : 'bg-gray-200'
                      }`}>
                        {step.icon}
                      </div>
                      <p className={`text-xs mt-2 font-medium ${isActive ? 'text-[#1a2233]' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1a2233]">Your Order</h2>
          </div>
          <div className="px-6 divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {item.quantity}×
                  </span>
                  <span className="font-medium text-[#1a2233]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#1a2233]">
                  Rs. {(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t-2 border-gray-100 flex justify-between items-center">
            <span className="text-base font-bold text-[#1a2233]">Total</span>
            <span className="text-xl font-bold text-[#FFD700]">
              Rs. {order.total_amount.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live · Updates every 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
