from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

def init_db(app: Flask):
    """Initialize the database with the Flask app."""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movie_booking.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Ensure lock columns exist for seat locking support.
        connection = db.engine.connect()
        try:
            connection.execute(text('ALTER TABLE seat ADD COLUMN lock_token TEXT'))
        except Exception:
            pass
        try:
            connection.execute(text('ALTER TABLE seat ADD COLUMN locked_until TEXT'))
        except Exception:
            pass
        try:
            connection.execute(text('ALTER TABLE booking ADD COLUMN order_id TEXT'))
        except Exception:
            pass
        try:
            connection.execute(text('ALTER TABLE booking ADD COLUMN payment_id TEXT'))
        except Exception:
            pass
        try:
            connection.execute(text('ALTER TABLE booking ADD COLUMN payment_status TEXT DEFAULT "pending"'))
        except Exception:
            pass
        connection.close()

# Import models here to ensure they are registered with SQLAlchemy
from models import Movie, Seat, Booking