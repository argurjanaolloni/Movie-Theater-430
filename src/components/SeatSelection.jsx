import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function SeatSelection() {
  const { state } = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const movie = state?.movie;
  const time = state?.time;

  const seats = [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
  ];

  function toggleSeat(seat) {
    setSelectedSeats((previousSeats) =>
      previousSeats.includes(seat)
        ? previousSeats.filter((selectedSeat) => selectedSeat !== seat)
        : [...previousSeats, seat],
    );
  }

  if (!movie || !time) {
    return (
      <main>
        <p>Select a movie and showtime first.</p>
        <Link to="/">Go to movies</Link>
      </main>
    );
  }

  return (
    <main className="seat-selection">
      <Link to="/">← Back to movies</Link>

      <h1>Select Your Seats</h1>
      <h2>{movie.title}</h2>
      <p>Showtime: {time}</p>

      <p>Screen</p>

      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat}
            type="button"
            className={selectedSeats.includes(seat) ? "seat selected" : "seat"}
            aria-pressed={selectedSeats.includes(seat)}
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>

      <p>
        Selected seats:{" "}
        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
      </p>
    </main>
  );
}

export default SeatSelection;
