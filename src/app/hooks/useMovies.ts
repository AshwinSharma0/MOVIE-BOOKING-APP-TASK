import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';
import { fetchMovies } from '../services/movieService';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchMovies()
      .then((movies) => {
        if (mounted) {
          setMovies(movies);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load movies');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { movies, loading, error };
}
