from flask import Flask, jsonify, request
from flask_cors import CORS
from models.models import db, User, Movie, Rating
from routes.movie_routes import movie_bp
from werkzeug.security import generate_password_hash
import jwt
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///moviemate.db'
app.config['SECRET_KEY'] = 'moviemate-secret-key-gowtham'

CORS(app)
db.init_app(app)
app.register_blueprint(movie_bp)


@app.route("/")
def home():
    return jsonify({"message": "MovieMate backend running!"})


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    token = jwt.encode(
        {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return jsonify({"token": token, "username": user.username})


@app.route("/api/ratings", methods=["POST"])
def add_rating():
    data = request.get_json()
    new_rating = Rating(
        user_id=data['user_id'],
        movie_id=data['movie_id'],
        stars=data['stars']
    )
    db.session.add(new_rating)
    db.session.commit()
    return jsonify({"message": "Rating submitted"}), 201


@app.route("/api/ratings/<int:movie_id>", methods=["GET"])
def get_ratings(movie_id):
    ratings = Rating.query.filter_by(movie_id=movie_id).all()
    if not ratings:
        return jsonify({"average": 0, "count": 0})
    avg = sum(r.stars for r in ratings) / len(ratings)
    return jsonify({"average": round(avg, 1), "count": len(ratings)})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)