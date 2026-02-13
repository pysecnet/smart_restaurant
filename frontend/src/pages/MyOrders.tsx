import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import { ArrowPathIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

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
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

const statusConfig: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: '📝', label: 'Pending' },
  confirmed: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: '✅', label: 'Confirmed' },
  preparing: { bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700', icon: '👨‍🍳', label: 'Preparing' },
  ready: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: '🍽️', label: 'Ready' },
  delivered: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', icon: '✨', label: 'Delivered' },
  cancelled: { bg: 'bg-red-50 border-red-200', text: 'text-red-600', icon: '❌', label: 'Cancelled' },
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/auth'); return; }

      const response = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setError('Invalid response format from server');
      }
      setError(null);
    } catch (err: any) {
      if (err.response) {
        const errorMsg = err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data);
        setError(`Server error: ${errorMsg}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-52 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="h-7 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                  <div className="h-6 w-20 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#1a2233] mb-2">Error Loading Orders</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3">
            <button onClick={fetchOrders} className="flex-1 px-5 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold hover:bg-[#e6c200] transition-colors">
              Try Again
            </button>
            <button onClick={() => navigate('/menu')} className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Go to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2233]">My Orders</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track all your orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2233] mb-2">No Orders Yet</h2>
            <p className="text-gray-500 text-sm mb-6">Start ordering delicious food from our menu!</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold hover:bg-[#e6c200] transition-colors"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const isActive = !['delivered', 'cancelled'].includes(order.status);

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden ${isActive ? 'ring-1 ring-[#FFD700]/20' : ''}`}
                >
                  <div className="p-5 sm:p-6">
                    {/* Top */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-[#1a2233]">
                          Order #{order.order_number}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span>{getTimeAgo(order.created_at)}</span>
                          {order.table_number && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span>Table {order.table_number}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
                          <span>{config.icon}</span>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-lg font-bold text-[#1a2233]">Rs. {order.total_amount.toFixed(0)}</p>
                      <div className="flex gap-2">
                        {isActive && (
                          <button
                            onClick={() => navigate(`/order-status/${order.order_number}`)}
                            className="px-4 py-2 bg-[#FFD700] text-[#1a2233] rounded-xl text-sm font-semibold hover:bg-[#e6c200] transition-colors"
                          >
                            Track Order
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => navigate('/menu')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Order Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
