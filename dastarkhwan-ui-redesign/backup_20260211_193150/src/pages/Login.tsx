import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, BoltIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.login({ email, password });

    if (result.success) {
      if (result.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const features = [
    { icon: BoltIcon, title: 'Quick Ordering', desc: 'Order from your table with QR code' },
    { icon: ClockIcon, title: 'Real-time Tracking', desc: 'Watch your order being prepared' },
    { icon: StarIcon, title: 'Rewards', desc: 'Earn points with every order' },
    { icon: ShieldCheckIcon, title: 'Secure', desc: 'Your data is always protected' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2233] via-[#1e2a3d] to-[#2d3748] flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FFD700 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-0"
      >
        {/* Left side - Feature highlights (hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center p-10 bg-[#1a2233]/60 backdrop-blur-xl rounded-l-2xl border border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Sign in to access your orders, reservations, and exclusive member perks.
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700]/20 transition-colors">
                  <feature.icon className="h-4 w-4 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{feature.title}</p>
                  <p className="text-xs text-white/40">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30">Serving Karachi since 2024</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="lg:col-span-3 bg-white rounded-2xl lg:rounded-l-none lg:rounded-r-2xl shadow-2xl overflow-hidden">
          {/* Mobile-only header */}
          <div className="lg:hidden bg-gradient-to-r from-[#1a2233] to-[#2d3748] px-8 py-8 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="text-4xl mb-3">🍽️</div>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-400">Sign in to your Dastarkhwan account</p>
          </div>

          {/* Form */}
          <div className="p-8 lg:p-10">
            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-bold text-[#1a2233]">Sign In</h1>
              <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <span className="text-red-500 flex-shrink-0">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm bg-gray-50/50 hover:bg-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm bg-gray-50/50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#FFD700]/30 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#FFD700] hover:text-[#e6c200] transition-colors">
                  Create Account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="lg:col-span-5 mt-6 text-center">
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
