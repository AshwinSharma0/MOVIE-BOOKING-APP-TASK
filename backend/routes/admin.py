from flask import Blueprint, jsonify
from models import Booking, Movie, Seat, db
from sqlalchemy import text

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/revenue', methods=['GET'])
def get_revenue():
    """Return total collected revenue from all bookings."""
    total_revenue = db.session.query(db.func.coalesce(db.func.sum(Booking.total_amount), 0.0)).scalar()

    return jsonify({
        'success': True,
        'total_revenue': float(total_revenue),
        'currency': 'INR'
    }), 200

@admin_bp.route('/bookings', methods=['GET'])
def get_bookings():
    """Return booking metrics and booking count."""
    count_result = db.session.execute(text('SELECT COUNT(*) AS total_bookings FROM booking'))
    total_bookings = count_result.scalar() or 0

    bookings = Booking.query.order_by(Booking.booking_date.desc()).all()
    bookings_list = [
        {
            'id': booking.id,
            'movie_id': booking.movie_id,
            'movie_title': booking.movie.title if booking.movie else None,
            'seat_id': booking.seat_id,
            'seat_number': booking.seat.seat_number if booking.seat else None,
            'user_name': booking.user_name,
            'user_email': booking.user_email,
            'total_amount': booking.total_amount,
            'payment_status': booking.payment_status,
            'order_id': booking.order_id,
            'payment_id': booking.payment_id,
            'booking_date': booking.booking_date.isoformat() if booking.booking_date else None
        }
        for booking in bookings
    ]

    return jsonify({
        'success': True,
        'total_bookings': int(total_bookings),
        'bookings': bookings_list
    }), 200

from sqlalchemy import text

@admin_bp.route('/peak-hours')
def get_peak_hours():
    query = """
    SELECT strftime('%H', booking_date) as hour, COUNT(*) as count
    FROM bookings
    GROUP BY hour
    ORDER BY count DESC
    """

    results = db.session.execute(text(query)).fetchall()

    data = [{"hour": row[0], "count": row[1]} for row in results]

    return jsonify(data)