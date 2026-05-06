from flask import Blueprint, jsonify, request
from models import Movie

movies_bp = Blueprint('movies', __name__)

def parse_filter_values(key: str) -> list[str]:
    values = request.args.getlist(key)
    if not values:
        raw = request.args.get(key, '')
        if raw:
            values = [item.strip() for item in raw.split(',') if item.strip()]
    return [value for value in values if value]

@movies_bp.route('/movies', methods=['GET'])
def get_movies():
    """Get all movies with optional filtering by genre and language."""
    try:
        genre_filters = parse_filter_values('genre')
        language_filters = parse_filter_values('language')

        query = Movie.query
        if language_filters:
            query = query.filter(Movie.language.in_(language_filters))

        movies = query.all()

        if genre_filters:
            filtered_movies = []
            for movie in movies:
                genres = movie.genre or []
                if any(genre in genres for genre in genre_filters):
                    filtered_movies.append(movie)
            movies = filtered_movies

        movies_list = []
        for movie in movies:
            movies_list.append({
                'id': movie.id,
                'title': movie.title,
                'genre': movie.genre,
                'rating': movie.rating,
                'duration': movie.duration,
                'release_date': movie.release_date.isoformat(),
                'description': movie.description,
                'director': movie.director,
                'cast': movie.cast,
                'poster_url': movie.poster_url,
                'trailer_url': movie.trailer_url,
                'language': movie.language,
                'age_rating': movie.age_rating,
                'price': movie.price
            })

        return jsonify({
            'success': True,
            'movies': movies_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@movies_bp.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    """Get a specific movie by ID."""
    try:
        movie = Movie.query.get_or_404(movie_id)

        movie_data = {
            'id': movie.id,
            'title': movie.title,
            'genre': movie.genre,
            'rating': movie.rating,
            'duration': movie.duration,
            'release_date': movie.release_date.isoformat(),
            'description': movie.description,
            'director': movie.director,
            'cast': movie.cast,
            'poster_url': movie.poster_url,
            'trailer_url': movie.trailer_url,
            'language': movie.language,
            'age_rating': movie.age_rating,
            'price': movie.price
        }

        return jsonify({
            'success': True,
            'movie': movie_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500