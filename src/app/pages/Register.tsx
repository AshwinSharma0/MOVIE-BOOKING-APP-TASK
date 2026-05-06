import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Film, Check } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some((user: any) => user.email === formData.email);

    if (userExists) {
      alert('User with this email already exists!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Store user data
      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password, // In production, this should be hashed
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Store current user session
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
      }));

      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-indigo-950 flex overflow-hidden">
      {/* Left side: Pre-Login Director Scene */}
      <div className="hidden lg:flex w-1/2 relative p-8 bg-gradient-to-r from-purple-900/40 to-indigo-900/40">
        <div className="relative w-full h-full rounded-3xl border border-purple-500/30 p-6 overflow-hidden">
          <div className="text-xs tracking-widest text-purple-200 mb-2">Scene 1: Pre-Login – Awaiting Final Script</div>

          <div className="absolute top-14 left-10 w-36 h-36 rounded-lg bg-purple-600/60 border border-white/20 shadow-2xl" />
          <div className="absolute top-18 left-14 w-28 h-28 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-400" />
          <div className="absolute top-20 left-16 w-24 h-24 rounded-lg bg-black/40 border border-white/15" />
          <div className="absolute bottom-24 left-12 w-28 h-28 bg-slate-800/80 rounded-lg border border-purple-500/50 shadow-inner flex items-center justify-center text-white text-sm font-semibold">Director</div>

          <div className="absolute bottom-20 left-36 w-44 h-24 bg-purple-700/80 border border-purple-300/70 rounded-lg p-3 text-white">
            <div className="text-xs font-bold mb-1">CinemaHub Tablet Prop</div>
            <div className="space-y-1">
              <div className="h-2 bg-purple-500 rounded" />
              <div className="h-2 bg-purple-500 rounded" />
              <div className="h-2 bg-purple-500 rounded" />
            </div>
          </div>

          <motion.div
            className="absolute right-10 top-32 w-24 h-24 rounded-lg bg-purple-800/80 border border-purple-300/50"
            animate={{ x: [0, -10, 0, 8, 0], y: [0, -6, 0, -4, 0], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-center text-[10px] text-white mt-1">Ticket</p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-16 w-40 h-6 bg-purple-500/30 rounded-full"
            animate={{ x: [0, -18, 0, 18, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute bottom-8 right-8 w-12 h-12 border-2 border-purple-300/50 rounded-full"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Film className="w-8 h-8 text-purple-300" />
              <span className="text-3xl font-bold text-white">CinemaHub</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-purple-200">Join us and book your favorite movies</p>
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Input */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white placeholder:text-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white placeholder:text-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white placeholder:text-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants} className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white placeholder:text-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>

            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                {formData.password === formData.confirmPassword ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-red-400" />
                    <span className="text-red-400">Passwords don't match</span>
                  </>
                )}
              </motion.div>
            )}

            {/* Terms & Conditions */}
            <motion.div className="flex items-center gap-3 pt-2" variants={itemVariants}>
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded bg-purple-600/20 border-purple-400/30 text-rose-500 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-purple-200 text-sm cursor-pointer">
                I agree to the Terms & Conditions
              </label>
            </motion.div>

            {/* Register Button */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-lg transition-all duration-300 mt-4"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  'Create Account'
                )}
              </button>
            </motion.div>
          </form>

          {/* Sign In Link */}
          <motion.div className="text-center mt-6" variants={itemVariants}>
            <p className="text-purple-200">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
