from database import db
from datetime import datetime

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    genre = db.Column(db.JSON, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    release_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    director = db.Column(db.String(100), nullable=False)
    cast = db.Column(db.JSON, nullable=False)
    poster_url = db.Column(db.String(500), nullable=False)
    trailer_url = db.Column(db.String(500), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    age_rating = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, nullable=False)

    # Relationships
    bookings = db.relationship('Booking', backref='movie', lazy=True)

class Seat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    seat_number = db.Column(db.String(10), nullable=False)  # e.g., "A1", "B5"
    row = db.Column(db.String(5), nullable=False)  # e.g., "A", "B", "C"
    column = db.Column(db.Integer, nullable=False)  # e.g., 1, 2, 3
    is_booked = db.Column(db.Boolean, default=False, nullable=False)
    lock_token = db.Column(db.String(100), nullable=True)
    locked_until = db.Column(db.DateTime, nullable=True)

    # Relationships
    booking = db.relationship('Booking', backref='seat', uselist=False)

    __table_args__ = (
        db.UniqueConstraint('movie_id', 'seat_number', name='unique_movie_seat'),
    )

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    seat_id = db.Column(db.Integer, db.ForeignKey('seat.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    order_id = db.Column(db.String(100), nullable=True)
    payment_id = db.Column(db.String(100), nullable=True)
    payment_status = db.Column(db.String(50), default='pending', nullable=False)


def release_expired_locks():
    now = datetime.utcnow()
    expired_seats = Seat.query.filter(Seat.locked_until != None, Seat.locked_until < now).all()

    if not expired_seats:
        return

    for seat in expired_seats:
        seat.lock_token = None
        seat.locked_until = None

    db.session.commit()