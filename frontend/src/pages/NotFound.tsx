import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2233] to-[#2d3748] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <h1 className="text-8xl font-extrabold text-[#FFD700] mb-2 drop-shadow-lg">404</h1>

        {/* Plate emoji */}
        <div className="text-6xl mb-6">🍽️</div>

        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Sorry, this dish isn't on our menu! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#1a2233] rounded-lg font-semibold hover:bg-[#e6c200] transition-colors shadow-lg shadow-[#FFD700]/20"
          >
            <HomeIcon className="h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
