import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ShieldCheckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', username: '', phone: '', address: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.phone.trim()) { setError('Phone number is required'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setIsLoading(true);
    try {
      const result = await authService.register({
        email: formData.email, username: formData.username,
        password: formData.password, full_name: formData.name,
        phone: formData.phone, address: formData.address,
      });
      if (result.success) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/auth'), 1500);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: StarIcon, text: 'Exclusive menu access & rewards' },
    { icon: ClockIcon, text: 'Quick reorder from your history' },
    { icon: ShieldCheckIcon, text: 'Secure & encrypted data' },
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
        className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-0"
      >
        {/* Left side - Features panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center p-10 bg-[#1a2233]/60 backdrop-blur-xl rounded-l-2xl border border-white/5">
          <div className="mb-8">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Join Dastarkhwan</h2>
            <p className="text-white/50 text-sm leading-relaxed">Create your account and unlock a premium dining experience with easy ordering, reservations, and more.</p>
          </div>

          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-[#FFD700]" />
                </div>
                <p className="text-sm text-white/70">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-xs text-white/30">Trusted by 2,000+ food lovers in Karachi</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl lg:rounded-l-none lg:rounded-r-2xl shadow-2xl overflow-hidden">
          {/* Mobile-only header */}
          <div className="lg:hidden bg-gradient-to-r from-[#1a2233] to-[#2d3748] px-8 py-6 text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <h1 className="text-xl font-bold text-white mb-1">Join Dastarkhwan</h1>
            <p className="text-sm text-gray-400">Create your account to start ordering</p>
          </div>

          <div className="p-8">
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold text-[#1a2233]">Create Account</h1>
              <p className="text-sm text-gray-500 mt-1">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <span className="text-red-500 flex-shrink-0">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">Username <span className="text-red-400">*</span></label>
                  <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required placeholder="Choose a username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
              </div>

              {/* Phone - MANDATORY */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
              </div>

              {/* Address - NEW FIELD */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={2} placeholder="Enter your delivery address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm resize-none" />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                    value={formData.password} onChange={handleInputChange} required placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Re-enter password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2 mt-2">
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />Creating Account...</>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Already have an account?{' '}
                <Link to="/auth" className="font-semibold text-[#FFD700] hover:text-[#e6c200] transition-colors">Sign In</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to home - below card on mobile */}
        <div className="lg:col-span-5 mt-6 text-center">
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
