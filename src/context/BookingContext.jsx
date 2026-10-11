import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { generateBookingCode, isShowtimePast } from "../utils/seats";

const BookingContext = createContext(null);

function bookingReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.booking, ...state];
    case "CANCEL":
      return state.map((b) => (b.id === action.id ? { ...b, status: "cancelled" } : b));
    case "REMOVE":
      return state.filter((b) => b.id !== action.id);
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [saved, setSaved] = useLocalStorage("cinebook_bookings", []);
  const [bookings, dispatch] = useReducer(bookingReducer, saved);

  // keep localStorage in sync with the reducer state
  useEffect(() => {
    setSaved(bookings);
  }, [bookings, setSaved]);

  const addBooking = useCallback((data) => {
    const booking = {
      ...data,
      id: generateBookingCode(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD", booking });
    return booking;
  }, []);

  const cancelBooking = useCallback((id) => dispatch({ type: "CANCEL", id }), []);
  const removeBooking = useCallback((id) => dispatch({ type: "REMOVE", id }), []);

  // seats the current user already reserved for a given show
  const getBookedSeats = useCallback(
    (movieId, date, time) =>
      bookings
        .filter(
          (b) =>
            b.status === "confirmed" &&
            String(b.movieId) === String(movieId) &&
            b.date === date &&
            b.time === time
        )
        .flatMap((b) => b.seats),
    [bookings]
  );

  const activeCount = useMemo(
    () => bookings.filter((b) => b.status === "confirmed" && !isShowtimePast(b.date, b.time)).length,
    [bookings]
  );

  const value = useMemo(
    () => ({ bookings, activeCount, addBooking, cancelBooking, removeBooking, getBookedSeats }),
    [bookings, activeCount, addBooking, cancelBooking, removeBooking, getBookedSeats]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
}
