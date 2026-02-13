import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  HomeIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const mainItems: MenuItem[] = [
  { path: '/admin', icon: HomeIcon, label: 'Dashboard' },
  { path: '/admin/orders', icon: ShoppingCartIcon, label: 'Orders' },
  { path: '/admin/menu', icon: ClipboardDocumentListIcon, label: 'Menu' },
  { path: '/admin/tables', icon: TableCellsIcon, label: 'Tables' },
  { path: '/admin/reservations', icon: CalendarIcon, label: 'Reservations' },
];

const insightItems: MenuItem[] = [
  { path: '/admin/ai-analytics', icon: CpuChipIcon, label: 'AI Analytics', badge: 'AI', badgeColor: 'from-pink-500 to-rose-500' },
  { path: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
  { path: '/admin/feedback', icon: ChatBubbleLeftRightIcon, label: 'Feedback' },
];

const systemItems: MenuItem[] = [
  { path: '/admin/staff', icon: UserGroupIcon, label: 'Staff' },
  { path: '/admin/payments', icon: CreditCardIcon, label: 'Payments' },
  { path: '/admin/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

const SidebarSection: React.FC<{ title: string; items: MenuItem[] }> = ({ title, items }) => (
  <div className="mb-6">
    <p className="px-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-gray-500">
      {title}
    </p>
    <div className="space-y-0.5">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/admin'}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#FFD700]' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r ${item.badgeColor || 'from-gray-500 to-gray-600'} text-white`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <aside className="w-64 bg-[#1a2233] text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center flex-shrink-0">
            <span className="text-[#1a2233] text-sm font-bold">D</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">Dastarkhwan</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 scrollbar-thin scrollbar-thumb-white/10">
        <SidebarSection title="Main" items={mainItems} />
        <SidebarSection title="Insights" items={insightItems} />
        <SidebarSection title="System" items={systemItems} />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
