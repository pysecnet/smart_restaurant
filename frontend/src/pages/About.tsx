/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
  ShieldCheckIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const values = [
    { icon: HeartIcon, title: 'Authentic Flavors', desc: 'Every dish crafted with traditional Pakistani recipes passed down through generations, preserving the true taste of home.' },
    { icon: SparklesIcon, title: 'Fresh Ingredients', desc: 'We source the finest local ingredients daily, ensuring every plate delivers peak freshness and quality.' },
    { icon: UserGroupIcon, title: 'Pakistani Hospitality', desc: 'Warm, genuine service that makes every guest feel like family. Mehmaan nawazi is in our DNA.' },
    { icon: ShieldCheckIcon, title: '100% Halal', desc: 'All our food is certified halal. We maintain the highest standards of quality and dietary compliance.' },
  ];

  const teamMembers = [
    { name: "Chef Ahmed Khan", role: "Executive Chef", image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80", bio: "15+ years mastering traditional Pakistani cuisine. His biryani and karahi are legendary." },
    { name: "Fatima Ali", role: "Restaurant Manager", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "Ensures every guest experiences exceptional Pakistani hospitality and memorable moments." },
    { name: "Usman Malik", role: "Head of Beverages", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", bio: "Crafts unique lassi and traditional drinks that perfectly complement our dishes." },
  ];

  const achievements = [
    { icon: TrophyIcon, title: 'Best Pakistani Restaurant 2023', desc: 'Awarded by Pakistani Food Critics Association' },
    { icon: StarIcon, title: '5-Star Consistent Rating', desc: 'Rated 5 stars by 2,000+ food lovers' },
    { icon: FireIcon, title: 'Top Halal Restaurant', desc: "Featured in City's Top Halal Restaurants Guide" },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80',
    'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
  ];

  const testimonials = [
    { name: 'Imran Hussain', role: 'Regular Customer', text: 'Dastarkhwan brings the authentic taste of Pakistan right to your table. The biryani is unmatched anywhere in the city.', rating: 5 },
    { name: 'Ayesha Siddiqui', role: 'Food Blogger', text: 'From the ambiance to the flavors, everything is top-notch. The QR ordering system is a brilliant modern touch.', rating: 5 },
    { name: 'Bilal Ahmed', role: 'Business Professional', text: 'Perfect for business dinners and family gatherings. The service is impeccable and the food never disappoints.', rating: 4 },
  ];

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#1a2233] to-[#2d3748] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #FFD700 1px, transparent 0)', backgroundSize: '50px 50px' }} />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-3">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">About Dastarkhwan</h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Where tradition meets innovation — serving authentic Pakistani cuisine with a modern dining experience since 2024.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-3">Since 2024</p>
              <h2 className="text-3xl font-bold text-[#1a2233] mb-5">The Dastarkhwan Journey</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Born from a passion for authentic Pakistani flavors and modern hospitality, Dastarkhwan — which means "a spread of food" in Urdu — represents our vision of bringing families together over incredible meals.
                </p>
                <p>
                  Our kitchen is led by Chef Ahmed Khan, who brings over 15 years of experience in traditional Pakistani cooking. Every dish is prepared with hand-ground spices, fresh ingredients sourced daily, and recipes that have been perfected over generations.
                </p>
                <p>
                  What sets us apart is our blend of tradition and technology. Our smart QR ordering system, real-time order tracking, and seamless reservation platform make dining with us not just delicious, but effortlessly convenient.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {gallery.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-2xl border border-gray-100 ${i === 0 ? 'col-span-2 h-48' : 'h-40'}`}>
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">What We Stand For</p>
            <h2 className="text-3xl font-bold text-[#1a2233]">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#f8f9fc] rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-[#FFD700]" />
                </div>
                <h3 className="text-base font-semibold text-[#1a2233] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">The People Behind the Magic</p>
            <h2 className="text-3xl font-bold text-[#1a2233]">Meet Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#1a2233] mb-0.5">{member.name}</h3>
                  <p className="text-sm font-medium text-[#FFD700] mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">A Glimpse Inside</p>
            <h2 className="text-3xl font-bold text-[#1a2233]">Photo Gallery</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <motion.button key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedImage(img)}
                className="h-48 md:h-56 rounded-2xl overflow-hidden border border-gray-100 hover:border-[#FFD700] transition-all">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">Recognition</p>
            <h2 className="text-3xl font-bold text-[#1a2233]">Our Achievements</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
                  <a.icon className="h-7 w-7 text-[#FFD700]" />
                </div>
                <h3 className="text-base font-semibold text-[#1a2233] mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-[#FFD700] uppercase tracking-wider mb-2">What Our Guests Say</p>
            <h2 className="text-3xl font-bold text-[#1a2233]">Testimonials</h2>
          </motion.div>

          <div className="bg-[#f8f9fc] rounded-2xl border border-gray-100 p-8 md:p-10 text-center">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-[#FFD700] fill-current" />
              ))}
            </div>
            <p className="text-lg text-gray-700 italic leading-relaxed mb-8 max-w-2xl mx-auto">
              "{testimonials[currentTestimonial].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#FFD700]">{testimonials[currentTestimonial].name[0]}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1a2233]">{testimonials[currentTestimonial].name}</p>
                <p className="text-xs text-gray-400">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <button onClick={prevTestimonial} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#FFD700] hover:border-[#FFD700] transition-colors">←</button>
              <button onClick={nextTestimonial} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#FFD700] hover:border-[#FFD700] transition-colors">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider mb-3">Come Visit Us</p>
              <h2 className="text-3xl font-bold text-white mb-6">We'd Love to See You</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <MapPinIcon className="h-5 w-5 text-[#FFD700]" />
                  <p className="text-sm text-white/70">PECHS Block 6, Karachi</p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <ClockIcon className="h-5 w-5 text-[#FFD700]" />
                  <p className="text-sm text-white/70">11AM – 11PM Daily</p>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-end">
                  <PhoneIcon className="h-5 w-5 text-[#FFD700]" />
                  <p className="text-sm text-white/70">+92 300 1234567</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/reservation" className="px-8 py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] shadow-lg shadow-[#FFD700]/20 transition-all">
                  Reserve a Table →
                </Link>
                <Link to="/contact" className="px-8 py-3.5 border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={selectedImage} alt="Gallery" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={(e: React.MouseEvent) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
