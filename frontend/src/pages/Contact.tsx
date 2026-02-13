import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    if (!formData.email.trim()) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = 'Invalid email';
    if (!formData.subject.trim()) err.subject = 'Subject is required';
    if (!formData.message.trim()) err.message = 'Message is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  const contactCards = [
    { icon: MapPinIcon, title: 'Visit Us', detail: 'Plot 123, Block 6, PECHS\nKarachi 75400, Pakistan', color: 'bg-blue-50 text-blue-600' },
    { icon: PhoneIcon, title: 'Call Us', detail: '+92 21 1234567\n+92 300 1234567', color: 'bg-emerald-50 text-emerald-600' },
    { icon: EnvelopeIcon, title: 'Email Us', detail: 'info@dastarkhwan.pk\nsupport@dastarkhwan.pk', color: 'bg-violet-50 text-violet-600' },
    { icon: ClockIcon, title: 'Opening Hours', detail: 'Mon–Fri: 11AM – 11PM\nSat–Sun: 11AM – 12AM', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">We'd love to hear from you. Reach out for reservations, feedback, or just to say hello.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-24 mb-12">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#1a2233] mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{card.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-[#1a2233] mb-1">Send a Message</h2>
              <p className="text-sm text-gray-500 mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium">Message sent! We'll get back to you soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-400">*</span></label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all appearance-none ${errors.subject ? 'border-red-300' : 'border-gray-200'}`}>
                      <option value="">Select a topic</option>
                      <option value="reservation">Reservation Inquiry</option>
                      <option value="feedback">General Feedback</option>
                      <option value="catering">Catering & Events</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-400">*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Write your message here..."
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all resize-none ${errors.message ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-sm hover:bg-[#e6c200] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center gap-2">
                  {loading ? (<><div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />Sending...</>) : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Map / Info Side */}
          <div className="lg:col-span-2 space-y-5">
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, #1a2233 30px, #1a2233 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, #1a2233 30px, #1a2233 31px)' }} />
                <div className="text-center relative z-10">
                  <MapPinIcon className="h-10 w-10 text-[#FFD700] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1a2233]">PECHS, Karachi</p>
                  <p className="text-xs text-gray-400 mt-1">Google Maps integration available</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">Plot 123, Block 6, PECHS, Karachi 75400</p>
              </div>
            </div>

            {/* Reservation CTA */}
            <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-[#FFD700]" />
                </div>
                <h3 className="font-semibold">Quick Reservations</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">Want to book a table? Call us directly or use our online reservation system.</p>
              <Link to="/reservation" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD700] text-[#1a2233] rounded-xl text-sm font-semibold hover:bg-[#e6c200] transition-colors">
                Book a Table →
              </Link>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[#1a2233] mb-3">Quick Contact</h3>
              <div className="space-y-3">
                <a href="tel:+923001234567" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FFD700] transition-colors">
                  <PhoneIcon className="h-4 w-4 text-gray-400" /> +92 300 1234567
                </a>
                <a href="mailto:info@dastarkhwan.pk" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FFD700] transition-colors">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" /> info@dastarkhwan.pk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
