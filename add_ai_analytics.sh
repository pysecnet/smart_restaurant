#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

SIDEBAR_PATH="$HOME/Downloads/resturent/final year project/final year project/smart-restaurant/src/pages/admin/Sidebar.tsx"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Adding AI Analytics to Admin Sidebar${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if file exists
if [ ! -f "$SIDEBAR_PATH" ]; then
    echo -e "${RED}❌ Sidebar.tsx not found!${NC}"
    exit 1
fi

# Backup
cp "$SIDEBAR_PATH" "$SIDEBAR_PATH.backup"
echo -e "${GREEN}✅ Backup created${NC}"

# Check if already exists
if grep -q "AI Analytics" "$SIDEBAR_PATH"; then
    echo -e "${BLUE}ℹ️  AI Analytics already exists!${NC}"
    exit 0
fi

# Create new Sidebar with AI Analytics
cat > "$SIDEBAR_PATH" << 'EOF'
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  TableCellsIcon,
  CalendarIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/admin/menu', icon: ClipboardDocumentListIcon, label: 'Menu' },
  { path: '/admin/orders', icon: ShoppingCartIcon, label: 'Orders' },
  { path: '/admin/tables', icon: TableCellsIcon, label: 'Tables' },
  { path: '/admin/reservations', icon: CalendarIcon, label: 'Reservations' },
  { path: '/admin/staff', icon: UserGroupIcon, label: 'Staff' },
  { path: '/admin/payments', icon: CreditCardIcon, label: 'Payments' },
  { path: '/admin/feedback', icon: ChatBubbleLeftRightIcon, label: 'Feedback' },
  { path: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
  { path: '/admin/ai-analytics', icon: CpuChipIcon, label: 'AI Analytics', emoji: '🤖' },
  { path: '/admin/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-orange-500">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                isActive ? 'bg-gray-700 text-white' : ''
              }`
            }
          >
            {item.emoji ? (
              <span className="text-xl mr-3">{item.emoji}</span>
            ) : (
              <item.icon className="w-6 h-6 mr-3" />
            )}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
EOF

echo -e "${GREEN}✅ AI Analytics button added!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✨ Installation complete!${NC}"
echo -e "${BLUE}Refresh your browser to see the changes.${NC}"
echo -e "${BLUE}========================================${NC}"
