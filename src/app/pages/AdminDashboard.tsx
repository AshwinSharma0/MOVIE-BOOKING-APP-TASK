import { useEffect, useState } from 'react';
import { Loader2, BarChart3, DollarSign, Clock } from 'lucide-react';
import { fetchRevenue, fetchBookingsReport, fetchPeakHours } from '../services/adminService';

interface BookingRecord {
  id: number;
  movie_title: string;
  seat_number: string;
  user_name: string;
  user_email: string;
  total_amount: number;
  payment_status: string;
  order_id?: string;
  payment_id?: string;
  booking_date: string;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('INR');
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [peakHours, setPeakHours] = useState<Array<{ hour: string; count: number }>>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchRevenue(), fetchBookingsReport(), fetchPeakHours()])
      .then(([revenueRes, bookingsRes, peakRes]) => {
        if (!mounted) return;

        setRevenue(Number(revenueRes.total_revenue) || 0);
        setCurrency(revenueRes.currency || 'INR');
        setTotalBookings(Number(bookingsRes.total_bookings) || 0);
        setBookings(bookingsRes.bookings || []);
        setPeakHours(peakRes.peak_hours || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Unable to load admin data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-lg">
          <Loader2 className="animate-spin w-6 h-6" />
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white px-4">
        <div className="max-w-2xl w-full rounded-3xl border border-red-500/30 bg-slate-900/80 p-10 text-center">
          <p className="text-red-400 text-lg font-semibold">{error}</p>
          <p className="mt-4 text-sm text-slate-300">Make sure the backend is running and the admin endpoints are available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-3xl border border-purple-800/40 bg-slate-900/70 p-8 shadow-2xl shadow-purple-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-sm uppercase tracking-[0.24em] text-purple-400">Admin Dashboard</span>
              <h1 className="mt-3 text-4xl font-bold text-white">Cinema Analytics</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-purple-700/30 bg-slate-950/70 p-5 flex items-center gap-4">
                <DollarSign className="w-6 h-6 text-emerald-300" />
                <div>
                  <p className="text-sm uppercase text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-semibold">{currency} {revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-purple-700/30 bg-slate-950/70 p-5 flex items-center gap-4">
                <BarChart3 className="w-6 h-6 text-violet-300" />
                <div>
                  <p className="text-sm uppercase text-slate-400">Total Bookings</p>
                  <p className="text-2xl font-semibold">{totalBookings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-purple-800/30 bg-slate-900/70 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-purple-400">Bookings</p>
                <h2 className="text-2xl font-semibold">Recent bookings</h2>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="rounded-3xl bg-slate-950/80 p-6 text-center text-slate-400">
                  No bookings found yet.
                </div>
              ) : (
                bookings.slice(0, 8).map((booking) => (
                  <div key={booking.id} className="rounded-3xl bg-slate-950/80 p-5 border border-purple-800/20">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Booking #{booking.id}</p>
                        <p className="text-lg font-semibold text-white">{booking.movie_title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Seat</p>
                        <p className="font-semibold text-white">{booking.seat_number}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
                      <div>
                        <p className="text-slate-400">Customer</p>
                        <p>{booking.user_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Amount</p>
                        <p>₹{booking.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Status</p>
                        <p className="capitalize">{booking.payment_status}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-800/30 bg-slate-900/70 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-cyan-300" />
              <h2 className="text-xl font-semibold">Peak hours</h2>
            </div>
            <div className="space-y-3">
              {peakHours.length === 0 ? (
                <p className="text-slate-400">No peak hours data available.</p>
              ) : (
                peakHours.map((item) => (
                  <div key={item.hour} className="rounded-3xl bg-slate-950/80 p-4 border border-purple-800/20 flex items-center justify-between">
                    <span>Hour {item.hour}:00</span>
                    <span className="font-semibold">{item.count} bookings</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
