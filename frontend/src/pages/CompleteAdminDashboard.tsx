import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon, 
  ShoppingBagIcon,
  CalendarIcon,
  TableCellsIcon,
  CpuChipIcon,
  ArrowRightOnRectangleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BellAlertIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  activeReservations: number;
}

const CompleteAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    activeReservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const ordersRes = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const reservationsRes = await axios.get(`${API_BASE_URL}/api/reservations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const orders = ordersRes.data || [];
      const reservations = reservationsRes.data || [];
      
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const todayRevenue = orders
        .filter((o: any) => {
          const orderDate = new Date(o.created_at).toDateString();
          const today = new Date().toDateString();
          return orderDate === today;
        })
        .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);
      const activeReservations = reservations.filter((r: any) => 
        r.status === 'pending' || r.status === 'confirmed'
      ).length;
      
      setStats({ totalOrders, pendingOrders, todayRevenue, activeReservations });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({ totalOrders: 0, pendingOrders: 0, todayRevenue: 0, activeReservations: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ClipboardDocumentListIcon,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: BellAlertIcon,
      gradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      change: null,
      urgent: stats.pendingOrders > 0,
    },
    {
      title: "Today's Revenue",
      value: `Rs. ${stats.todayRevenue.toFixed(0)}`,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-emerald-500 to-green-600',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: '+8%',
    },
    {
      title: 'Active Reservations',
      value: stats.activeReservations,
      icon: CalendarIcon,
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      textColor: 'text-violet-600',
      change: null,
    },
  ];

  const managementCards = [
    {
      title: 'Orders Management',
      description: 'View and manage all incoming orders in real-time',
      icon: ClipboardDocumentListIcon,
      gradient: 'from-blue-500 to-blue-600',
      path: '/admin/orders',
      stat: stats.pendingOrders,
      statLabel: 'Pending',
      statColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, and organize your menu items',
      icon: ShoppingBagIcon,
      gradient: 'from-emerald-500 to-green-600',
      path: '/admin/menu',
      stat: null,
      statLabel: null,
      statColor: '',
    },
    {
      title: 'Tables & QR Codes',
      description: 'Manage tables and generate QR codes for ordering',
      icon: TableCellsIcon,
      gradient: 'from-violet-500 to-purple-600',
      path: '/admin/tables',
      stat: null,
      statLabel: null,
      statColor: '',
    },
    {
      title: 'Reservations',
      description: 'View and manage upcoming reservations',
      icon: CalendarIcon,
      gradient: 'from-amber-500 to-orange-500',
      path: '/admin/reservations',
      stat: stats.activeReservations,
      statLabel: 'Active',
      statColor: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'AI Analytics',
      description: 'AI-powered insights, predictions, and recommendations',
      icon: CpuChipIcon,
      gradient: 'from-pink-500 to-rose-600',
      path: '/admin/ai-analytics',
      stat: null,
      statLabel: null,
      statColor: '',
      badge: 'AI',
    },
  ];

  // Skeleton loader for stat cards
  const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="w-16 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded mb-1" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center">
                  <span className="text-[#1a2233] text-lg font-bold">D</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1a2233]">{greeting()}, Admin</h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {' · '}
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchDashboardStats} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                Refresh
              </button>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            statCards.map((card, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 ${card.urgent ? 'ring-2 ring-amber-200' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  {card.change && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {card.change}
                    </span>
                  )}
                  {card.urgent && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#1a2233] mb-1">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            ))
          )}
        </div>

        {/* Management Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1a2233]">Management</h2>
              <p className="text-sm text-gray-500 mt-0.5">Quick access to all restaurant operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {managementCards.map((card, index) => (
              <div
                key={index}
                onClick={() => navigate(card.path)}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {card.badge && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                          {card.badge}
                        </span>
                      )}
                      {card.stat !== null && card.stat > 0 && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.statColor}`}>
                          {card.stat} {card.statLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a2233] mb-1.5">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.description}</p>
                  <div className="flex items-center text-sm font-medium text-[#FFD700] group-hover:text-[#e6c200] transition-colors">
                    <span>Open</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <CpuChipIcon className="h-5 w-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">AI Tip</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Check AI Analytics regularly to spot trending items and optimize your menu. 
                The more orders processed, the smarter the predictions become.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAdminDashboard;
