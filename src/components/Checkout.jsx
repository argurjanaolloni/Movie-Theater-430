import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [foods, setFoods] = useState([]);
  const [foodCart, setFoodCart] = useState({});
  const [showFoodPopup, setShowFoodPopup] = useState(true);
  const [foodError, setFoodError] = useState("");

  const movie = state?.movie;
  const time = state?.time;
  const selectedSeats = state?.selectedSeats ?? [];
  const showtimeid = state?.showtimeid;

  // use price from seatselection.jsx pg
  const totalPrice = Number(state?.totalPrice ?? 0);

  function changeFoodQuantity(id, amount) {
    setFoodCart((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + amount),
    }));
  }

  const foodTotal = foods.reduce(
    (total, item) => total + (foodCart[item.id] || 0) * Number(item.price),
    0,
  );

  const finalTotal = totalPrice + foodTotal;

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

  useEffect(() => {
    async function getFoods() {
      const { data, error } = await supabase
        .from("F&B")
        .select("*")
        .eq("in stock", true);

      if (error) {
        setFoodError(error.message);
      } else {
        setFoods(data ?? []);
      }
    }

    getFoods();
  }, []);

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
          <h2>{movie.name}</h2>

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

            <div>
              <dt>Tickets</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>

            {foods
              .filter((item) => foodCart[item.id] > 0)
              .map((item) => (
                <div key={item.id}>
                  <dt>
                    {item["food/beverage"]} x {foodCart[item.id]}
                  </dt>

                  <dd>
                    ${(Number(item.price) * foodCart[item.id]).toFixed(2)}
                  </dd>
                </div>
              ))}

            <div className="summary-total">
              <dt>Total</dt>
              <dd>${finalTotal.toFixed(2)}</dd>
            </div>
          </dl>
          {!confirmed && (
            <button
              className="checkout-button"
              onClick={() => setShowFoodPopup(true)}
            >
              Add / Edit Food & Drinks
            </button>
          )}
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

      {showFoodPopup && !confirmed && (
        <div className="food-overlay">
          <div
            className="food-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="food-title"
          >
            <h2 id="food-title">Food & Drinks</h2>
            <p>Would you like any snacks with your movie?</p>

            {foodError && <p className="checkout-error">{foodError}</p>}

            {foods.map((item) => (
              <div className="food-item" key={item.id}>
                <div>
                  <h3>{item["food/beverage"]}</h3>
                  <p>${Number(item.price).toFixed(2)}</p>
                </div>

                <div className="food-quantity">
                  <button
                    type="button"
                    onClick={() => changeFoodQuantity(item.id, -1)}
                    disabled={!foodCart[item.id]}
                  >
                    -
                  </button>

                  <span>{foodCart[item.id] || 0}</span>

                  <button
                    type="button"
                    onClick={() => changeFoodQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <h3>Food Total: ${foodTotal.toFixed(2)}</h3>

            <button
              className="checkout-button"
              onClick={() => setShowFoodPopup(false)}
            >
              Continue to Checkout
            </button>

            <button
              className="skip-food"
              onClick={() => {
                setFoodCart({});
                setShowFoodPopup(false);
              }}
            >
              No Thanks, Skip
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Checkout;
