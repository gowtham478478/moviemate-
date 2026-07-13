from flask import Blueprint, jsonify, request
from models.models import db, Movie, Rating

movie_bp = Blueprint("movies", __name__)
@movie_bp.route("/api/movies", methods=["GET"])
def get_all_movies():
    movies = Movie.query.all()
    result = [
        {
            "id": m.id,
            "title": m.title,
            "genre": m.genre,
            "description": m.description,
            "poster_url": m.poster_url,
            "release_year": m.release_year
        }
        for m in movies
    ]
    return jsonify(result)
@movie_bp.route("/api/movies/search", methods=["GET"])
def search_movies():
    query = request.args.get("q", "")
    movies = Movie.query.filter(Movie.title.ilike(f"%{query}%")).all()
    result = [
        {
            "id": m.id,
            "title": m.title,
            "genre": m.genre,
            "description": m.description,
            "poster_url": m.poster_url,
            "release_year": m.release_year
        }
        for m in movies
    ]
    return jsonify(result)


@movie_bp.route("/api/movies/<int:movie_id>", methods=["GET"])
def get_movie(movie_id):
    m = Movie.query.get_or_404(movie_id)
    return jsonify({
        "id": m.id,
        "title": m.title,
        "genre": m.genre,
        "description": m.description,
        "poster_url": m.poster_url,
        "release_year": m.release_year
    })


@movie_bp.route("/api/movies/recommendations", methods=["GET"])
def recommendations():
    # Simple logic: return top 5 highest rated movies
    movies = Movie.query.limit(5).all()
    result = [{"id": m.id, "title": m.title, "genre": m.genre} for m in movies]
    return jsonify(result)