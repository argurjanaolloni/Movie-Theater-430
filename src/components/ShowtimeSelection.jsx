function ShowtimeSelection({ movie, onSelectTime }) {
  return (
    <div className="showtime-selection">
      <h2>Showtimes for {movie.title}</h2>
      {movie.showtimes.map((showtime) => (
        <div className="ShowTimeprob" key={showtime.id}>
          <h2>{showtime.time}</h2>
          <button onClick={() => onSelectTime(showtime)}>Select</button>
        </div>
      ))}
    </div>
  );
}

export default ShowtimeSelection;
