import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const Home: React.FC = () => {
  const features = [
    {
      title: 'Dashboard',
      description: 'Monitor orders, revenue, and popular items in real-time with live analytics.',
      icon: ChartBarIcon,
      link: '/dashboard',
      color: 'from-amber-500/10 to-yellow-500/10',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, and manage your restaurant menu items with image uploads.',
      icon: ClipboardDocumentListIcon,
      link: '/menu',
      color: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Order Tracking',
      description: 'Track and manage customer orders with real-time status updates.',
      icon: UserGroupIcon,
      link: '/my-orders',
      color: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-600',
    },
    {
      title: 'QR Code Ordering',
      description: 'Guests scan QR codes at tables and order instantly — no app needed.',
      icon: QrCodeIcon,
      link: '/scan-order',
      color: 'from-purple-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Reservations',
      description: 'Book a table in advance for a seamless dining experience.',
      icon: CalendarIcon,
      link: '/reservation',
      color: 'from-rose-500/10 to-pink-500/10',
      iconColor: 'text-rose-600',
    },
    {
      title: 'AI Analytics',
      description: 'Get AI-powered insights on top sellers, trends, and menu optimization.',
      icon: SparklesIcon,
      link: '/admin/ai-analytics',
      color: 'from-cyan-500/10 to-teal-500/10',
      iconColor: 'text-cyan-600',
    },
  ];

  const stats = [
    { label: 'Menu Items', value: '25+' },
    { label: 'Tables', value: '15' },
    { label: 'Categories', value: '7' },
    { label: 'Real-time Updates', value: '24/7' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    {/* ─── Hero Section ─── */}
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2233] via-[#1e2a3d] to-[#2d3748]">
    {/* Decorative pattern */}
    <div className="absolute inset-0 opacity-[0.03]">
    <div
    className="absolute inset-0"
    style={{
      backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
    }}
    />
    </div>
    {/* Gold glow accent */}
    <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 -left-32 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />

    <div className="relative page-container py-20 sm:py-28 lg:py-36">
    <div className="max-w-3xl">
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6"
    >
    <SparklesIcon className="h-4 w-4 text-[#FFD700]" />
    <span className="text-sm font-medium text-[#FFD700]">AI-Powered Restaurant Management</span>
    </motion.div>

    <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5 }}
    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
    >
    <span className="text-white">Smart Restaurant</span>
    <br />
    <span className="text-gradient">Management System</span>
    </motion.h1>

    <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl"
    >
    Streamline every aspect of your restaurant — from digital ordering and
    real-time tracking to AI-driven insights. Built for the modern dining experience.
    </motion.p>

    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="mt-8 flex flex-wrap gap-4"
    >
    <Link
    to="/menu"
    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold bg-[#FFD700] text-[#1a2233] hover:bg-[#e6c200] shadow-lg shadow-[#FFD700]/20 hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all active:scale-[0.98]"
    >
    View Menu
    <ArrowRightIcon className="h-4 w-4" />
    </Link>
    <Link
    to="/reservation"
    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-medium text-white border border-white/20 hover:bg-white/10 transition-all active:scale-[0.98]"
    >
    Book a Table
    </Link>
    </motion.div>
    </div>

    {/* Stats Bar */}
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
    {stats.map((stat) => (
      <div
      key={stat.label}
      className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
      >
      <div className="text-2xl sm:text-3xl font-bold text-[#FFD700]">{stat.value}</div>
      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
      </div>
    ))}
    </motion.div>
    </div>
    </section>

    {/* ─── Features Section ─── */}
    <section className="page-section bg-white">
    <div className="page-container">
    <div className="text-center mb-14">
    <motion.span
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="inline-block text-sm font-semibold text-[#FFD700] tracking-wider uppercase mb-3"
    >
    Features
    </motion.span>
    <motion.h2
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-3xl sm:text-4xl font-bold text-[#1a2233] leading-tight"
    >
    Everything you need to run
    <br className="hidden sm:block" /> a modern restaurant
    </motion.h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((feature, index) => (
      <motion.div
      key={feature.title}
      custom={index}
      initial="hidden"
      whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        >
        <Link to={feature.link} className="block group h-full">
        <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/5 transition-all duration-300">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-[#1a2233] group-hover:text-[#b89600] transition-colors mb-2">
        {feature.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
        {feature.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Learn more</span>
        <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
        </div>
        </Link>
        </motion.div>
    ))}
    </div>
    </div>
    </section>

    {/* ─── CTA Banner ─── */}
    <section className="page-section bg-gray-50">
    <div className="page-container">
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2233] to-[#2d3748] px-8 py-14 sm:px-14 sm:py-16 text-center"
    >
    <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#FFD700]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

    <div className="relative z-10">
    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
    Ready to modernize your restaurant?
    </h2>
    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
    Scan a QR code, place an order, track it in real-time — all without downloading an app.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
    <Link
    to="/scan-order"
    className="px-8 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-lg font-semibold hover:bg-[#e6c200] shadow-lg shadow-[#FFD700]/20 transition-all active:scale-[0.98]"
    >
    Try QR Ordering
    </Link>
    <Link
    to="/about"
    className="px-8 py-3.5 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all active:scale-[0.98]"
    >
    Learn More
    </Link>
    </div>
    </div>
    </motion.div>
    </div>
    </section>

    {/* ─── Footer ─── */}
    <footer className="bg-[#1a2233] border-t border-white/5">
    <div className="page-container py-10">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-2">
    <span className="text-2xl">🍽️</span>
    <span className="text-lg font-bold text-[#FFD700] font-serif">Dastarkhwan</span>
    </div>
    <p className="text-sm text-gray-500">
    &copy; {new Date().getFullYear()} Dastarkhwan — Smart Restaurant Management System
    </p>
    </div>
    </div>
    </footer>
    </div>
  );
};

export default Home;
