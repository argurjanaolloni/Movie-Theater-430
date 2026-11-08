import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function ShowtimeSelection({ movie, onSelectTime }) {
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    async function getShowtimes() {
      const { data, error } = await supabase
        .from("showtime")
        .select("*")
        .eq("movieid", movie.movieid);

      if (error) {
        console.log(error.message);
      } else {
        setShowtimes(data);
      }
    }

    getShowtimes();
  }, [movie.movieid]);

  return (
    <div className="showtime-selection">
      {showtimes.map((showtime) => (
        <button
          key={showtime.showtimeid}
          onClick={() => onSelectTime(showtime)}
        >
          {showtime.time}
        </button>
      ))}
    </div>
  );
}

export default ShowtimeSelection;
