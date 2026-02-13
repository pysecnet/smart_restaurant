import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  Bars3Icon as MenuIcon,
  UserIcon,
  XMarkIcon,
  CalendarIcon,
  StarIcon,
  PhoneIcon,
  InformationCircleIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Single navigation array (fixes duplicate nav bug)
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Menu', path: '/menu', icon: ClipboardDocumentListIcon },
    ...(user ? [{ name: 'My Orders', path: '/my-orders', icon: ClipboardDocumentListIcon }] : []),
    { name: 'Reservations', path: '/reservation', icon: CalendarIcon },
    { name: 'Reviews', path: '/reviews', icon: StarIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
  ];

  return (
    <nav
    className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled
      ? 'bg-[#1a2233]/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] border-b border-white/5'
      : 'bg-[#1a2233] border-b border-white/10'
    }`}
    >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">

    {/* ===== LOGO ===== */}
    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
    <div className="relative">
    <span className="text-3xl filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110 inline-block">
    🍽️
    </span>
    <div className="absolute -inset-1 bg-[#FFD700]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="flex flex-col leading-none">
    <span className="text-xl font-bold text-[#FFD700] tracking-tight font-serif">
    Dastarkhwan
    </span>
    <span className="text-[10px] text-[#FFD700]/50 tracking-[0.2em] uppercase font-sans">
    Smart Restaurant
    </span>
    </div>
    </Link>

    {/* ===== DESKTOP NAV LINKS ===== */}
    <div className="hidden lg:flex items-center gap-1">
    {navItems.map((item) => (
      <Link
      key={item.path}
      to={item.path}
      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
        isActive(item.path)
        ? 'text-[#FFD700]'
        : 'text-white/80 hover:text-white'
      }`}
      >
      <item.icon className={`h-4 w-4 transition-colors ${
        isActive(item.path) ? 'text-[#FFD700]' : 'text-white/50 group-hover:text-white/80'
      }`} />
      <span>{item.name}</span>

      {/* Active indicator */}
      {isActive(item.path) && (
        <motion.div
        layoutId="activeNav"
        className="absolute inset-0 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg -z-10"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Hover glow */}
      {!isActive(item.path) && (
        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 rounded-lg -z-10 transition-colors duration-200" />
      )}
      </Link>
    ))}

    {/* Admin Panel Link */}
    {user?.role === 'admin' && (
      <Link
      to="/admin"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
        location.pathname.startsWith('/admin')
        ? 'text-[#1a2233] bg-[#FFD700] shadow-lg shadow-[#FFD700]/20'
        : 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 hover:bg-[#FFD700]/20'
      }`}
      >
      <Cog6ToothIcon className="h-4 w-4" />
      <span>Admin</span>
      </Link>
    )}
    </div>

    {/* ===== DESKTOP USER ACTIONS ===== */}
    <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
    {user ? (
      <div className="relative" ref={profileRef}>
      <button
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isProfileOpen
        ? 'bg-white/10 text-white'
        : 'text-white/80 hover:text-white hover:bg-white/5'
      }`}
      >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold text-sm shadow-lg">
      {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
      </div>
      <span className="text-sm font-medium max-w-[100px] truncate">
      {user.full_name || user.username}
      </span>
      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Profile Dropdown */}
      <AnimatePresence>
      {isProfileOpen && (
        <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-56 bg-[#1a2233] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-white/10">
        <p className="text-sm font-medium text-white truncate">{user.full_name || user.username}</p>
        <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>

        <div className="py-1">
        <Link
        to="/profile"
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
        <UserIcon className="h-4 w-4" />
        Profile
        </Link>
        <Link
        to="/dashboard"
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
        <Cog6ToothIcon className="h-4 w-4" />
        Dashboard
        </Link>
        </div>

        <div className="border-t border-white/10 py-1">
        <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Sign Out
        </button>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
      </div>
    ) : (
      <div className="flex items-center gap-2">
      <Link
      to="/auth"
      className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
      >
      Sign In
      </Link>
      <Link
      to="/register"
      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#FFD700] to-[#e6c200] text-[#1a2233] hover:shadow-lg hover:shadow-[#FFD700]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
      Get Started
      </Link>
      </div>
    )}
    </div>

    {/* ===== MOBILE MENU BUTTON ===== */}
    <button
    onClick={() => setIsOpen(!isOpen)}
    className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
    <AnimatePresence mode="wait">
    {isOpen ? (
      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
      <XMarkIcon className="h-6 w-6" />
      </motion.div>
    ) : (
      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
      <MenuIcon className="h-6 w-6" />
      </motion.div>
    )}
    </AnimatePresence>
    </button>
    </div>
    </div>

    {/* ===== MOBILE MENU ===== */}
    <AnimatePresence>
    {isOpen && (
      <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="lg:hidden overflow-hidden"
      >
      <div className="bg-[#1a2233]/95 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-1">
      {/* Nav Links */}
      <div className="space-y-1">
      {navItems.map((item, index) => (
        <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        >
        <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
          isActive(item.path)
          ? 'text-[#1a2233] bg-[#FFD700] shadow-lg shadow-[#FFD700]/20'
          : 'text-white/80 hover:text-white hover:bg-white/5'
        }`}
        >
        <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-[#1a2233]' : 'text-white/50'}`} />
        {item.name}
        </Link>
        </motion.div>
      ))}

      {/* Admin Link */}
      {user?.role === 'admin' && (
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: navItems.length * 0.05 }}
        >
        <Link
        to="/admin"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20"
        >
        <Cog6ToothIcon className="h-5 w-5" />
        Admin Panel
        </Link>
        </motion.div>
      )}
      </div>

      {/* User Section */}
      <div className="mt-4 pt-4 border-t border-white/10">
      {user ? (
        <div className="space-y-1">
        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold">
        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
        <p className="text-sm font-medium text-white">{user.full_name || user.username}</p>
        <p className="text-xs text-white/50">{user.email}</p>
        </div>
        </div>

        <Link
        to="/profile"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
        <UserIcon className="h-5 w-5 text-white/50" />
        Profile
        </Link>
        <Link
        to="/dashboard"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
        <Cog6ToothIcon className="h-5 w-5 text-white/50" />
        Dashboard
        </Link>
        <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Sign Out
        </button>
        </div>
      ) : (
        <div className="space-y-2 px-2">
        <Link
        to="/auth"
        className="block text-center px-4 py-3 rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/5 transition-all"
        >
        Sign In
        </Link>
        <Link
        to="/register"
        className="block text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#FFD700] to-[#e6c200] text-[#1a2233] shadow-lg"
        >
        Get Started
        </Link>
        </div>
      )}
      </div>
      </div>
      </motion.div>
    )}
    </AnimatePresence>
    </nav>
  );
};

export default Navbar;
