import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { MovieDetails } from './pages/MovieDetails';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { AIPicks } from './pages/AIPicks';
import { MyBookings } from './pages/MyBookings';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          },
        }}
      />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/browse',
    element: (
      <Layout>
        <Browse />
      </Layout>
    ),
  },
  {
    path: '/movie/:id',
    element: (
      <Layout>
        <MovieDetails />
      </Layout>
    ),
  },
  {
    path: '/booking/:id',
    element: (
      <Layout>
        <Booking />
      </Layout>
    ),
  },
  {
    path: '/payment',
    element: (
      <Layout>
        <Payment />
      </Layout>
    ),
  },
  {
    path: '/ai-picks',
    element: (
      <Layout>
        <AIPicks />
      </Layout>
    ),
  },
  {
    path: '/my-bookings',
    element: (
      <Layout>
        <MyBookings />
      </Layout>
    ),
  },
  {
    path: '/admin',
    element: (
      <Layout>
        <AdminDashboard />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      </Layout>
    ),
  },
]);