import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { createBooking } from '../services/seatService';

interface PaymentData {
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  showTime: string;
  date: string;
  seats: any[];
  totalPrice: number;
  lockTokens: Record<string, string>;
}

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if no payment data
  useEffect(() => {
    if (!paymentData) {
      navigate('/browse');
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = async () => {
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName || !userEmail) {
      toast.error('Please fill in all payment details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    if (cvv.length !== 3) {
      toast.error('Please enter a valid 3-digit CVV');
      return;
    }

    if (!userEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        await createBooking({
          movie_id: paymentData.movieId,
          seat_ids: paymentData.seats.map((seat) => Number(seat.id)),
          user_name: cardholderName,
          user_email: userEmail,
          lock_tokens: paymentData.lockTokens
        });

        setPaymentSuccess(true);

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const newBooking = {
          id: Date.now().toString(),
          movieId: paymentData.movieId,
          movieTitle: paymentData.movieTitle,
          posterUrl: paymentData.posterUrl,
          showTime: paymentData.showTime,
          date: paymentData.date,
          seats: paymentData.seats,
          totalPrice: paymentData.totalPrice,
          bookingDate: new Date().toISOString(),
          paymentStatus: 'completed'
        };

        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        toast.success('Payment successful! Booking confirmed! 🎉');

        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } catch (err: any) {
        toast.error(err.message || 'Booking confirmation failed');
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900/50 border border-green-500/30 rounded-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">Your booking has been confirmed.</p>
          <div className="animate-pulse text-purple-400">Redirecting to your bookings...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Seat Selection
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Payment Details</h1>
              <p className="text-gray-400">Complete your booking with secure payment</p>
            </div>

            <div className="bg-slate-900/50 border border-purple-800/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-green-400 text-sm">256-bit SSL Encrypted</span>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <CreditCard className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-24 p-6 rounded-xl bg-slate-900/50 border border-purple-800/30">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>

              {/* Movie Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={paymentData.posterUrl}
                  alt={paymentData.movieTitle}
                  className="w-16 h-24 object-cover rounded-lg border border-purple-800/30"
                />
                <div>
                  <h4 className="text-white font-semibold">{paymentData.movieTitle}</h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(paymentData.date).toLocaleDateString()} at {paymentData.showTime}
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <h5 className="text-white font-medium mb-2">Selected Seats</h5>
                <div className="flex flex-wrap gap-2">
                  {paymentData.seats.map((seat: any) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1 bg-purple-900/30 border border-purple-800/30 rounded text-purple-300 text-sm"
                    >
                      {seat.id} (₹{seat.price})
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-purple-800/30 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-2xl font-bold text-amber-500">
                    ₹{paymentData.totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {paymentData.seats.length} seat{paymentData.seats.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{paymentData.totalPrice.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}