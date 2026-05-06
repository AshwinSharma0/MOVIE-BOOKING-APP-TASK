import { useState, useEffect } from 'react';
import { Booking } from '../types/movie';
import { Ticket, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);
  
  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    toast.success('Booking cancelled successfully');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-900/50">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Bookings</h1>
              <p className="text-gray-400 mt-1">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-900/20 hover:border-purple-600/50 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={booking.posterUrl}
                      alt={booking.movieTitle}
                      className="w-32 h-48 object-cover rounded-lg border-2 border-purple-900/30"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {booking.movieTitle}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-600/30">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-green-400 font-semibold">Confirmed</span>
                      </div>
                    </div>
                    
                    {/* Date & Time */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-purple-800/30">
                        <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-purple-800/30">
                        <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Show Time</p>
                          <p className="text-white font-semibold">{booking.showTime}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Seats */}
                    <div className="px-4 py-3 rounded-lg bg-slate-800/50 border border-purple-800/30">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">Seats</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.seats.map((seat) => (
                              <span
                                key={seat.id}
                                className="px-3 py-1 rounded bg-purple-900/30 text-purple-300 text-sm font-semibold border border-purple-800/30"
                              >
                                {seat.id}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Date */}
                    <p className="text-sm text-gray-500">
                      Booked on {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {/* Price & Actions */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-amber-500">
                        ₹{booking.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.seats.length} seat{booking.seats.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/30 hover:border-red-600/50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
                
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-900/5 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-900/30 mb-6">
              <Ticket className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">
              Start exploring movies and book your first show!
            </p>
            <a
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-900/30"
            >
              Browse Movies
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
