// Seat map + showtime helpers.
// TMDB has no seat data, so "already taken" seats are generated deterministically
// per movie / date / time (same inputs always give the same map).

export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const COLS = 10;
export const MAX_SEATS = 8;

export const SEAT_TYPES = {
  standard: { label: "Standard", price: 8 },
  premium: { label: "Premium", price: 12 },
  vip: { label: "VIP", price: 16 },
};

export const getSeatType = (row) => {
  const index = ROWS.indexOf(row);
  if (index <= 2) return "standard";
  if (index <= 5) return "premium";
  return "vip";
};

export const getSeatPrice = (seatId) => SEAT_TYPES[getSeatType(seatId[0])].price;

export const SHOWTIMES = ["10:00", "13:30", "16:45", "19:30", "22:15"];

export const formatPrice = (n) => `$${n.toFixed(2)}`;

const pad = (n) => String(n).padStart(2, "0");
export const toDateValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function getNextDates(count = 5) {
  const dates = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      value: toDateValue(d),
      weekday: i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    });
  }
  return dates;
}

export function isShowtimePast(date, time) {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y, mo - 1, d, h, m) < new Date();
}

export function formatShowDate(date) {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTakenSeats(movieId, date, time) {
  const rand = mulberry32(hashString(`${movieId}|${date}|${time}`));
  const taken = [];
  ROWS.forEach((row) => {
    for (let col = 1; col <= COLS; col += 1) {
      if (rand() < 0.25) taken.push(`${row}${col}`);
    }
  });
  return taken;
}

export const generateBookingCode = () =>
  `MTB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
