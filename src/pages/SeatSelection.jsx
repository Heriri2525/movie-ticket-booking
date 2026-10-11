import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMovieDetails, imageUrl } from "../api/tmdb.js";
import CheckoutForm from "../components/CheckoutForm.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";
import SeatGrid from "../components/SeatGrid.jsx";
import { useBookings } from "../context/BookingContext.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFetch from "../hooks/useFetch";
import {
  MAX_SEATS,
  SHOWTIMES,
  formatPrice,
  formatShowDate,
  getNextDates,
  getSeatPrice,
  getTakenSeats,
  isShowtimePast,
} from "../utils/seats";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking, getBookedSeats } = useBookings();

  const { data: movie, loading, error, refetch } = useFetch(
    (signal) => getMovieDetails(id, signal),
    [id]
  );
  useDocumentTitle(movie ? `Seats – ${movie.title}` : "Select seats");

  const dates = useMemo(() => getNextDates(5), []);
  const [date, setDate] = useState(dates[0].value);
  const [time, setTime] = useState(
    () => SHOWTIMES.find((t) => !isShowtimePast(dates[0].value, t)) ?? SHOWTIMES[0]
  );
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const checkoutRef = useRef(null);

  const takenSeats = useMemo(
    () => new Set([...getTakenSeats(id, date, time), ...getBookedSeats(id, date, time)]),
    [id, date, time, getBookedSeats]
  );

  const total = useMemo(() => selected.reduce((sum, s) => sum + getSeatPrice(s), 0), [selected]);

  const resetSelection = () => {
    setSelected([]);
    setShowForm(false);
  };

  const handleDate = (value) => {
    setDate(value);
    // if the chosen time already passed on the new date, jump to the first available one
    if (isShowtimePast(value, time)) {
      setTime(SHOWTIMES.find((t) => !isShowtimePast(value, t)) ?? time);
    }
    resetSelection();
  };

  const handleTime = (value) => {
    setTime(value);
    resetSelection();
  };

  const toggleSeat = (seatId) => {
    setSelected((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, seatId].sort((a, b) =>
        a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : a.localeCompare(b)
      );
    });
  };

  const handleContinue = () => {
    setShowForm(true);
    // wait for the form to render, then scroll to it
    requestAnimationFrame(() => checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const handleConfirm = (customer) => {
    setSubmitting(true);
    const booking = addBooking({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      date,
      time,
      seats: selected,
      total,
      customer: { name: customer.name.trim(), email: customer.email, phone: customer.phone },
      payment: customer.payment,
    });
    navigate("/my-bookings", { state: { justBooked: booking.id } });
  };

  if (loading) return <Loader fullPage label="Loading seat map…" />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error.message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to={`/movies/${movie.id}`} className="link-arrow">← Back to details</Link>

      <header className="page-head booking-head">
        <img src={imageUrl(movie.poster_path, "w185")} alt="" />
        <div>
          <h1>{movie.title}</h1>
          <p className="muted">{movie.runtime ? `${movie.runtime} min • ` : ""}{movie.genres.map((g) => g.name).join(", ")}</p>
        </div>
      </header>

      <section className="picker">
        <h3>1. Choose a date</h3>
        <div className="pill-row">
          {dates.map((d) => (
            <button
              key={d.value}
              className={`pill ${date === d.value ? "active" : ""}`}
              onClick={() => handleDate(d.value)}
            >
              <strong>{d.weekday}</strong>
              <span>{d.day}</span>
            </button>
          ))}
        </div>

        <h3>2. Choose a showtime</h3>
        <div className="pill-row">
          {SHOWTIMES.map((t) => {
            const past = isShowtimePast(date, t);
            return (
              <button
                key={t}
                className={`pill ${time === t ? "active" : ""}`}
                disabled={past}
                onClick={() => handleTime(t)}
              >
                {t}
              </button>
            );
          })}
        </div>

        <h3>3. Pick your seats <span className="muted">(max {MAX_SEATS})</span></h3>
      </section>

      <div className="booking-layout">
        <SeatGrid takenSeats={takenSeats} selectedSeats={selected} onToggle={toggleSeat} />

        <aside className="summary">
          <h3>Booking summary</h3>
          <dl>
            <div><dt>Movie</dt><dd>{movie.title}</dd></div>
            <div><dt>Date</dt><dd>{formatShowDate(date)}</dd></div>
            <div><dt>Time</dt><dd>{time}</dd></div>
            <div><dt>Seats</dt><dd>{selected.length ? selected.join(", ") : "—"}</dd></div>
          </dl>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            className="btn btn-primary btn-block"
            disabled={selected.length === 0 || showForm}
            onClick={handleContinue}
          >
            {selected.length === 0 ? "Select at least one seat" : "Continue"}
          </button>
        </aside>
      </div>

      {showForm && (
        <div ref={checkoutRef} className="checkout-wrap">
          <CheckoutForm
            total={total}
            seatCount={selected.length}
            onSubmit={handleConfirm}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}
