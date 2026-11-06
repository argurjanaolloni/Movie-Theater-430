import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const movie = state?.movie;
  const time = state?.time;
  const ticketPrice = 12;
  const totalPrice = selectedSeats.length * ticketPrice;

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
      <Link className="back-link" to="/">
        ← Back to movies
      </Link>

      <header className="seat-header">
        <p className="seat-eyebrow">STAR TEAM MOVIES</p>
        <h1>Select Your Seats</h1>
        <p>
          {movie.title} • {time}
        </p>
      </header>

      <div className="booking-layout">
        <section className="auditorium" aria-label="Choose seats">
          <div className="theater-screen">SCREEN</div>

          <div className="seat-grid">
            {seats.map((seat) => (
              <button
                key={seat}
                type="button"
                className={
                  selectedSeats.includes(seat) ? "seat selected" : "seat"
                }
                aria-label={`Seat ${seat}`}
                aria-pressed={selectedSeats.includes(seat)}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </button>
            ))}
          </div>

          <div className="seat-legend">
            <span>
              <span className="legend-box available" />
              Available
            </span>

            <span>
              <span className="legend-box chosen" />
              Selected
            </span>
          </div>
        </section>

        <aside className="booking-summary">
          <h2>Booking Summary</h2>

          <p className="summary-movie">{movie.title}</p>

          <dl>
            <div>
              <dt>Showtime</dt>
              <dd>{time}</dd>
            </div>

            <div>
              <dt>Seats</dt>
              <dd>
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "None selected"}
              </dd>
            </div>

            <div>
              <dt>Tickets</dt>
              <dd>{selectedSeats.length}</dd>
            </div>

            <div>
              <dt>Price per ticket</dt>
              <dd>${ticketPrice.toFixed(2)}</dd>
            </div>

            <div className="summary-total">
              <dt>Total</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>
          <button
            className="checkout-button"
            disabled={selectedSeats.length === 0}
            onClick={() =>
              navigate("/Checkout", {
                state: {
                  movie,
                  time,
                  selectedSeats,
                  ticketPrice,
                },
              })
            }
          >
            Continue to Checkout
          </button>
        </aside>
      </div>
    </main>
  );
}

export default SeatSelection;
