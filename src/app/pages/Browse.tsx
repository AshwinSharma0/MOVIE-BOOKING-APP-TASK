import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { MovieCard } from '../components/MovieCard';
import { genres } from '../data/movies';
import { UserPreferences } from '../types/movie';
import { getMoviesByGenre, smartSearch } from '../utils/ai-recommendations';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useMovies } from '../hooks/useMovies';

export function Browse() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'release' | 'price'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  
  const [userPreferences] = useState<UserPreferences>({
    favoriteGenres: ['Sci-Fi', 'Action', 'Thriller'],
    watchedMovies: [],
    ratings: {}
  });

  const { movies, loading, error } = useMovies();

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = movies;
    
    // Apply search if query exists
    if (searchQuery) {
      result = smartSearch(searchQuery, movies, userPreferences);
    } else {
      // Apply genre filter
      result = getMoviesByGenre(selectedGenre, movies, userPreferences);
    }
    
    // Apply sorting
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'release':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [selectedGenre, sortBy, searchQuery, userPreferences, movies]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Movies'}
          </h1>
          <p className="text-gray-400">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-slate-900/50 rounded-lg border border-purple-800/30 mb-4"
          >
            <span className="flex items-center gap-2 text-white">
              <SlidersHorizontal className="w-5 h-5" />
              Filters & Sort
            </span>
            <Filter className="w-5 h-5 text-purple-400" />
          </button>
          
          {/* Filter Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Genre</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedGenre === genre
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-slate-900/50 text-gray-300 hover:bg-slate-800/50 border border-purple-800/30'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'rating', label: 'Rating' },
                  { value: 'title', label: 'Title' },
                  { value: 'release', label: 'Release Date' },
                  { value: 'price', label: 'Price' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSortBy(value as typeof sortBy)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === value
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                        : 'bg-slate-900/50 text-gray-300 hover:bg-slate-800/50 border border-purple-800/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-4">
              <Filter className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
