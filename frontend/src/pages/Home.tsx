import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCodeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  FireIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import ImageSlider from '../components/ImageSlider';

const Home: React.FC = () => {
  const featuredItems = [
    { name: 'Chicken Biryani', price: 450, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', tag: 'Best Seller' },
    { name: 'Mutton Karahi', price: 1200, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', tag: 'Chef Special' },
    { name: 'Seekh Kebab', price: 350, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', tag: 'Popular' },
    { name: 'Chicken Tikka', price: 550, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', tag: 'Must Try' },
  ];

  const howItWorks = [
    { icon: QrCodeIcon, title: 'Scan QR Code', desc: 'Scan the QR code at your table to access our digital menu instantly' },
    { icon: ClipboardDocumentListIcon, title: 'Browse & Order', desc: 'Browse our menu, customize your order, and place it in seconds' },
    { icon: FireIcon, title: 'Fresh Preparation', desc: 'Our chefs prepare your food fresh with authentic spices and recipes' },
    { icon: TruckIcon, title: 'Served to You', desc: 'Track your order in real-time and enjoy when it arrives at your table' },
  ];

  const stats = [
    { value: '2,000+', label: 'Happy Customers' },
    { value: '50+', label: 'Menu Items' },
    { value: '4.8', label: 'Average Rating' },
    { value: '15min', label: 'Avg. Prep Time' },
  ];

  const testimonials = [
    { name: 'Ahmed Khan', text: 'The biryani here is absolutely authentic. Reminds me of home-cooked food. The QR ordering system is so convenient!', rating: 5 },
    { name: 'Fatima Zaidi', text: 'Best karahi in Karachi! The staff is incredibly welcoming and the atmosphere is perfect for family dinners.', rating: 5 },
    { name: 'Usman Ali', text: 'Love the real-time order tracking. I can see exactly when my food will be ready. Great modern touch to traditional dining.', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero - Image Slider */}
      <div className="-mt-16">
        <ImageSlider />
      </div>

      {/* Stats Bar */}
      <div className="bg-[#1a2233]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="py-8 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-[#FFD700]">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Menu */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">Our Specialties</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2233] mb-3">Featured Menu</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Handpicked favorites from our kitchen, prepared with authentic recipes and the finest ingredients</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#FFD700] text-[#1a2233] text-xs font-semibold rounded-lg">{item.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#1a2233] mb-1">{item.name}</h3>
                  <p className="text-lg font-bold text-[#FFD700]">Rs. {item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a2233] text-white rounded-xl font-semibold text-sm hover:bg-[#2d3748] transition-all shadow-lg">
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">Simple & Fast</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2233] mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">From scanning to savoring — your meal is just a few taps away</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="h-7 w-7 text-[#FFD700]" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1a2233] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-[#1a2233] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">What People Say</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2233] mb-3">Customer Reviews</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <StarIcon key={j} className="h-4 w-4 text-[#FFD700] fill-current" />
                  ))}
                  {[...Array(5 - t.rating)].map((_, j) => (
                    <StarIcon key={j} className="h-4 w-4 text-gray-200" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#FFD700]">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2233]">{t.name}</p>
                    <p className="text-xs text-gray-400">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFD700]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider mb-3">Don't Miss Out</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Reserve Your Table Today</h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8">
                Whether it's a family dinner, business meeting, or a special celebration — we've got the perfect table waiting for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/reservation" className="px-8 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] shadow-lg shadow-[#FFD700]/20 transition-all">
                  Book a Table →
                </Link>
                <Link to="/menu" className="px-8 py-3.5 border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all">
                  Browse Menu
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
