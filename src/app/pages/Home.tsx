import { useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { UserPreferences } from '../types/movie';
import { getTrendingMovies, getPersonalizedRecommendations } from '../utils/ai-recommendations';
import { Sparkles, TrendingUp, Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useMovies } from '../hooks/useMovies';

export function Home() {
  const [userPreferences] = useState<UserPreferences>({
    favoriteGenres: ['Sci-Fi', 'Action', 'Thriller'],
    watchedMovies: [],
    ratings: {}
  });

  const { movies, loading, error } = useMovies();
  const trendingMovies = getTrendingMovies(movies, 6);
  const aiRecommendations = getPersonalizedRecommendations(movies, userPreferences, 6);
  const featuredMovie = movies[0];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">{error}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">No movies available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.posterUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Featured This Week</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {featuredMovie.title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-6 line-clamp-3">
              {featuredMovie.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <span className="text-amber-500 font-semibold">{featuredMovie.rating}</span>
                </div>
                <span className="text-gray-400">{featuredMovie.duration} min</span>
              </div>
              <div className="flex gap-2">
                {featuredMovie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm border border-purple-800/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/booking/${featuredMovie.id}`}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/50"
              >
                <Play className="w-5 h-5" />
                Book Now
              </Link>
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="px-8 py-3 bg-slate-900/50 hover:bg-slate-800/50 text-white rounded-lg font-semibold border border-purple-800/30 hover:border-purple-600/50 transition-all backdrop-blur-sm"
              >
                More Info
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* AI Recommendations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">AI Picks For You</h2>
              <p className="text-gray-400">Personalized recommendations based on your taste</p>
            </div>
          </div>
          <Link
            to="/ai-picks"
            className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aiRecommendations.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </section>
      
      {/* Trending Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Trending Now</h2>
              <p className="text-gray-400">Most popular movies this week</p>
            </div>
          </div>
          <Link
            to="/browse"
            className="hidden sm:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            Browse All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
