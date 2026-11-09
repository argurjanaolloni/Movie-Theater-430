import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import "./style.css";
import "./App.css";
import ShowtimeSelection from "./components/ShowtimeSelection.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import SeatSelection from "./components/SeatSelection.jsx";
import Checkout from "./components/Checkout.jsx";

function App() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase.from("movie").select("*");

      if (error) {
        console.error("Error:", error.message);
      } else {
        setMovies(data);
      }
    }

    fetchMovies();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <header className="navbar">
              <h1>Star Team Movies</h1>
              <a href="#movies">See a Movie</a>
            </header>

            <main id="movies">
              <div className="movie-list">
                {movies.map((movie) => (
                  <div className="movie-card" key={movie.movieid}>
                    <img src={movie.poster} alt={movie.name} />
                    <h3>{movie.name}</h3>
                    <p>{movie.genre}</p>

                    <button onClick={() => setSelectedMovie(movie)}>
                      {selectedMovie?.id === movie.movieid
                        ? "Selected"
                        : "Get Tickets"}
                    </button>
                  </div>
                ))}
              </div>

              {selectedMovie && (
                <div className="selection">
                  <button
                    type="button"
                    className="close-button"
                    aria-label="Close"
                    onClick={() => setSelectedMovie(null)}
                  >
                    ×
                  </button>

                  <h2>Select a Showtime</h2>

                  <div className="selection-content">
                    <img src={selectedMovie.poster} alt={selectedMovie.name} />

                    <div className="selection-details">
                      <h2>{selectedMovie.name}</h2>
                      <p>{selectedMovie.genre}</p>

                      <hr />

                      <h3>Available Times</h3>

                      <ShowtimeSelection
                        movie={selectedMovie}
                        onSelectTime={(showtime) =>
                          navigate("/seats", {
                            state: {
                              movie: selectedMovie,
                              time: showtime.time,
                              showtimeid: showtime.showtimeid,
                            },
                          })
                        }
                      />
                      {selectedTime && (
                        <p>
                          You have selected {selectedTime} for{" "}
                          {selectedMovie.name}.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        }
      />

      <Route path="/seats" element={<SeatSelection />} />
      <Route path="/Checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;
