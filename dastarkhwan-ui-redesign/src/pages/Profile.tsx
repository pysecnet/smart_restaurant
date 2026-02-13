import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ShieldCheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const infoItems = [
    { icon: UserIcon, label: 'Full Name', value: user.full_name || 'Not provided' },
    { icon: UserIcon, label: 'Username', value: user.username },
    { icon: EnvelopeIcon, label: 'Email', value: user.email },
    { icon: PhoneIcon, label: 'Phone', value: user.phone || 'Not provided' },
    { icon: MapPinIcon, label: 'Address', value: user.address || 'Not provided' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] px-8 py-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                <span className="text-3xl font-bold text-[#1a2233]">
                  {user.full_name?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.full_name || user.username}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-white/10 text-white/70 border border-white/10">
                    {user.role}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-md ${
                    user.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Profile Information</h2>
            <div className="space-y-5">
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-[#1a2233]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="px-8 pb-8">
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all shadow-lg shadow-[#FFD700]/20"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
