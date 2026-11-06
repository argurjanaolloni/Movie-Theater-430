import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Checkout() {
  const { state } = useLocation();
  const [confirmed, setConfirmed] = useState(false);

  const movie = state?.movie;
  const time = state?.time;
  const selectedSeats = state?.selectedSeats ?? [];
  const ticketPrice = state?.ticketPrice ?? 12;

  const totalPrice = selectedSeats.length * ticketPrice;

  if (!movie || !time || selectedSeats.length === 0) {
    return (
      <main className="checkout-page">
        <h1>No booking selected</h1>
        <Link to="/">Choose a movie</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="confirmation-card">
        <p className="seat-eyebrow">STAR TEAM MOVIES</p>

        <h1>{confirmed ? "Booking Confirmed!" : "Confirm Your Booking"}</h1>

        <p>
          {confirmed
            ? "Your booking is complete. Enjoy the movie!"
            : "Review your details before confirming."}
        </p>

        <div className="booking-summary">
          <h2>{movie.title}</h2>

          <dl>
            <div>
              <dt>Showtime</dt>
              <dd>{time}</dd>
            </div>

            <div>
              <dt>Seats</dt>
              <dd>{selectedSeats.join(", ")}</dd>
            </div>

            <div>
              <dt>Tickets</dt>
              <dd>{selectedSeats.length}</dd>
            </div>

            <div className="summary-total">
              <dt>Total</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        {confirmed ? (
          <Link className="checkout-button" to="/">
            Back to Movies
          </Link>
        ) : (
          <button
            className="checkout-button"
            onClick={() => setConfirmed(true)}
          >
            Confirm Booking
          </button>
        )}
      </section>
    </main>
  );
}

export default Checkout;
