import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useBookings } from "../context/BookingContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { activeCount } = useBookings();
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-icon" aria-hidden="true">▶</span>
          Cine<span>Book</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/movies" onClick={close}>Movies</NavLink>
          <NavLink to="/my-bookings" onClick={close}>
            My Bookings
            {activeCount > 0 && <span className="badge">{activeCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
