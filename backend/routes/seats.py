from flask import Blueprint, jsonify, request
from models import Seat, Movie, db, release_expired_locks
from datetime import datetime, timedelta
import uuid

seats_bp = Blueprint('seats', __name__)

def get_seat_status(seat):
    if seat.is_booked:
        return 'BOOKED'
    if seat.locked_until and seat.locked_until > datetime.utcnow():
        return 'LOCKED'
    return 'AVAILABLE'


def get_seat_type_and_price(row, base_price):
    if row <= 'C':
        return 'vip', base_price + 100
    if row <= 'F':
        return 'premium', base_price + 50
    return 'standard', base_price


@seats_bp.route('/seats/<int:movie_id>', methods=['GET'])
def get_seats(movie_id):
    """Get all seats for a specific movie."""
    try:
        release_expired_locks()

        movie = Movie.query.get_or_404(movie_id)

        seats = Seat.query.filter_by(movie_id=movie_id).all()
        seats_list = []

        for seat in seats:
            seat_type, price = get_seat_type_and_price(seat.row, movie.price)
            seats_list.append({
                'id': seat.id,
                'seat_number': seat.seat_number,
                'row': seat.row,
                'column': seat.column,
                'type': seat_type,
                'price': price,
                'is_booked': seat.is_booked,
                'status': get_seat_status(seat),
                'is_locked': bool(seat.locked_until and seat.locked_until > datetime.utcnow()),
                'locked_until': seat.locked_until.isoformat() if seat.locked_until else None
            })

        return jsonify({
            'success': True,
            'movie_id': movie_id,
            'movie_title': movie.title,
            'seats': seats_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@seats_bp.route('/seats/<int:movie_id>/available', methods=['GET'])
def get_available_seats(movie_id):
    """Get only available seats for a specific movie."""
    try:
        release_expired_locks()

        movie = Movie.query.get_or_404(movie_id)

        available_seats = Seat.query.filter(Seat.movie_id == movie_id, Seat.is_booked == False, Seat.locked_until.is_(None)).all()
        seats_list = []

        for seat in available_seats:
            seat_type, price = get_seat_type_and_price(seat.row, movie.price)
            seats_list.append({
                'id': seat.id,
                'seat_number': seat.seat_number,
                'row': seat.row,
                'column': seat.column,
                'type': seat_type,
                'price': price,
                'is_booked': seat.is_booked,
                'status': 'AVAILABLE',
                'is_locked': False,
                'locked_until': None
            })

        return jsonify({
            'success': True,
            'movie_id': movie_id,
            'movie_title': movie.title,
            'available_seats': seats_list,
            'available_count': len(seats_list)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@seats_bp.route('/seats/status', methods=['GET'])
def seat_status():
    movie_id = request.args.get('movie_id', type=int)
    seat_id = request.args.get('seat_id', type=int)

    if movie_id is None or seat_id is None:
        return jsonify({
            'success': False,
            'message': 'movie_id and seat_id are required query parameters'
        }), 400

    try:
        release_expired_locks()

        seat = Seat.query.filter_by(id=seat_id, movie_id=movie_id).first_or_404()
        seat_type, price = get_seat_type_and_price(seat.row, movie.price)
        status = get_seat_status(seat)

        return jsonify({
            'success': True,
            'seat': {
                'id': seat.id,
                'movie_id': seat.movie_id,
                'seat_number': seat.seat_number,
                'row': seat.row,
                'column': seat.column,
                'type': seat_type,
                'price': price,
                'is_booked': seat.is_booked,
                'status': status,
                'locked_until': seat.locked_until.isoformat() if seat.locked_until else None
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@seats_bp.route('/seats/lock', methods=['POST'])
def lock_seat():
    """Lock a seat for 2 minutes to prevent double selection."""
    try:
        data = request.get_json()
        required_fields = ['movie_id', 'seat_id']

        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        movie_id = data['movie_id']
        seat_id = data['seat_id']

        release_expired_locks()

        seat = Seat.query.filter_by(id=seat_id, movie_id=movie_id).first_or_404()

        if seat.is_booked:
            return jsonify({
                'success': False,
                'message': 'Seat is already booked'
            }), 409

        if seat.locked_until and seat.locked_until > datetime.utcnow():
            return jsonify({
                'success': False,
                'message': 'Seat is currently locked',
                'locked_until': seat.locked_until.isoformat()
            }), 409

        seat.lock_token = uuid.uuid4().hex
        seat.locked_until = datetime.utcnow() + timedelta(minutes=2)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Seat locked for 2 minutes',
            'seat': {
                'id': seat.id,
                'seat_number': seat.seat_number,
                'movie_id': seat.movie_id,
                'status': 'LOCKED',
                'locked_until': seat.locked_until.isoformat(),
                'lock_token': seat.lock_token
            }
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@seats_bp.route('/seats/release', methods=['POST'])
def release_seat_lock():
    """Release an active seat lock before expiration."""
    try:
        data = request.get_json()
        required_fields = ['movie_id', 'seat_id']

        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        movie_id = data['movie_id']
        seat_id = data['seat_id']
        lock_token = data.get('lock_token')

        release_expired_locks()

        seat = Seat.query.filter_by(id=seat_id, movie_id=movie_id).first_or_404()

        if not seat.locked_until or seat.locked_until <= datetime.utcnow():
            return jsonify({
                'success': False,
                'message': 'No active lock exists for this seat'
            }), 409

        if lock_token and seat.lock_token != lock_token:
            return jsonify({
                'success': False,
                'message': 'Invalid lock token'
            }), 403

        seat.lock_token = None
        seat.locked_until = None
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Seat lock released successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500