-- SQLite schema for Movie Ticket Booking App backend
-- Uses raw SQL only, no ORM.


PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS movie (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating REAL NOT NULL,
    duration INTEGER NOT NULL,
    release_date TEXT NOT NULL,
    description TEXT NOT NULL,
    director TEXT NOT NULL,
    cast TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    trailer_url TEXT NOT NULL,
    language TEXT NOT NULL,
    age_rating TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS seat (
    id INTEGER PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    seat_number TEXT NOT NULL,
    row TEXT NOT NULL,
    column INTEGER NOT NULL,
    is_booked INTEGER NOT NULL DEFAULT 0,
    lock_token TEXT,
    locked_until TEXT,
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    UNIQUE (movie_id, seat_number)
);

CREATE TABLE IF NOT EXISTS booking (
    id INTEGER PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    order_id TEXT,
    payment_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE
);
