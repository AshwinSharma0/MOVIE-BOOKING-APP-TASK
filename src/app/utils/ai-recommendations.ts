import { Movie, UserPreferences } from '../types/movie';

/**
 * AI-powered recommendation engine
 * Uses multiple algorithms to suggest movies based on user preferences
 */

// Calculate similarity score between two movies based on genres
function calculateGenreSimilarity(movie1: Movie, movie2: Movie): number {
  const genres1 = new Set(movie1.genre);
  const genres2 = new Set(movie2.genre);
  const intersection = new Set([...genres1].filter(g => genres2.has(g)));
  const union = new Set([...genres1, ...genres2]);
  
  return intersection.size / union.size;
}

// Calculate weighted score for a movie based on various factors
function calculateMovieScore(
  movie: Movie,
  preferences: UserPreferences,
  viewedMovie?: Movie
): number {
  let score = 0;
  
  // Rating weight (40% of total score)
  score += (movie.rating / 10) * 40;
  
  // Genre matching weight (40% of total score)
  const genreMatch = movie.genre.reduce((acc, genre) => {
    return acc + (preferences.favoriteGenres.includes(genre) ? 1 : 0);
  }, 0);
  score += (genreMatch / Math.max(movie.genre.length, 1)) * 40;
  
  // If comparing to a specific movie (for "similar movies")
  if (viewedMovie) {
    const similarity = calculateGenreSimilarity(movie, viewedMovie);
    score += similarity * 20;
  }
  
  // Recent release bonus (slight preference for newer movies)
  const releaseYear = new Date(movie.releaseDate).getFullYear();
  const currentYear = 2026;
  const recencyBonus = Math.max(0, (releaseYear - currentYear + 1) * 5);
  score += Math.min(recencyBonus, 10);
  
  return score;
}

// Get personalized recommendations based on user preferences
export function getPersonalizedRecommendations(
  allMovies: Movie[],
  preferences: UserPreferences,
  limit: number = 6
): Movie[] {
  // Filter out already watched movies
  const unwatchedMovies = allMovies.filter(
    movie => !preferences.watchedMovies.includes(movie.id)
  );
  
  // Calculate scores for all unwatched movies
  const scoredMovies = unwatchedMovies.map(movie => ({
    movie,
    score: calculateMovieScore(movie, preferences)
  }));
  
  // Sort by score and return top N
  return scoredMovies
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
}

// Get similar movies based on a specific movie
export function getSimilarMovies(
  targetMovie: Movie,
  allMovies: Movie[],
  limit: number = 4
): Movie[] {
  // Create temporary preferences based on the target movie
  const tempPreferences: UserPreferences = {
    favoriteGenres: targetMovie.genre,
    watchedMovies: [targetMovie.id],
    ratings: {}
  };
  
  const otherMovies = allMovies.filter(m => m.id !== targetMovie.id);
  
  const scoredMovies = otherMovies.map(movie => ({
    movie,
    score: calculateMovieScore(movie, tempPreferences, targetMovie)
  }));
  
  return scoredMovies
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
}

// Get trending movies (based on high ratings and recent releases)
export function getTrendingMovies(
  allMovies: Movie[],
  limit: number = 6
): Movie[] {
  const now = new Date();
  
  return allMovies
    .map(movie => {
      const releaseDate = new Date(movie.releaseDate);
      const daysSinceRelease = Math.floor(
        (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Trending score based on rating and recency
      const recencyFactor = Math.max(0, 1 - daysSinceRelease / 365);
      const trendingScore = movie.rating * (0.7 + recencyFactor * 0.3);
      
      return { movie, score: trendingScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
}

// Smart search with AI-enhanced results
export function smartSearch(
  query: string,
  allMovies: Movie[],
  preferences: UserPreferences
): Movie[] {
  const lowerQuery = query.toLowerCase();
  
  // First, find movies that match the search query
  const matchingMovies = allMovies.filter(movie => {
    return (
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.description.toLowerCase().includes(lowerQuery) ||
      movie.genre.some(g => g.toLowerCase().includes(lowerQuery)) ||
      movie.director.toLowerCase().includes(lowerQuery) ||
      movie.cast.some(c => c.toLowerCase().includes(lowerQuery))
    );
  });
  
  // Sort by relevance and user preferences
  return matchingMovies
    .map(movie => ({
      movie,
      score: calculateMovieScore(movie, preferences)
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.movie);
}

// Get movies by genre with AI ranking
export function getMoviesByGenre(
  genre: string,
  allMovies: Movie[],
  preferences: UserPreferences,
  limit?: number
): Movie[] {
  const filtered = genre === 'All' 
    ? allMovies 
    : allMovies.filter(movie => movie.genre.includes(genre));
  
  const scored = filtered.map(movie => ({
    movie,
    score: calculateMovieScore(movie, preferences)
  }));
  
  const sorted = scored.sort((a, b) => b.score - a.score);
  
  return limit ? sorted.slice(0, limit).map(item => item.movie) : sorted.map(item => item.movie);
}

// Update user preferences based on interaction
export function updatePreferences(
  preferences: UserPreferences,
  movie: Movie,
  action: 'watch' | 'rate',
  rating?: number
): UserPreferences {
  const updated = { ...preferences };
  
  if (action === 'watch' && !updated.watchedMovies.includes(movie.id)) {
    updated.watchedMovies = [...updated.watchedMovies, movie.id];
    
    // Add genres to favorites if not already there
    movie.genre.forEach(genre => {
      if (!updated.favoriteGenres.includes(genre)) {
        updated.favoriteGenres = [...updated.favoriteGenres, genre];
      }
    });
  }
  
  if (action === 'rate' && rating !== undefined) {
    updated.ratings = { ...updated.ratings, [movie.id]: rating };
  }
  
  return updated;
}
