import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useMovies } from '../hooks/useMovies';
import { getSimilarMovies } from '../utils/ai-recommendations';
import { MovieCard } from '../components/MovieCard';
import { Star, Clock, Calendar, Film, User, Play, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export function MovieDetails() {
  const { id } = useParams();
  const { movies, loading, error } = useMovies();
  const movie = movies.find(m => m.id === id);

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
  
  const similarMovies = getSimilarMovies(movie, movies, 4);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-64 rounded-xl shadow-2xl border-4 border-purple-900/30"
              />
            </motion.div>
            
            {/* Title and Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="text-lg font-bold text-amber-500">{movie.rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                
                <div className="px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold">
                  {movie.ageRating}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration} min</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <Link
                to={`/booking/${movie.id}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/50"
              >
                <Ticket className="w-5 h-5" />
                Book Tickets
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Synopsis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </motion.div>
            
            {/* Trailer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-purple-800/30 flex items-center justify-center group cursor-pointer">
                <img
                  src={movie.posterUrl}
                  alt="Trailer thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-purple-600 group-hover:bg-purple-500 flex items-center justify-center transition-all shadow-lg shadow-purple-900/50">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <span className="text-white font-semibold">Watch Trailer</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Director */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-slate-900/50 border border-purple-800/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Director</h3>
              </div>
              <p className="text-gray-300">{movie.director}</p>
            </motion.div>
            
            {/* Cast */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-xl bg-slate-900/50 border border-purple-800/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Cast</h3>
              </div>
              <ul className="space-y-2">
                {movie.cast.map((actor, index) => (
                  <li key={index} className="text-gray-300">
                    {actor}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl bg-slate-900/50 border border-purple-800/30"
            >
              <h3 className="font-semibold text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="text-gray-300 ml-2">{movie.language}</span>
                </div>
                <div>
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-gray-300 ml-2">
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Ticket Price:</span>
                  <span className="text-amber-500 ml-2 font-semibold">₹{movie.price}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
