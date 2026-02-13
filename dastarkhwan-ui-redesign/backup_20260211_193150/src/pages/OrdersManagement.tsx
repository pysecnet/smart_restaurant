import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  FunnelIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  FireIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  table_number: number | null;
  guest_name: string | null;
  guest_phone?: string | null;
  guest_address?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      if (!loading) setRefreshing(true);
      else setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: <ClockIcon className="h-4 w-4" />, label: 'Pending' },
    confirmed: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: <CheckCircleIcon className="h-4 w-4" />, label: 'Confirmed' },
    preparing: { color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', icon: <FireIcon className="h-4 w-4" />, label: 'Preparing' },
    ready: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircleIcon className="h-4 w-4" />, label: 'Ready' },
    delivered: { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: <TruckIcon className="h-4 w-4" />, label: 'Delivered' },
    cancelled: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: <XCircleIcon className="h-4 w-4" />, label: 'Cancelled' },
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getNextStatuses = (currentStatus: string): string[] => {
    const flow: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered'],
      delivered: [],
      cancelled: [],
    };
    return flow[currentStatus] || [];
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Helper to get customer info from order
  const getCustomerName = (order: Order): string | null => {
    return order.customer_name || order.guest_name || null;
  };
  const getCustomerPhone = (order: Order): string | null => {
    return order.customer_phone || order.guest_phone || null;
  };
  const getCustomerAddress = (order: Order): string | null => {
    return order.customer_address || order.guest_address || null;
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                <div className="h-9 w-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load orders</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button onClick={fetchOrders} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2233]">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders · Auto-refreshes every 30s</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <FunnelIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as StatusFilter[]).map(status => {
          const count = status === 'all' ? orders.length : (statusCounts[status] || 0);
          const isActive = filter === status;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1a2233] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all' ? 'No orders have been placed yet.' : `No ${filter} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const nextStatuses = getNextStatuses(order.status);
            const customerName = getCustomerName(order);
            const customerPhone = getCustomerPhone(order);
            const customerAddress = getCustomerAddress(order);
            const isOnlineOrder = !order.table_number;

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-5 sm:p-6">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} border flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#1a2233]">{order.order_number}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500 flex-wrap">
                          <span>{getTimeAgo(order.created_at)}</span>
                          {order.table_number && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span>Table {order.table_number}</span>
                            </>
                          )}
                          {!order.table_number && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="px-1.5 py-0.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-md">Online Order</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      <p className="text-lg font-bold text-[#1a2233]">Rs. {order.total_amount.toFixed(0)}</p>
                    </div>
                  </div>

                  {/* Customer Info - shown for online orders or when customer details are available */}
                  {(customerName || customerPhone || customerAddress) && (
                    <div className="mb-4 py-3 px-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Customer Details</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {customerName && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <UserIcon className="h-3.5 w-3.5 text-blue-400" />
                            <span className="font-medium">{customerName}</span>
                          </div>
                        )}
                        {customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <PhoneIcon className="h-3.5 w-3.5 text-blue-400" />
                            <a href={`tel:${customerPhone}`} className="font-medium hover:text-blue-600 transition-colors">{customerPhone}</a>
                          </div>
                        )}
                        {customerAddress && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPinIcon className="h-3.5 w-3.5 text-blue-400" />
                            <span>{customerAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-4 py-3 px-4 bg-gray-50 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg">
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {nextStatuses.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {nextStatuses.map(nextStatus => {
                        const nextConfig = statusConfig[nextStatus];
                        const isPrimary = nextStatus !== 'cancelled';
                        return (
                          <button
                            key={nextStatus}
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              isPrimary
                                ? 'bg-[#1a2233] text-white hover:bg-[#2d3748] shadow-sm'
                                : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {nextConfig?.icon}
                            {nextStatus === 'cancelled' ? 'Cancel' : `Mark ${nextConfig?.label}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
