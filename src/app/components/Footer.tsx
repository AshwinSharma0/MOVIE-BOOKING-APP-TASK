import { Film, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 border-t border-purple-900/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-8 h-8 text-amber-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                CineAI
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Experience the future of movie booking with AI-powered recommendations tailored just for you. Discover, book, and enjoy the perfect movie every time.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/browse" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Browse Movies
                </a>
              </li>
              <li>
                <a href="/ai-picks" className="text-gray-400 hover:text-purple-400 transition-colors">
                  AI Recommendations
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="text-gray-400 hover:text-purple-400 transition-colors">
                  My Bookings
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-purple-900/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 CineAI. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ for movie lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
