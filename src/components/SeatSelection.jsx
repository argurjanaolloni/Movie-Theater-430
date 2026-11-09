import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState([]);

  const movie = state?.movie;
  const time = state?.time;
  const showtimeid = state?.showtimeid;

  useEffect(() => {
    if (!showtimeid) return;

    async function getTickets() {
      const { data, error } = await supabase
        .from("ticket")
        .select("*")
        .eq("showtimeid", showtimeid)
        .order("seat");

      if (error) {
        console.log(error.message);
      } else {
        setTickets(data ?? []);
      }
    }

    getTickets();
  }, [showtimeid]);

  // Convert the database price into a number.
  function getPrice(price) {
    const number = Number(String(price ?? "").replace(/[$,\s]/g, ""));

    return Number.isFinite(number) ? number : 0;
  }

  const selectedTickets = tickets.filter((ticket) =>
    selectedSeats.includes(ticket.seat),
  );

  const totalPrice = selectedTickets.reduce(
    (total, ticket) => total + getPrice(ticket.price),
    0,
  );

  function toggleSeat(seat) {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  }

  if (!movie || !time || !showtimeid) {
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
          {movie.name} • {time}
        </p>
      </header>

      <div className="booking-layout">
        <section className="auditorium" aria-label="Choose seats">
          <div className="theater-screen">SCREEN</div>

          <div className="seat-grid">
            {tickets.map((ticket) => (
              <button
                key={ticket.ticketid}
                type="button"
                disabled={!ticket.isavailable}
                title={ticket.isavailable ? "" : "This seat is taken"}
                className={
                  selectedSeats.includes(ticket.seat) ? "seat selected" : "seat"
                }
                onClick={() => toggleSeat(ticket.seat)}
              >
                {ticket.seat} — ${getPrice(ticket.price).toFixed(2)}
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

            <span>
              <span className="legend-box taken" />
              Taken
            </span>
          </div>
        </section>

        <aside className="booking-summary">
          <h2>Booking Summary</h2>

          <p className="summary-movie">{movie.name}</p>

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
                  showtimeid,
                  selectedSeats,
                  selectedTickets,
                  totalPrice,
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
