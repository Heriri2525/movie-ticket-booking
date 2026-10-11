import { memo } from "react";
import { COLS, ROWS, SEAT_TYPES, getSeatType } from "../utils/seats";

const Seat = memo(function Seat({ id, status, type, onToggle }) {
  return (
    <button
      type="button"
      className={`seat seat-${status} seat-type-${type}`}
      disabled={status === "taken"}
      aria-pressed={status === "selected"}
      aria-label={`Seat ${id}, ${SEAT_TYPES[type].label}, ${status}`}
      onClick={() => onToggle(id)}
    >
      {id.slice(1)}
    </button>
  );
});

export default function SeatGrid({ takenSeats, selectedSeats, onToggle }) {
  return (
    <div className="seat-map">
      <div className="screen" aria-hidden="true"><span>SCREEN</span></div>

      <div className="seat-rows">
        {ROWS.map((row) => (
          <div className="seat-row" key={row}>
            <span className="row-label">{row}</span>
            {Array.from({ length: COLS }, (_, i) => {
              const id = `${row}${i + 1}`;
              const status = takenSeats.has(id)
                ? "taken"
                : selectedSeats.includes(id)
                ? "selected"
                : "free";
              return (
                <Seat key={id} id={id} status={status} type={getSeatType(row)} onToggle={onToggle} />
              );
            })}
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      <ul className="seat-legend">
        <li><span className="seat seat-free" /> Available</li>
        <li><span className="seat seat-selected" /> Selected</li>
        <li><span className="seat seat-taken" /> Taken</li>
        {Object.entries(SEAT_TYPES).map(([key, t]) => (
          <li key={key}><span className={`dot dot-${key}`} /> {t.label} (${t.price})</li>
        ))}
      </ul>
    </div>
  );
}
