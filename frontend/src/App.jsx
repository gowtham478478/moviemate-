import { useState, useEffect } from "react";
import { getAllMovies, searchMovies, getMovie, getRecommendations } from "./api";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
    loadRecommendations();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const data = await getAllMovies();
    setMovies(data);
    setLoading(false);
  };

  const loadRecommendations = async () => {
    const data = await getRecommendations();
    setRecommendations(data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      loadMovies();
      return;
    }
    setLoading(true);
    const data = await searchMovies(query);
    setMovies(data);
    setLoading(false);
  };

  const handleMovieClick = async (id) => {
    const data = await getMovie(id);
    setSelectedMovie(data);
  };

  return (
    <div id="root">
      <h1>🎬 MovieMate</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {recommendations.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h2>⭐ Recommended</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {recommendations.map((m) => (
              <div
                key={m.id}
                onClick={() => handleMovieClick(m.id)}
                style={{ border: "1px solid #444", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
              >
                {m.title} <br /> <small>{m.genre}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2>All Movies</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px" }}>
          {movies.map((m) => (
            <div
              key={m.id}
              onClick={() => handleMovieClick(m.id)}
              style={{ border: "1px solid #444", padding: "12px", borderRadius: "8px", cursor: "pointer" }}
            >
              {m.poster_url && (
                <img src={m.poster_url} alt={m.title} style={{ width: "100%", borderRadius: "4px" }} />
              )}
              <h3>{m.title}</h3>
              <p>{m.genre} • {m.release_year}</p>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <div
          onClick={() => setSelectedMovie(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}
        >
          <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "10px", maxWidth: "400px" }}>
            <h2>{selectedMovie.title}</h2>
            <p><b>Genre:</b> {selectedMovie.genre}</p>
            <p><b>Year:</b> {selectedMovie.release_year}</p>
            <p>{selectedMovie.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;