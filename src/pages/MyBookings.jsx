import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookingCard from "../components/BookingCard.jsx";
import { useBookings } from "../context/BookingContext.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { isShowtimePast } from "../utils/seats";

const TABS = ["all", "upcoming", "past", "cancelled"];

export default function MyBookings() {
  useDocumentTitle("My Bookings");
  const { bookings, cancelBooking, removeBooking } = useBookings();
  const { state } = useLocation();
  const [tab, setTab] = useState("all");

  const stateOf = (b) =>
    b.status === "cancelled" ? "cancelled" : isShowtimePast(b.date, b.time) ? "past" : "upcoming";

  const counts = useMemo(() => {
    const c = { all: bookings.length, upcoming: 0, past: 0, cancelled: 0 };
    bookings.forEach((b) => (c[stateOf(b)] += 1));
    return c;
  }, [bookings]);

  const visible = useMemo(
    () => (tab === "all" ? bookings : bookings.filter((b) => stateOf(b) === tab)),
    [bookings, tab]
  );

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking? The seats will be released.")) cancelBooking(id);
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this booking from your list?")) removeBooking(id);
  };

  return (
    <div className="container page">
      <header className="page-head">
        <h1>My Bookings</h1>
        <p className="muted">View, cancel and manage your tickets.</p>
      </header>

      {state?.justBooked && (
        <div className="alert alert-success" role="status">
          🎉 Booking confirmed! Your code is <strong>{state.justBooked}</strong>.
        </div>
      )}

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t} <span className="badge">{counts[t]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="state-box">
          <h3>{bookings.length === 0 ? "No bookings yet" : `No ${tab} bookings`}</h3>
          <p>Find a movie you love and grab the best seats.</p>
          <Link to="/movies" className="btn btn-primary">Browse movies</Link>
        </div>
      ) : (
        <div className="booking-list">
          {visible.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              isPast={isShowtimePast(b.date, b.time)}
              onCancel={handleCancel}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
