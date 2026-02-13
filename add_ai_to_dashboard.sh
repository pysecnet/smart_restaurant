#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

DASHBOARD_FILE="$HOME/Downloads/resturent/final year project/final year project/smart-restaurant/src/pages/CompleteAdminDashboard.tsx"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Adding AI Analytics to Dashboard${NC}"
echo -e "${BLUE}========================================${NC}"

# Backup
cp "$DASHBOARD_FILE" "$DASHBOARD_FILE.backup"
echo -e "${GREEN}✅ Backup created${NC}"

# Check if already exists
if grep -q "AI Analytics" "$DASHBOARD_FILE"; then
    echo -e "${BLUE}ℹ️  AI Analytics already exists!${NC}"
    exit 0
fi

# Create new dashboard file with AI Analytics
cat > "$DASHBOARD_FILE" << 'EOF'
import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon, 
  ShoppingBagIcon,
  CalendarIcon,
  TableCellsIcon,
  CpuChipIcon,
  ArrowRightOnRectangleIcon
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
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
      
      setStats({
        totalOrders,
        pendingOrders,
        todayRevenue,
        activeReservations
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        activeReservations: 0
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const menuItems = [
    {
      title: 'Orders Management',
      description: 'View and manage all orders',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      path: '/admin/orders',
      stat: stats.pendingOrders,
      statLabel: 'Pending'
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, and remove menu items',
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      path: '/admin/menu',
      stat: null,
      statLabel: null
    },
    {
      title: 'Tables Management',
      description: 'Manage restaurant tables',
      icon: TableCellsIcon,
      color: 'bg-purple-500',
      path: '/admin/tables',
      stat: null,
      statLabel: null
    },
    {
      title: 'Reservations',
      description: 'View and manage reservations',
      icon: CalendarIcon,
      color: 'bg-yellow-500',
      path: '/admin/reservations',
      stat: stats.activeReservations,
      statLabel: 'Active'
    },
    {
      title: 'AI Analytics',
      description: 'AI-powered insights and predictions',
      icon: CpuChipIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      path: '/admin/ai-analytics',
      stat: null,
      statLabel: null,
      emoji: '🤖'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back! Manage your restaurant</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Pending Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Today's Revenue</dt>
                <dd className="text-2xl font-semibold text-gray-900">${stats.todayRevenue.toFixed(2)}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Reservations</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.activeReservations}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.color} rounded-lg p-3`}>
                    {item.emoji ? (
                      <span className="text-3xl">{item.emoji}</span>
                    ) : (
                      <item.icon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  {item.stat && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
                      <p className="text-xs text-gray-500">{item.statLabel}</p>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                <div className="mt-4">
                  <span className="text-orange-600 text-sm font-medium hover:text-orange-700">
                    Go to {item.title} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAdminDashboard;
EOF

echo -e "${GREEN}✅ AI Analytics card added!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✨ Features:${NC}"
echo -e "   🤖 AI Analytics with robot emoji"
echo -e "   🎨 Purple-pink gradient background"
echo -e "   📊 Links to /admin/ai-analytics"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Refresh your browser now!${NC}"
