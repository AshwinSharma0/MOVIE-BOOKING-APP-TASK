import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

type LoginStatus = 'idle' | 'loading' | 'success' | 'failed';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<LoginStatus>('idle');

  const isSuccess = status === 'success';
  const isFailed = status === 'failed';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'loading') return;
    setStatus('loading');

    window.setTimeout(() => {
      // Check against stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        setStatus('success');

        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email
        }));

        window.setTimeout(() => {
          navigate('/');
        }, 1400);
      } else {
        setStatus('failed');
      }
    }, 900);
  };

  const animateJump = {
    initial: { y: 0, scale: 1, rotate: 0 },
    sitting: { y: 0, scale: 1, rotate: 0 },
    standing: { y: -16, scale: 1.02, rotate: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 p-8 overflow-hidden">
        <div className="relative bg-black/20 border border-purple-400/30 rounded-3xl w-full h-full p-6">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={isSuccess ? { opacity: [0, 0.5, 0.4] } : { opacity: [0.3, 0.12, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            variants={animateJump}
            animate={isSuccess ? 'standing' : 'sitting'}
            initial="initial"
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="absolute bottom-14 left-10 w-52 h-56 flex flex-col items-center justify-end"
          >
            <div className="w-52 h-28 bg-gradient-to-br from-orange-500 to-yellow-400/80 rounded-[20px] border border-white/20 shadow-2xl" />
            <div className="w-52 h-16 bg-slate-800 border border-purple-300/40 rounded-b-2xl rounded-t-none" />
            <div className="absolute -bottom-14 w-24 h-8 bg-slate-800 rounded-lg left-14 border border-purple-300/50 flex items-center justify-center text-xs">Director</div>
          </motion.div>

          <div className="absolute top-8 left-6"> 
            <p className="text-xs uppercase text-purple-300 tracking-widest">Movie set</p>
            {isSuccess && <p className="text-3xl text-amber-300 font-extrabold">Lights, Camera, Action!</p>}
            {isFailed && <p className="text-3xl text-red-400 font-extrabold">Retake!</p>}
            {status === 'loading' && <p className="text-xl text-slate-200">Processing...</p>}
          </div>

          <div className="absolute right-8 bottom-32 w-24 h-24 rounded-full border-2 border-purple-300/40 animate-spin duration-4000" />

          <motion.div
            className="absolute right-8 bottom-10 w-32 h-30 border-2 border-amber-400/60 rounded-lg bg-black/40 flex items-center justify-center text-2xl text-amber-100 font-bold"
            animate={isSuccess ? { rotate: [0, 10, -5, 0], scale: [1, 1.1, 1] } : { rotate: [0, -5, 5, 0], scale: [1, 0.98, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isSuccess ? '🎬' : '🎥'}
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-slate-900/80 border border-purple-400/30 shadow-2xl rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">CinemaHub</h1>
            <p className="text-slate-300 mt-2">Sign in to start your blockbuster booking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@cinemahub.com"
                className="w-full rounded-xl border border-purple-500/70 bg-purple-900/60 px-4 py-3 text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-purple-500/70 bg-purple-900/60 px-4 py-3 text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="inline-flex items-center gap-1"><input type="checkbox" className="h-3 w-3" /> Remember</label>
              <button type="button" className="text-purple-300 hover:text-purple-100">Forgot?</button>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
            >
              {status === 'loading' ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-slate-400">
            {isSuccess && <span className="text-emerald-300">Login successful! Redirecting…</span>}
            {isFailed && <span className="text-red-400">Login failed, try again with user: director@cinemahub.com / retake123</span>}
            {status === 'idle' && <span>Use credentials <b>director@cinemahub.com</b> / <b>retake123</b></span>}
          </div>

          <p className="mt-5 text-center text-purple-300/80 text-sm">
            New? <Link to="/register" className="text-rose-300">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
