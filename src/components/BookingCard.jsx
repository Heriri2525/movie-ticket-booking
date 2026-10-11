import { Link } from "react-router-dom";
import { imageUrl } from "../api/tmdb.js";
import { formatPrice, formatShowDate } from "../utils/seats";

export default function BookingCard({ booking, isPast, onCancel, onRemove }) {
  const cancelled = booking.status === "cancelled";
  const state = cancelled ? "cancelled" : isPast ? "past" : "upcoming";

  return (
    <article className={`booking-card booking-${state}`}>
      <img src={imageUrl(booking.poster, "w185")} alt={`${booking.title} poster`} loading="lazy" />

      <div className="booking-info">
        <div className="booking-top">
          <h3>
            <Link to={`/movies/${booking.movieId}`}>{booking.title}</Link>
          </h3>
          <span className={`status status-${state}`}>{state}</span>
        </div>

        <dl className="booking-details">
          <div><dt>Date</dt><dd>{formatShowDate(booking.date)}</dd></div>
          <div><dt>Time</dt><dd>{booking.time}</dd></div>
          <div><dt>Seats</dt><dd>{booking.seats.join(", ")}</dd></div>
          <div><dt>Total</dt><dd>{formatPrice(booking.total)}</dd></div>
          <div><dt>Booked by</dt><dd>{booking.customer.name}</dd></div>
          <div><dt>Code</dt><dd className="code">{booking.id}</dd></div>
        </dl>

        <div className="booking-actions">
          {state === "upcoming" && (
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(booking.id)}>
              Cancel booking
            </button>
          )}
          {state !== "upcoming" && (
            <button className="btn btn-outline btn-sm" onClick={() => onRemove(booking.id)}>
              Remove from list
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
