import os
import threading
import time

from flask import Flask
from flask_cors import CORS
from database import init_db
from models import release_expired_locks
from routes.movies import movies_bp
from routes.seats import seats_bp
from routes.book import book_bp
from routes.admin import admin_bp
from payments import payments_bp
from email_queue import start_email_worker

app = Flask(__name__)
CORS(app)

# Initialize database
init_db(app)

# Register blueprints
app.register_blueprint(movies_bp)
app.register_blueprint(seats_bp)
app.register_blueprint(book_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(payments_bp, url_prefix='/payment')


def start_lock_cleanup(application):
    def cleanup_loop():
        with application.app_context():
            while True:
                release_expired_locks()
                time.sleep(30)

    thread = threading.Thread(target=cleanup_loop, daemon=True)
    thread.start()


@app.route('/')
def home():
    return {
        'message': 'Movie Ticket Booking API',
        'version': '1.0',
        'endpoints': {
            'movies': '/movies',
            'movie_details': '/movies/<id>',
            'seats': '/seats/<movie_id>',
            'available_seats': '/seats/<movie_id>/available',
            'seat_status': '/seats/status?movie_id=<id>&seat_id=<id>',
            'lock_seat': 'POST /seats/lock',
            'create_booking': 'POST /book',
            'booking_details': '/book/<booking_id>',
            'user_bookings': '/book/user/<email>',
            'payment_create_order': 'POST /payment/create-order',
            'payment_verify': 'POST /payment/verify-payment',
            'payment_webhook': 'POST /payment/webhook',
            'admin_revenue': '/admin/revenue',
            'admin_bookings': '/admin/bookings',
            'admin_peak_hours': '/admin/peak-hours'
        }
    }

if __name__ == '__main__':
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        start_lock_cleanup(app)
        start_email_worker()
    app.run(debug=True, port=5000)


from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Backend working"})