import type { Movie } from '../types/movie';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function mapMovie(movie: any): Movie {
  return {
    id: movie.id?.toString() ?? '',
    title: movie.title ?? '',
    genre: movie.genre ?? [],
    rating: typeof movie.rating === 'number' ? movie.rating : Number(movie.rating) || 0,
    duration: typeof movie.duration === 'number' ? movie.duration : Number(movie.duration) || 0,
    releaseDate: movie.release_date || movie.releaseDate || '',
    description: movie.description ?? '',
    director: movie.director ?? '',
    cast: movie.cast ?? [],
    posterUrl: movie.poster_url || movie.posterUrl || '',
    trailerUrl: movie.trailer_url || movie.trailerUrl || '',
    language: movie.language ?? '',
    ageRating: movie.age_rating || movie.ageRating || '',
    price: typeof movie.price === 'number' ? movie.price : Number(movie.price) || 0
  };
}

export async function fetchMovies(): Promise<Movie[]> {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) {
    throw new Error('Unable to fetch movies from the backend');
  }

  const data = await response.json();
  return (data.movies || []).map(mapMovie);
}

export async function fetchMovieById(id: string): Promise<Movie> {
  const response = await fetch(`${BASE_URL}/movies/${id}`);
  if (!response.ok) {
    throw new Error('Unable to fetch movie details');
  }

  const data = await response.json();
  return mapMovie(data.movie);
}
