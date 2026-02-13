import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (_err) {
      setError('An error occurred. Please try again.');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return { width: '0%', color: 'bg-gray-200', label: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { width: '20%', color: 'bg-red-400', label: 'Weak' };
    if (score <= 2) return { width: '40%', color: 'bg-orange-400', label: 'Fair' };
    if (score <= 3) return { width: '60%', color: 'bg-yellow-400', label: 'Good' };
    if (score <= 4) return { width: '80%', color: 'bg-emerald-400', label: 'Strong' };
    return { width: '100%', color: 'bg-emerald-500', label: 'Very Strong' };
  };

  const strength = passwordStrength();

  const features = [
    { icon: DevicePhoneMobileIcon, title: 'QR Code Ordering', desc: 'Scan & order from your table' },
    { icon: ClockIcon, title: 'Real-time Tracking', desc: 'Track your order status live' },
    { icon: ShieldCheckIcon, title: 'Secure Payments', desc: 'Safe & encrypted transactions' },
    { icon: SparklesIcon, title: 'Personalized Menu', desc: 'AI-powered recommendations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2233] via-[#1e2a3d] to-[#2d3748] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-[#FFD700]/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

          {/* Left Side - Feature Highlights (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-2 flex-col justify-center pr-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-4xl">🍽️</span>
                <div>
                  <h2 className="text-2xl font-bold text-[#FFD700] font-serif">Dastarkhwan</h2>
                  <p className="text-[10px] text-[#FFD700]/50 tracking-[0.2em] uppercase">Smart Restaurant</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Experience the future of dining with our smart restaurant platform. Order, track, and enjoy — all from your device.
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700]/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">{feature.title}</p>
                    <p className="text-xs text-white/40">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] px-8 py-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center shadow-lg shadow-[#FFD700]/20 relative">
                    <span className="text-3xl">🍽️</span>
                  </div>
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-1 relative">
                  {isLogin ? 'Welcome Back' : 'Join Dastarkhwan'}
                </h1>
                <p className="text-sm text-gray-400 relative">
                  {isLogin ? 'Sign in to your Dastarkhwan account' : 'Create your account to start ordering'}
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
                    >
                      <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <p className="text-sm text-emerald-700 font-medium">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name (Register only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required={!isLogin}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {/* Password Strength (Register only) */}
                    {!isLogin && formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: strength.width }} />
                          </div>
                          <span className="text-[10px] font-medium text-gray-500">{strength.label}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Confirm Password (Register only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required={!isLogin}
                            placeholder="Re-enter password"
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm ${
                              formData.confirmPassword && formData.confirmPassword !== formData.password ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />
                        {isLogin ? 'Signing in...' : 'Creating Account...'}
                      </>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                {isLogin && (
                  <>
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Guest Order CTA */}
                    <Link
                      to="/menu"
                      className="block w-full py-3 text-center bg-gray-50 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-100 transition-all border border-gray-200"
                    >
                      Continue as Guest →
                    </Link>
                  </>
                )}

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={switchMode}
                      className="font-semibold text-[#FFD700] hover:text-[#e6c200] transition-colors"
                    >
                      {isLogin ? 'Create Account' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
