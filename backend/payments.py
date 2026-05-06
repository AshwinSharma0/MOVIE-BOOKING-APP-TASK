import os
import razorpay
from flask import Blueprint, request, jsonify, current_app
from models import Booking, Seat, db

payments_bp = Blueprint('payments', __name__)

client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))

@payments_bp.route('/create-order', methods=['POST'])
def create_order():
    data = request.json
    amount = 500 * 100  # ₹500 → paisa

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "receipt": data.get("receipt", "receipt_123")
    })

    return jsonify(order)

@payments_bp.route('/verify-payment', methods=['POST'])
def verify_payment():
    data = request.json

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature']
        })

        return jsonify({"status": "success"})

    except Exception as exc:
        current_app.logger.warning(f'Payment verification failed: {exc}')
        return jsonify({"status": "failed"}), 400

@payments_bp.route('/webhook', methods=['POST'])
def payment_webhook():
    payload = request.data
    signature = request.headers.get('X-Razorpay-Signature')
    secret = os.getenv('RAZORPAY_WEBHOOK_SECRET')

    if secret and signature:
        try:
            client.utility.verify_webhook_signature(payload, signature, secret)
        except Exception as exc:
            current_app.logger.warning(f'Invalid webhook signature: {exc}')
            return jsonify({
                'status': 'failure',
                'message': 'Invalid webhook signature'
            }), 400

    event = request.get_json(silent=True) or {}
    event_type = event.get('event')
    payment_entity = event.get('payload', {}).get('payment', {}).get('entity', {})
    order_id = payment_entity.get('order_id')
    payment_id = payment_entity.get('id')

    if event_type == 'payment.captured':
        bookings = Booking.query.filter_by(order_id=order_id).all() if order_id else []
        for booking in bookings:
            booking.payment_status = 'captured'
            booking.payment_id = payment_id
        db.session.commit()

        current_app.logger.info(f'Handled payment.captured for order_id={order_id} payment_id={payment_id}')
        return jsonify({'status': 'success', 'event': 'payment.captured'}), 200

    if event_type == 'payment.failed':
        bookings = Booking.query.filter_by(order_id=order_id).all() if order_id else []
        for booking in bookings:
            booking.payment_status = 'failed'
            booking.payment_id = payment_id
            if booking.seat:
                booking.seat.is_booked = False
                booking.seat.lock_token = None
                booking.seat.locked_until = None
        db.session.commit()

        current_app.logger.info(f'Handled payment.failed for order_id={order_id} payment_id={payment_id}')
        return jsonify({'status': 'success', 'event': 'payment.failed'}), 200

    current_app.logger.info(f'Ignored webhook event: {event_type}')
    return jsonify({'status': 'ignored', 'event': event_type}), 200