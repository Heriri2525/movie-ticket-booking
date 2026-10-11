# CineBook – Movie Ticket Booking (React + CSS)

## Run it
1. `npm install`
2. Copy `.env.example` to `.env` and paste your free TMDB API key.
3. `npm run dev` → http://localhost:5173

## Where each React topic is used
| Topic | Where |
|---|---|
| Props & rendering | `MovieCard`, `MovieGrid`, `MovieSection`, `BookingCard`, `SeatGrid` |
| State & events (`useState`) | `Navbar`, `Movies`, `SeatSelection`, `CheckoutForm`, `Hero` |
| `useEffect` / `useRef` | `useFetch`, `useDebounce`, `Hero` (interval + pause ref), `Movies` (`/` shortcut + search ref), `SeatSelection` (scroll ref), `TrailerModal` |
| Hooks deep dive | custom hooks in `src/hooks`, `useReducer` + `useMemo` + `useCallback` in `BookingContext` |
| React Router v6 | `App.jsx` (nested routes, `Outlet`), `useParams`, `useNavigate`, `useSearchParams`, `NavLink`, `*` 404 |
| Context API | `BookingContext` (bookings shared by Navbar, SeatSelection, MyBookings) |
| Forms & controlled components | `CheckoutForm`, `SearchBar`, filters in `Movies` |
| Error boundaries | `ErrorBoundary` wrapped around every route in `Layout` |
| Performance & lazy loading | `React.lazy` + `Suspense` in `App`/`Layout`, `React.memo` on `MovieCard`/`Seat`, `useMemo`, lazy images |

## Data
Movie data comes from TMDB. Seat availability is generated per movie/date/time and
bookings are saved in `localStorage` (TMDB has no ticketing data).
