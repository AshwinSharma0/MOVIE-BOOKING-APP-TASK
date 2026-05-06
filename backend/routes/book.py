from flask import Blueprint, jsonify
from models import db, Booking
from sqlalchemy import text

book_bp = Blueprint('book', __name__)


# ✅ 1. TOTAL BOOKINGS
@admin_bp.route('/bookings', methods=['GET'])
def get_total_bookings():
    try:
        result = db.session.execute(
            text("SELECT COUNT(*) FROM booking")
        ).fetchone()

        return jsonify({
            "success": True,
            "total_bookings": result[0]
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ✅ 2. TOTAL REVENUE
@admin_bp.route('/revenue', methods=['GET'])
def get_total_revenue():
    try:
        result = db.session.execute(
            text("SELECT SUM(total_amount) FROM booking")
        ).fetchone()

        revenue = result[0] if result[0] else 0

        return jsonify({
            "success": True,
            "total_revenue": revenue
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ✅ 3. PEAK HOURS (FIXED 🔥)
@admin_bp.route('/peak-hours', methods=['GET'])
def get_peak_hours():
    try:
        query = """
        SELECT strftime('%H', booking_date) as hour, COUNT(*) as count
        FROM booking
        GROUP BY hour
        ORDER BY count DESC
        """

        results = db.session.execute(text(query)).fetchall()

        data = [
            {
                "hour": row[0],
                "count": row[1]
            }
            for row in results
        ]

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ✅ 4. BOOKINGS LIST (OPTIONAL BUT GOOD 🔥)
@admin_bp.route('/all', methods=['GET'])
def get_all_bookings():
    try:
        bookings = Booking.query.all()

        result = []

        for booking in bookings:
            result.append({
                "id": booking.id,
                "movie_title": booking.movie.title,
                "seat_number": booking.seat.seat_number,
                "user_name": booking.user_name,
                "user_email": booking.user_email,
                "total_amount": booking.total_amount,
                "payment_status": booking.payment_status,
                "booking_date": booking.booking_date.isoformat() if booking.booking_date else None
            })

        return jsonify({
            "success": True,
            "bookings": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500