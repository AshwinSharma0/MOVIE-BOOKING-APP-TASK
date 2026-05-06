from flask import Blueprint, jsonify, request
from models import db, Booking

book_bp = Blueprint('book', __name__)

# Booking routes will be added here