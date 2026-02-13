/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, XMarkIcon, HandThumbUpIcon, CheckBadgeIcon, CameraIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  helpfulVotes: number;
  isVerified: boolean;
  photos?: string[];
  businessResponse?: { text: string; date: string; };
}

// Toast component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-24 left-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
        type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? '✓' : '⚠️'} {message}
    </motion.div>
  );
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1, customerName: "Ahmed Khan", rating: 5,
      title: "Exceptional Dining Experience",
      comment: "Amazing food and service! The staff was very friendly and the atmosphere was great. The biryani was cooked to perfection and the kebab selection was outstanding.",
      date: "2024-03-15", likes: 12, helpfulVotes: 8, isVerified: true,
      photos: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80", "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80"],
      businessResponse: { text: "Thank you for your wonderful review! We're thrilled you enjoyed your experience with us.", date: "2024-03-16" }
    },
    {
      id: 2, customerName: "Fatima Zaidi", rating: 4,
      title: "Great Food, Cozy Atmosphere",
      comment: "Great experience overall. The food was delicious and the service was prompt. The karahi dishes are particularly noteworthy. Will come again.",
      date: "2024-03-14", likes: 8, helpfulVotes: 5, isVerified: true,
      photos: ["https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=300&q=80"]
    },
    {
      id: 3, customerName: "Usman Malik", rating: 5,
      title: "Best Pakistani Restaurant",
      comment: "Best restaurant for authentic Pakistani food! The menu has great variety and everything tastes amazing. The QR ordering system is a great modern touch.",
      date: "2024-03-13", likes: 15, helpfulVotes: 12, isVerified: true,
      photos: ["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80", "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80"]
    },
    {
      id: 4, customerName: "Sara Ali", rating: 3,
      title: "Good but Room for Improvement",
      comment: "Food quality is excellent but the wait time was a bit long during peak hours. Would appreciate faster service. The naan was fresh and the daal was very flavorful.",
      date: "2024-03-10", likes: 3, helpfulVotes: 4, isVerified: false
    },
  ]);

  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'likes' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '', photos: [] as string[] });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  const handleLike = (reviewId: number) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleHelpful = (reviewId: number) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
    showToast('Marked as helpful!');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) { showToast('Please select a rating', 'error'); return; }
    if (!newReview.title.trim()) { showToast('Please enter a title', 'error'); return; }
    if (!newReview.comment.trim()) { showToast('Please enter a comment', 'error'); return; }

    const review: Review = {
      id: reviews.length + 1, customerName: "You", rating: newReview.rating,
      title: newReview.title, comment: newReview.comment,
      date: new Date().toISOString().split('T')[0], likes: 0, helpfulVotes: 0, isVerified: true, photos: newReview.photos
    };
    setReviews([review, ...reviews]);
    setShowReviewForm(false);
    setNewReview({ rating: 0, title: '', comment: '', photos: [] });
    showToast('Review submitted successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setNewReview(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const removePhoto = (index: number) => {
    setNewReview(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const sortedAndFilteredReviews = reviews
    .filter(r => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'rating': return b.rating - a.rating;
        case 'likes': return b.likes - a.likes;
        case 'helpful': return b.helpfulVotes - a.helpfulVotes;
        default: return 0;
      }
    });

  // Rating summary
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0';
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rev => rev.rating === r).length }));

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12">
      {/* Toast */}
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-3">Customer Reviews</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">See what our guests are saying about their dining experience</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 -mt-24 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Score */}
            <div className="text-center md:border-r border-gray-100">
              <p className="text-5xl font-bold text-[#1a2233]">{avgRating}</p>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <StarIcon key={s} className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? 'text-[#FFD700]' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500">{totalReviews} reviews</p>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-2 space-y-2.5">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{rating}</span>
                  <StarIcon className="h-4 w-4 text-[#FFD700]" />
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFD700] rounded-full transition-all duration-500"
                      style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Controls: Sort + Filter + Write Review */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            {(['recent', 'rating', 'helpful'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === s ? 'bg-[#1a2233] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {s === 'recent' ? 'Most Recent' : s === 'rating' ? 'Highest Rated' : 'Most Helpful'}
              </button>
            ))}
            <span className="text-gray-200 mx-1">|</span>
            {[5, 4, 3, 2, 1].map(r => (
              <button key={r} onClick={() => setFilterRating(filterRating === r ? null : r)}
                className={`px-2.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterRating === r ? 'bg-[#FFD700] text-[#1a2233]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {r}★
              </button>
            ))}
          </div>
          <button onClick={() => setShowReviewForm(true)}
            className="px-5 py-2.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold text-sm hover:bg-[#e6c200] transition-all shadow-sm flex items-center gap-2">
            <StarOutlineIcon className="h-4 w-4" /> Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {sortedAndFilteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No reviews found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or be the first to leave a review!</p>
            </div>
          ) : (
            sortedAndFilteredReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold text-sm">
                      {review.customerName[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#1a2233]">{review.customerName}</h4>
                        {review.isVerified && <CheckBadgeIcon className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <StarIcon key={s} className={`h-4 w-4 ${s <= review.rating ? 'text-[#FFD700]' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-[#1a2233] mb-2">{review.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {review.photos.map((photo, i) => (
                      <button key={i} onClick={() => setLightboxImage(photo)} className="flex-shrink-0">
                        <img src={photo} alt={`Review photo ${i + 1}`} className="w-20 h-20 object-cover rounded-xl border border-gray-100 hover:border-[#FFD700] transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Business Response */}
                {review.businessResponse && (
                  <div className="bg-[#f8f9fc] rounded-xl p-4 mb-4 border-l-3 border-l-[#FFD700]" style={{ borderLeft: '3px solid #FFD700' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#FFD700]">🍽️ Restaurant Response</span>
                      <span className="text-xs text-gray-400">{new Date(review.businessResponse.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.businessResponse.text}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleLike(review.id)} className="flex items-center gap-1.5 text-gray-400 hover:text-[#FFD700] transition-colors text-sm">
                    👍 <span>{review.likes}</span>
                  </button>
                  <button onClick={() => handleHelpful(review.id)} className="flex items-center gap-1.5 text-gray-400 hover:text-[#1a2233] transition-colors text-sm">
                    <HandThumbUpIcon className="h-4 w-4" /> Helpful ({review.helpfulVotes})
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1a2233]">Write a Review</h2>
                <button onClick={() => setShowReviewForm(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Star Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110">
                        {star <= newReview.rating ? (
                          <StarIcon className="h-9 w-9 text-[#FFD700]" />
                        ) : (
                          <StarOutlineIcon className="h-9 w-9 text-gray-300 hover:text-[#FFD700]/50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input type="text" value={newReview.title}
                    onChange={e => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm"
                    placeholder="Summarize your experience" />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review</label>
                  <textarea value={newReview.comment}
                    onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm resize-none h-28"
                    placeholder="Share your experience with others" />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newReview.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img src={photo} alt={`Upload ${index + 1}`} className="w-18 h-18 object-cover rounded-xl border border-gray-100" />
                        <button type="button" onClick={() => removePhoto(index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors cursor-pointer">
                    <CameraIcon className="h-4 w-4" /> Add Photos
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Submit */}
                <button type="submit"
                  className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all shadow-lg shadow-[#FFD700]/20">
                  Submit Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setLightboxImage(null)}>
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightboxImage} alt="Review photo"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;
