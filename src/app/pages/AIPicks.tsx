import { useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { genres } from '../data/movies';
import { UserPreferences } from '../types/movie';
import { getPersonalizedRecommendations } from '../utils/ai-recommendations';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useMovies } from '../hooks/useMovies';

export function AIPicks() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    favoriteGenres: ['Sci-Fi', 'Action', 'Thriller'],
    watchedMovies: [],
    ratings: {}
  });

  const { movies, loading, error } = useMovies();
  const recommendations = getPersonalizedRecommendations(movies, userPreferences, 12);
  
  const toggleGenrePreference = (genre: string) => {
    const newGenres = userPreferences.favoriteGenres.includes(genre)
      ? userPreferences.favoriteGenres.filter(g => g !== genre)
      : [...userPreferences.favoriteGenres, genre];
    
    setUserPreferences({
      ...userPreferences,
      favoriteGenres: newGenres
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-900/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">AI-Powered Recommendations</h1>
              <p className="text-gray-400 mt-1">Personalized movie picks just for you</p>
            </div>
          </div>
          
          {/* AI Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-950/30 border border-purple-800/30">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Smart Analysis</h3>
              </div>
              <p className="text-sm text-gray-400">
                Our AI analyzes your genre preferences and viewing patterns to suggest the perfect movies
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-800/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Trending Insights</h3>
              </div>
              <p className="text-sm text-gray-400">
                Combines personal taste with current trends to keep recommendations fresh and relevant
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-950/30 border border-blue-800/30">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Quality First</h3>
              </div>
              <p className="text-sm text-gray-400">
                Prioritizes highly-rated movies that match your preferences for the best experience
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Preference Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Customize Your Preferences</h2>
          <p className="text-gray-400 mb-4">
            Select your favorite genres to refine recommendations
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.filter(g => g !== 'All').map((genre) => {
              const isSelected = userPreferences.favoriteGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenrePreference(genre)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-slate-900/50 text-gray-300 hover:bg-slate-800/50 border border-purple-800/30'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </motion.div>
        
        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Your Personalized Picks ({recommendations.length})
            </h2>
          </div>
          
          {loading ? (
          <div className="text-center py-24 text-white">Loading recommendations...</div>
        ) : error ? (
          <div className="text-center py-24 text-white">{error}</div>
        ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
              <p className="text-gray-400">Select some genre preferences to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
