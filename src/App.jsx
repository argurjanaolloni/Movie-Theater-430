import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import "./style.css";
import "./App.css";
import ShowtimeSelection from "./components/ShowtimeSelection.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import SeatSelection from "./components/SeatSelection.jsx";
import Checkout from "./components/Checkout.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [role, setRole] = useState("customer");

  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [movies, setMovies] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("Standard");

  const [foods, setFoods] = useState([]);
  const [snackCart, setSnackCart] = useState([]);

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

  useEffect(() => {
    async function fetchFoods() {
      const { data, error } = await supabase.from("F&B").select("*");

      if (error) {
        console.error(error.message);
      } else {
        setFoods(data);
      }
    }

    fetchFoods();
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setAuthMessage(
      error
        ? error.message
        : "Account created! Check your email if confirmation is required.",
    );
  }

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setAuthMessage(error ? error.message : "Logged in successfully!");
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage("Logged out.");
    }
  }

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
                    X
                  </button>

                  <h2>Select a Showtime</h2>

                  <div className="selection-content">
                    <img src={selectedMovie.poster} alt={selectedMovie.name} />

                    <div className="selection-details">
                      <h2>{selectedMovie.name}</h2>
                      <p>{selectedMovie.genre}</p>

                      <hr />
                      <h3>Movie Format</h3>

                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                      >
                        <option value="Standard">Standard</option>
                        <option value="IMAX">IMAX</option>
                        <option value="3D">3D</option>
                        <option value="Dolby">Dolby</option>
                      </select>
                      <h3>Available Times</h3>

                      <ShowtimeSelection
                        movie={selectedMovie}
                        onSelectTime={(showtime) => {
                          if (!user) {
                            setAuthMessage(
                              "Please log in to select a showtime.",
                            );

                            document
                              .getElementById("account")
                              ?.scrollIntoView();
                            return;
                          }
                          navigate("/seats", {
                            state: {
                              movie: selectedMovie,
                              time: showtime.time,
                              showtimeid: showtime.showtimeid,
                              format: selectedFormat,
                            },
                          });
                        }}
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
            <section className="feature-panel" id="food">
              <h2>Food & Drinks</h2>

              {foods
                .filter((item) => item.in_stock)
                .map((item) => (
                  <div key={item.id}>
                    <h3>{item["food/beverage"]}</h3>
                    <p>${Number(item.price).toFixed(2)}</p>

                    <button onClick={() => setSnackCart([...snackCart, item])}>
                      Add to Cart
                    </button>
                  </div>
                ))}

              <h3>Your Snack Cart</h3>

              <p>{snackCart.length} items selected</p>

              <p>
                Total: $
                {snackCart
                  .reduce((total, item) => total + Number(item.price), 0)
                  .toFixed(2)}
              </p>
            </section>
            <section className="feature-panel" id="account">
              <h2>My Account</h2>

              {user ? (
                <div>
                  <p>Logged in as: {user.email}</p>
                  <p>Role: {role}</p>

                  <button onClick={logOut}>Log Out</button>
                </div>
              ) : (
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button onClick={signUp}>Sign Up</button>

                  <button onClick={logIn}>Log In</button>
                </div>
              )}

              <p>{authMessage}</p>
            </section>
          </div>
        }
      />

      <Route path="/seats" element={<SeatSelection />} />
      <Route path="/Checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;
