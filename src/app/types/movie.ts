export interface Movie {
  id: string;
  title: string;
  genre: string[];
  rating: number;
  duration: number; // in minutes
  releaseDate: string;
  description: string;
  director: string;
  cast: string[];
  posterUrl: string;
  trailerUrl: string;
  language: string;
  ageRating: string;
  price: number;
}

export interface ShowTime {
  id: string;
  movieId: string;
  time: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: number;
  seatNumber: string;
  row: string;
  column: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
  status?: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
  lockedUntil?: string | null;
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  showTime: string;
  date: string;
  seats: Seat[];
  totalPrice: number;
  bookingDate: string;
}

export interface UserPreferences {
  favoriteGenres: string[];
  watchedMovies: string[];
  ratings: { [movieId: string]: number };
}
