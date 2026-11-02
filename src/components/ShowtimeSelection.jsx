function ShowtimeSelection({ movie, onSelectTime }) {
  return (
    <div className="showtime-selection">
      {movie.showtimes.map((time, index) => (
        <button key={index} onClick={() => onSelectTime(time)}>
          {time}
        </button>
      ))}
    </div>
  );
}

export default ShowtimeSelection;
