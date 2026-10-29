import { useState } from "react";
import "./style.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const movies = [
    {
      id: 1,
      title: "La La Land",
      genre: "Romance",
      poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    },
    {
      id: 2,
      title: "Moonlight",
      genre: "Drama",
      poster: "https://image.tmdb.org/t/p/w500/4911T5FbJ9eD2Faz5Z8cT3SUhU3.jpg",
    },
    {
      id: 3,
      title: "The Neon Demon",
      genre: "Horror",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNTAyOTkxNTQ3NV5BMl5BanBnXkFtZTgwMjQ1NzQxOTE@._V1_.jpg",
    },
    {
      id: 4,
      title: "Your Name",
      genre: "Romance",
      poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    },
    {
      id: 5,
      title: "Spider-Man: Into the Spider-Verse",
      genre: "Animation",
      poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    },
    {
      id: 6,
      title: "Tron: Legacy",
      genre: "Sci-Fi",
      poster: "https://image.tmdb.org/t/p/w500/vuifSABRpSnxCAOxEnWpNbZSXpp.jpg",
    },
    {
      id: 7,
      title: "The Shape of Water",
      genre: "Fantasy",
      poster: "https://image.tmdb.org/t/p/w500/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg",
    },
    {
      id: 8,
      title: "Ad Astra",
      genre: "Sci-Fi",
      poster: "https://image.tmdb.org/t/p/w500/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
    },
  ];

  return (
    <div>
      <header className="navbar">
        <h1>Star Team Movies</h1>
        <a href="#movies">See a Movie</a>
      </header>

      <main id="movies">
        <hr />

        <div className="movie-list">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img src={movie.poster} alt={movie.title} />

              <button onClick={() => setSelectedMovie(movie)}>
                {selectedMovie?.id === movie.id ? "Selected" : "Get Tickets"}
              </button>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="selection">
            <h2>Selected: {selectedMovie.title}</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
