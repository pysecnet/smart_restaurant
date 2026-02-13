import { API_BASE_URL } from "../config/api";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, ChatBubbleLeftIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ReservationForm {
  date: string; time: string; guests: number; specialRequests: string; name: string; email: string; phone: string;
}
interface TableAvailability { time: string; available: boolean; remainingTables: number; }
interface ValidationErrors { name?: string; email?: string; phone?: string; date?: string; time?: string; guests?: string; }

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState<ReservationForm>({ date: '', time: '', guests: 2, specialRequests: '', name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tableAvailability, setTableAvailability] = useState<TableAvailability[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const timeSlots = ['11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'];

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) errors.phone = 'Invalid phone';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.guests) errors.guests = 'Guests is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // BUG FIX: Removed validateForm() from useEffect - it was causing re-render on every keystroke
  // Validation now only runs on submit

  const isFormFilled = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '' && formData.date !== '' && formData.time !== '' && formData.guests > 0;

  const checkAvailability = async () => {
    if (!formData.date || !formData.guests) return;
    setIsCheckingAvailability(true);
    setTimeout(() => {
      setTableAvailability(timeSlots.map(time => ({ time, available: Math.random() > 0.3, remainingTables: Math.floor(Math.random() * 5) + 1 })));
      setIsCheckingAvailability(false);
    }, 1000);
  };

  useEffect(() => { if (formData.date && formData.guests) checkAvailability(); }, [formData.date, formData.guests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: 2, specialRequests: '' }); }, 3000);
      } else { throw new Error(data.detail || "Failed to create reservation"); }
    } catch (error: any) { setIsSubmitting(false); alert(error.message || "Failed to create reservation."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear individual field error when user types
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[name as keyof ValidationErrors]; return next; });
    }
  };

  const InputField: React.FC<{ label: string; name: string; type?: string; placeholder: string; required?: boolean; error?: string }> = ({ label, name, type = 'text', placeholder, required = true, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} name={name} value={(formData as any)[name]} onChange={handleChange} required={required} placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a2233] to-[#2d3748] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-3">Reserve a Table</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Book your spot for a memorable dining experience at Dastarkhwan</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20">
        {/* Success */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800">Reservation Confirmed!</p>
                <p className="text-sm text-emerald-600">We'll send a confirmation email shortly.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="name" placeholder="Your name" error={validationErrors.name} />
                    <InputField label="Email" name="email" type="email" placeholder="your@email.com" error={validationErrors.email} />
                  </div>
                  <div className="mt-4">
                    <InputField label="Phone Number" name="phone" type="tel" placeholder="+923001234567" error={validationErrors.phone} />
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Reservation Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                      <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm ${validationErrors.date ? 'border-red-300' : 'border-gray-200'}`} />
                      {validationErrors.date && <p className="text-xs text-red-500 mt-1">{validationErrors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Guests</label>
                      <select name="guests" value={formData.guests} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm appearance-none bg-white">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                {formData.date && formData.guests && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Select Time</h2>
                    {isCheckingAvailability ? (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <div className="w-5 h-5 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-500">Checking availability...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {tableAvailability.map(slot => (
                          <button key={slot.time} type="button" onClick={() => setFormData(p => ({ ...p, time: slot.time }))} disabled={!slot.available}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                              formData.time === slot.time ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#1a2233] ring-2 ring-[#FFD700]/20'
                              : slot.available ? 'border-gray-200 hover:border-[#FFD700] hover:bg-[#FFD700]/5 text-gray-700'
                              : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}>
                            <div className="flex items-center justify-between">
                              <span>{slot.time}</span>
                              {slot.available ? <CheckCircleIcon className="h-4 w-4 text-emerald-500" /> : <XCircleIcon className="h-4 w-4 text-gray-300" />}
                            </div>
                            {slot.available && <p className="text-[10px] text-gray-400 mt-1">{slot.remainingTables} tables left</p>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} placeholder="Dietary requirements, seating preference, celebrations..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all text-sm resize-none" />
                </div>

                {/* Submit */}
                <button type="submit" disabled={isSubmitting || !isFormFilled}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isFormFilled ? 'bg-[#FFD700] text-[#1a2233] hover:bg-[#e6c200] shadow-lg shadow-[#FFD700]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}>
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-[#1a2233]/30 border-t-[#1a2233] rounded-full animate-spin" />Reserving...</> : 'Reserve Table'}
                </button>
              </form>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Reservation Preview</h3>
              {!formData.name && !formData.date ? (
                <div className="text-center py-10">
                  <CalendarIcon className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Fill out the form to see your preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.name && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#FFD700]">{formData.name[0]?.toUpperCase()}</span>
                      </div>
                      <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Name</p><p className="text-sm font-medium text-[#1a2233]">{formData.name}</p></div>
                    </div>
                  )}
                  {formData.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><span className="text-xs">✉️</span></div>
                      <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p><p className="text-sm font-medium text-[#1a2233]">{formData.email}</p></div>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><span className="text-xs">📱</span></div>
                      <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p><p className="text-sm font-medium text-[#1a2233]">{formData.phone}</p></div>
                    </div>
                  )}
                  {formData.date && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0"><CalendarIcon className="h-4 w-4 text-violet-500" /></div>
                      <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p><p className="text-sm font-medium text-[#1a2233]">{new Date(formData.date).toLocaleDateString()}</p></div>
                    </div>
                  )}
                  {formData.time && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0"><ClockIcon className="h-4 w-4 text-amber-500" /></div>
                      <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Time</p><p className="text-sm font-medium text-[#1a2233]">{formData.time}</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0"><UserGroupIcon className="h-4 w-4 text-rose-500" /></div>
                    <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Guests</p><p className="text-sm font-medium text-[#1a2233]">{formData.guests} {Number(formData.guests) === 1 ? 'Guest' : 'Guests'}</p></div>
                  </div>
                  {formData.specialRequests && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Special Requests</p>
                      <p className="text-sm text-gray-600">{formData.specialRequests}</p>
                    </div>
                  )}
                  {isFormFilled && (
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-emerald-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">Ready to submit</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-[#1a2233] mb-4">Confirm Reservation</h3>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Time</span><span className="font-medium">{formData.time}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Guests</span><span className="font-medium">{formData.guests}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Name</span><span className="font-medium">{formData.name}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Email</span><span className="font-medium">{formData.email}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmation(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleConfirmReservation} className="flex-1 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold hover:bg-[#e6c200] transition-all shadow-lg shadow-[#FFD700]/20">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reservation;
