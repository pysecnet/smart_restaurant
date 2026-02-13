import { API_BASE_URL } from "../../../config/api";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

interface Reservation {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  confirmed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-red-50 border-red-200', text: 'text-red-600', dot: 'bg-red-500' },
  completed: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/reservations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/reservations/${reservationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations();
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  const counts = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Skeleton
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 w-36 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load reservations</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button onClick={fetchReservations} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2233]">Reservations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{reservations.length} total reservations</p>
        </div>
        <button
          onClick={fetchReservations}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => {
          const count = status === 'all' ? reservations.length : (counts[status] || 0);
          const isActive = filter === status;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1a2233] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reservations */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No reservations found</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all' ? 'No reservations have been made yet.' : `No ${filter} reservations.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reservation) => {
            const config = statusConfig[reservation.status] || statusConfig.pending;
            return (
              <div key={reservation.id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-5 sm:p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#1a2233]">{reservation.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Booked {new Date(reservation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{reservation.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{reservation.email}</span>
                  </div>

                  {/* Special Requests */}
                  {reservation.special_requests && (
                    <div className="mb-4 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-2">
                        <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700">{reservation.special_requests}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          className="px-4 py-2 bg-[#1a2233] text-white rounded-xl text-sm font-medium hover:bg-[#2d3748] transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'completed')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reservations;
