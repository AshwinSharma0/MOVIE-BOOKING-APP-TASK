import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seat, Movie } from '../types/movie';
import { Calendar, Clock, CreditCard, Check, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { fetchMovieById } from '../services/movieService';
import { fetchSeats, lockSeat, releaseSeatLock } from '../services/seatService';

export function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [seatError, setSeatError] = useState<string | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-03-25');
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMovieById(id)
      .then((movie) => setMovie(movie))
      .catch((err) => setError(err.message || 'Unable to load movie'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!movie) return;

    setSeatsLoading(true);
    setSeatError(null);

    fetchSeats(movie.id)
      .then((seats) => setSeats(seats))
      .catch((err) => setSeatError(err.message || 'Unable to load seat map'))
      .finally(() => setSeatsLoading(false));
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-gray-400 mb-4">{error || 'Unable to load movie details.'}</p>
          <Link to="/browse" className="text-purple-400 hover:text-purple-300">
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }
  
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  
  const showTimes = ['14:00', '16:30', '19:00', '21:30'];
  const dates = [
    '2026-03-24',
    '2026-03-25',
    '2026-03-26',
    '2026-03-27',
    '2026-03-28'
  ];
  
  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked || seat.status === 'BOOKED') {
      toast.error('This seat is already booked');
      return;
    }

    if (seat.status === 'LOCKED') {
      toast.error('This seat is currently locked');
      return;
    }

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        toast.error('Maximum 10 seats can be selected');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!movie) {
      toast.error('Movie data not loaded yet');
      return;
    }

    setIsLocking(true);
    const lockTokens: Record<number, string> = {};

    try {
      for (const seat of selectedSeats) {
        const { lock_token } = await lockSeat(movie.id, seat.id);
        lockTokens[seat.id] = lock_token;
      }

      navigate('/payment', {
        state: {
          movieId: movie.id,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          showTime: selectedTime,
          date: selectedDate,
          seats: selectedSeats,
          totalPrice,
          lockTokens
        }
      });
    } catch (err: any) {
      toast.error(err.message || 'Unable to lock selected seats');

      const acquiredSeatIds = Object.keys(lockTokens).map((key) => Number(key));
      await Promise.all(
        acquiredSeatIds.map((seatId) =>
          releaseSeatLock(movie.id, seatId, lockTokens[seatId]).catch(() => undefined)
        )
      );

      setSelectedSeats([]);
      setSeatsLoading(true);
      fetchSeats(movie.id)
        .then((seats) => setSeats(seats))
        .catch((seatErr) => setSeatError(seatErr.message || 'Unable to reload seats'))
        .finally(() => setSeatsLoading(false));
    } finally {
      setIsLocking(false);
    }
  };
  
  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked || seat.status === 'BOOKED') return 'bg-gray-700 cursor-not-allowed';
    if (seat.status === 'LOCKED') return 'bg-orange-900/40 cursor-not-allowed border-orange-500/50';
    if (selectedSeats.some((s) => s.id === seat.id)) return 'bg-purple-600 border-purple-400';
    if (seat.type === 'vip') return 'bg-amber-900/30 border-amber-600/50 hover:bg-amber-800/50';
    if (seat.type === 'premium') return 'bg-blue-900/30 border-blue-600/50 hover:bg-blue-800/50';
    return 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to={`/movie/${movie.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Movie Details
        </Link>
        
        {/* Movie Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-32 h-48 object-cover rounded-lg border-2 border-purple-900/30"
          />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genre.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm border border-purple-800/30"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-gray-400">{movie.duration} min · {movie.ageRating}</p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Select Date
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-900/50 border-purple-800/30 text-gray-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-sm">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-semibold">{dateObj.getDate()}</div>
                      <div className="text-xs">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Time Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Select Show Time
              </h2>
              <div className="flex flex-wrap gap-3">
                {showTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-6 py-3 rounded-lg border font-semibold transition-all ${
                      selectedTime === time
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-900/50 border-purple-800/30 text-gray-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Screen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Select Seats</h2>
              
              {/* Screen */}
              <div className="mb-8">
                <div className="h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-2" />
                <p className="text-center text-sm text-gray-400">Screen</p>
              </div>
              
              {/* Seats */}
              <div className="space-y-3 mb-6">
                {seatError ? (
                  <div className="text-red-400 text-center py-6">{seatError}</div>
                ) : seatsLoading ? (
                  <div className="text-gray-400 text-center py-6">Loading seats...</div>
                ) : (
                  rows.map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-center text-gray-400 font-semibold">{row}</span>
                      <div className="flex gap-2 flex-1 justify-center flex-wrap">
                        {seats
                          .filter((s) => s.row === row)
                          .map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={
                                seat.isBooked ||
                                seat.status === 'BOOKED' ||
                                seat.status === 'LOCKED' ||
                                isLocking
                              }
                              className={`w-8 h-8 rounded-t-lg border-2 transition-all ${getSeatColor(seat)}`}
                              title={`${seat.seatNumber} - ₹${seat.price} (${seat.type})`}
                            >
                              {selectedSeats.some((s) => s.id === seat.id) ? (
                                <Check className="w-4 h-4 text-white mx-auto" />
                              ) : (
                                <span className="text-[10px] text-white/70">{seat.column}</span>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-t-lg border-2 bg-slate-800/50 border-slate-600/50" />
                  <span className="text-gray-300">Standard (₹{movie.price})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-t-lg border-2 bg-blue-900/30 border-blue-600/50" />
                  <span className="text-gray-300">Premium (+₹50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-t-lg border-2 bg-amber-900/30 border-amber-600/50" />
                  <span className="text-gray-300">VIP (+₹100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-t-lg border-2 bg-orange-900/40 border-orange-500/50" />
                  <span className="text-gray-300">Locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-t-lg border-2 bg-gray-700" />
                  <span className="text-gray-300">Booked</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-24 p-6 rounded-xl bg-slate-900/50 border border-purple-800/30">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Seats</span>
                  <span className="text-white">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(s => s.id).join(', ') 
                      : 'None selected'}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-purple-800/30 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total</span>
                  <span className="text-3xl font-bold text-amber-500">₹{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || isLocking}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                {isLocking ? 'Locking seats...' : 'Proceed to Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
