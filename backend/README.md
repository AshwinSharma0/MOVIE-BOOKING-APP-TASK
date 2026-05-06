# Movie Ticket Booking Backend

A Flask-based REST API for the Movie Ticket Booking application.

## Features

- Movie management (CRUD operations)
- Seat availability tracking
- Booking system
- CORS enabled for frontend integration

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/<id>` - Get specific movie

### Seats
- `GET /api/seats/<movie_id>` - Get all seats for a movie
- `GET /api/seats/<movie_id>/available` - Get available seats for a movie

### Bookings
- `POST /api/book` - Create a new booking
- `GET /api/book/<booking_id>` - Get booking details
- `GET /api/book/user/<email>` - Get user's bookings

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Seed the database:
```bash
python seed.py
```

4. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Database

Uses SQLite by default (`movie_booking.db`). The database includes three main tables:
- `movie` - Movie information
- `seat` - Seat availability per movie
- `booking` - User bookings

## Request/Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Optional message",
  "data": {...}
}
```