import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reviewAPI } from '../services/api';
import type { Review } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5 },
  }),
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewAPI.getReviews();
      if (response.success) {
        setReviews(response.data);
      } else {
        setError('Failed to load reviews.');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Unable to connect. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#1a2233] to-[#2d3748] py-20">
      <div className="page-container">
      <div className="text-center mb-12">
      <div className="skeleton h-10 w-64 mx-auto mb-4 bg-white/10 rounded-lg" />
      <div className="skeleton h-5 w-96 mx-auto bg-white/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-12 h-12 rounded-full bg-white/10" />
        <div>
        <div className="skeleton h-4 w-24 mb-2 bg-white/10 rounded" />
        <div className="skeleton h-3 w-20 bg-white/5 rounded" />
        </div>
        </div>
        <div className="skeleton h-3 w-full mb-2 bg-white/5 rounded" />
        <div className="skeleton h-3 w-3/4 bg-white/5 rounded" />
        </div>
      ))}
      </div>
      </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#1a2233] to-[#2d3748] py-20">
      <div className="page-container text-center">
      <div className="max-w-md mx-auto">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-6">{error}</p>
      <button
      onClick={fetchReviews}
      className="btn-primary"
      >
      Try Again
      </button>
      </div>
      </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1a2233] to-[#2d3748] py-20">
    <div className="page-container">
    {/* Header */}
    <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-14"
    >
    <span className="inline-block text-sm font-semibold text-[#FFD700] tracking-wider uppercase mb-3">
    Testimonials
    </span>
    <h2 className="text-4xl font-bold text-white mb-3">What Our Guests Say</h2>
    <p className="text-gray-400 max-w-lg mx-auto">
    Real feedback from food lovers who've experienced the Dastarkhwan difference
    </p>
    </motion.div>

    {/* Reviews Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {reviews.map((review, i) => (
      <motion.div
      key={review.id}
      custom={i}
      initial="hidden"
      whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        variants={fadeUp}
        className="group bg-white rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
        >
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, idx) => (
          <svg
          key={idx}
          className={`w-5 h-5 ${idx < review.rating ? 'text-[#FFD700]' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        </div>

        {/* Comment */}
        <p className="text-gray-700 leading-relaxed mb-5 text-[15px]">
        "{review.comment}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold text-sm shadow-sm">
        {review.userName.charAt(0).toUpperCase()}
        </div>
        <div>
        <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
        </div>
        </div>
        </motion.div>
    ))}
    </div>

    {/* Empty State */}
    {reviews.length === 0 && (
      <div className="text-center py-16">
      <div className="text-6xl mb-4">⭐</div>
      <h3 className="text-2xl font-semibold text-white mb-2">No reviews yet</h3>
      <p className="text-gray-400">Be the first to share your experience!</p>
      </div>
    )}

    {/* CTA */}
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mt-16"
    >
    <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100 max-w-xl mx-auto">
    <h3 className="text-2xl font-bold text-[#1a2233] mb-2">Enjoyed your meal?</h3>
    <p className="text-gray-500 mb-6">We'd love to hear about your dining experience</p>
    <button className="btn-primary">
    Write a Review
    </button>
    </div>
    </motion.div>
    </div>
    </div>
  );
};

export default Reviews;
