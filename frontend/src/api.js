const API_BASE = "http://localhost:5000/api";

export const getAllMovies = () =>
  fetch(`${API_BASE}/movies`).then((res) => res.json());

export const searchMovies = (query) =>
  fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}`).then((res) => res.json());

export const getMovie = (id) =>
  fetch(`${API_BASE}/movies/${id}`).then((res) => res.json());

export const getRecommendations = () =>
  fetch(`${API_BASE}/movies/recommendations`).then((res) => res.json());