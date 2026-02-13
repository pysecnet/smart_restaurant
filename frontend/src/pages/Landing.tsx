import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCodeIcon,
  ShoppingCartIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
  CalendarIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  FireIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import ImageSlider from '../components/ImageSlider';

// Fade-in on scroll wrapper
const FadeInView: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Landing: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredItems = [
    {
      name: 'Chicken Biryani',
      desc: 'Fragrant basmati rice layered with tender spiced chicken, caramelized onions & saffron',
      price: 'Rs. 650',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
      badge: 'Bestseller',
      badgeColor: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Seekh Kebab',
      desc: 'Hand-minced beef kebabs grilled over charcoal with aromatic spices',
      price: 'Rs. 450',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
      badge: 'Popular',
      badgeColor: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Chicken Karahi',
      desc: 'Traditional wok-cooked chicken with fresh tomatoes, green chilies & ginger',
      price: 'Rs. 1,200',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
      badge: 'Chef Special',
      badgeColor: 'from-violet-500 to-purple-500',
    },
    {
      name: 'Nihari',
      desc: 'Slow-cooked overnight beef stew with bone marrow & aromatic spice blend',
      price: 'Rs. 550',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
      badge: 'Traditional',
      badgeColor: 'from-rose-500 to-pink-500',
    },
  ];

  const howItWorks = [
    {
      icon: QrCodeIcon,
      title: 'Scan QR Code',
      desc: 'Scan the QR code at your table to instantly access our digital menu',
      color: 'from-amber-400 to-[#FFD700]',
    },
    {
      icon: ShoppingCartIcon,
      title: 'Place Your Order',
      desc: 'Browse, customize, and order your favorite dishes with a few taps',
      color: 'from-emerald-400 to-emerald-500',
    },
    {
      icon: ClockIcon,
      title: 'Track in Real-time',
      desc: 'Watch your order progress live from kitchen preparation to your table',
      color: 'from-blue-400 to-blue-500',
    },
    {
      icon: SparklesIcon,
      title: 'Enjoy Your Meal',
      desc: 'Savor authentic Pakistani cuisine served fresh and piping hot',
      color: 'from-violet-400 to-violet-500',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: UserGroupIcon },
    { value: '50+', label: 'Menu Items', icon: FireIcon },
    { value: '4.8', label: 'Average Rating', icon: StarIcon },
    { value: '15+', label: 'Years Experience', icon: ShieldCheckIcon },
  ];

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Food Critic',
      text: "The biryani here is the best I've had in Karachi. Authentic flavors that remind me of home-cooked meals. The QR ordering makes the whole experience seamless.",
      rating: 5,
      avatar: 'AK',
    },
    {
      name: 'Fatima Ali',
      role: 'Regular Customer',
      text: 'The QR ordering system is incredibly convenient! I love tracking my order in real-time. Great food, exceptional service, and a beautiful ambiance.',
      rating: 5,
      avatar: 'FA',
    },
    {
      name: 'Usman Malik',
      role: 'Food Blogger',
      text: 'Dastarkhwan perfectly blends traditional Pakistani cuisine with modern technology. Every dish tells a story, and the smart ordering system is a game-changer!',
      rating: 5,
      avatar: 'UM',
    },
  ];

  const features = [
    { icon: DevicePhoneMobileIcon, title: 'QR Code Ordering', desc: 'Scan & order directly from your table' },
    { icon: ClockIcon, title: 'Real-time Tracking', desc: 'Watch your order progress live' },
    { icon: ShieldCheckIcon, title: 'Secure Payments', desc: 'Safe & encrypted transactions' },
    { icon: SparklesIcon, title: 'AI Recommendations', desc: 'Personalized menu suggestions' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* ============ HERO - IMAGE SLIDER ============ */}
      <ImageSlider />

      {/* ============ QUICK FEATURES BAR ============ */}
      <div className="relative z-10 -mt-12 sm:-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInView>
            <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-4 sm:p-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700]/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-[#FFD700]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a2233] truncate">{feature.title}</p>
                      <p className="text-[11px] text-gray-400 truncate hidden sm:block">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* ============ FEATURED MENU ============ */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInView>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#b8960c] text-xs font-semibold uppercase tracking-wider mb-4">
                <FireIcon className="h-3.5 w-3.5" />
                Our Menu
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2233] mb-3">
                Featured Dishes
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Discover our most loved dishes, crafted with traditional recipes and the freshest ingredients
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r ${item.badgeColor} text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1a2233] text-lg mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#FFD700]">{item.price}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <StarSolid key={j} className="h-3.5 w-3.5 text-[#FFD700]" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>

          <FadeInView delay={0.3}>
            <div className="text-center mt-12">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a2233] text-white rounded-xl font-semibold text-sm hover:bg-[#2d3748] transition-all shadow-lg hover:shadow-xl group"
              >
                View Full Menu
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #1a2233 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <FadeInView>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#b8960c] text-xs font-semibold uppercase tracking-wider mb-4">
                <QrCodeIcon className="h-3.5 w-3.5" />
                Smart Ordering
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2233] mb-3">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Experience seamless digital ordering with our smart restaurant system
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {howItWorks.map((step, i) => (
              <FadeInView key={i} delay={i * 0.12}>
                <div className="relative text-center group">
                  {/* Connector line (desktop only) */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-gray-200" />
                  )}

                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-[#1a2233] text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                  >
                    <step.icon className="h-9 w-9 text-white" />
                  </div>

                  <h3 className="font-semibold text-[#1a2233] text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-20 bg-gradient-to-br from-[#1a2233] via-[#1e2a3d] to-[#2d3748] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/20 group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold text-[#FFD700] mb-2">{stat.value}</p>
                  <p className="text-sm text-white/50 font-medium">{stat.label}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInView>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#b8960c] text-xs font-semibold uppercase tracking-wider mb-4">
                <StarIcon className="h-3.5 w-3.5" />
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2233] mb-3">
                What Our Guests Say
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Real experiences from real customers who love dining at Dastarkhwan
              </p>
            </div>
          </FadeInView>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <StarSolid key={j} className="h-4 w-4 text-[#FFD700]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold text-sm shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a2233]">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <FadeInView>
              <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, j) => (
                    <StarSolid key={j} className="h-4 w-4 text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 italic min-h-[80px]">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFD700] to-[#e6c200] flex items-center justify-center text-[#1a2233] font-bold text-sm shadow-md">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2233]">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-xs text-gray-400">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeTestimonial ? 'w-8 bg-[#FFD700]' : 'w-3 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </FadeInView>
          </div>

          <FadeInView delay={0.2}>
            <div className="text-center mt-10">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2233] hover:text-[#FFD700] transition-colors group"
              >
                Read all reviews
                <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ============ RESERVATION CTA ============ */}
      <section className="py-24 bg-gradient-to-br from-[#1a2233] via-[#1e2a3d] to-[#2d3748] relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute -top-20 right-1/4 w-60 h-60 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <FadeInView>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
              <CalendarIcon className="h-8 w-8 text-[#FFD700]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Ready for an
              <span className="text-[#FFD700]"> Unforgettable</span> Meal?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Reserve your table now and experience the finest Pakistani cuisine with our modern digital dining
              experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/reservation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all shadow-lg shadow-[#FFD700]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarIcon className="h-5 w-5" />
                Reserve a Table
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/10 backdrop-blur-sm transition-all group"
              >
                Browse Menu
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* NO FOOTER HERE — App.tsx renders the global <Footer /> component */}
    </div>
  );
};

export default Landing;
