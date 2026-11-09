import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const movie = state?.movie;
  const time = state?.time;
  const selectedSeats = state?.selectedSeats ?? [];
  const showtimeid = state?.showtimeid;

  // use price from seatselection.jsx pg
  const totalPrice = Number(state?.totalPrice ?? 0);

  async function confirmBooking() {
    setSaving(true);
    setErrorMessage("");

    // Marks every seat as sold in one step.
    // If even one seat was already taken, nothing gets booked.
    const { error } = await supabase.rpc("book_seats", {
      p_showtimeid: showtimeid,
      p_seats: selectedSeats,
    });

    setSaving(false);

    if (error) {
      if (error.message.includes("seat_taken")) {
        setErrorMessage(
          "Sorry, one or more of your seats was just taken. Please pick again.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        console.log(error.message);
      }
      return;
    }

    setConfirmed(true);
  }

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

        {errorMessage && (
          <>
            <p className="checkout-error">{errorMessage}</p>
            <button
              className="checkout-button"
              onClick={() =>
                navigate("/seats", { state: { movie, time, showtimeid } })
              }
            >
              Choose Different Seats
            </button>
          </>
        )}

        {confirmed ? (
          <Link className="checkout-button" to="/">
            Back to Movies
          </Link>
        ) : (
          !errorMessage && (
            <button
              className="checkout-button"
              onClick={confirmBooking}
              disabled={saving}
            >
              {saving ? "Booking..." : "Confirm Booking"}
            </button>
          )
        )}
      </section>
    </main>
  );
}

export default Checkout;
