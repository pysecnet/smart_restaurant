import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EditProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => navigate('/profile'), 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Back */}
        <button onClick={() => navigate('/profile')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2233] mb-6 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Profile
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-[#1a2233] mb-1">Edit Profile</h1>
          <p className="text-sm text-gray-500 mb-8">Update your personal information</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all"
              />
            </div>

            {/* Address - NEW FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your delivery address"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all resize-none"
              />
            </div>

            {/* Message */}
            {message.text && (
              <div className={`flex items-start gap-3 rounded-xl p-4 ${
                message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>{message.text}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
