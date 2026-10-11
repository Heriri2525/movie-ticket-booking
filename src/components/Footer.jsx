export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} CineBook — Movie Ticket Booking</p>
        <p className="muted">
          Movie data provided by{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}
