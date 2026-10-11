import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMovieDetails, imageUrl } from "../api/tmdb.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";
import Rating from "../components/Rating.jsx";
import TrailerModal from "../components/TrailerModal.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFetch from "../hooks/useFetch";
import { SHOWTIMES, SEAT_TYPES, formatPrice } from "../utils/seats";

const formatRuntime = (mins) => (mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "N/A");

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const closeTrailer = useCallback(() => setShowTrailer(false), []);

  const { data: movie, loading, error, refetch } = useFetch(
    (signal) => getMovieDetails(id, signal),
    [id]
  );

  useDocumentTitle(movie?.title);

  const trailer = useMemo(
    () =>
      movie?.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      movie?.videos?.results.find((v) => v.site === "YouTube"),
    [movie]
  );
  const cast = useMemo(() => movie?.credits?.cast.slice(0, 8) ?? [], [movie]);
  const director = useMemo(
    () => movie?.credits?.crew.find((c) => c.job === "Director")?.name,
    [movie]
  );

  if (loading) return <Loader fullPage label="Loading movie…" />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error.message} onRetry={refetch} />
        <p className="center"><Link to="/movies" className="link-arrow">← Back to movies</Link></p>
      </div>
    );
  }

  return (
    <>
      <section
        className="details-hero"
        style={{ backgroundImage: `url(${imageUrl(movie.backdrop_path, "w1280")})` }}
      >
        <div className="details-overlay">
          <div className="container details-grid">
            <img
              className="details-poster"
              src={imageUrl(movie.poster_path, "w500")}
              alt={`${movie.title} poster`}
            />

            <div className="details-info">
              <button className="link-arrow back" onClick={() => navigate(-1)}>← Back</button>
              <h1>{movie.title}</h1>
              {movie.tagline && <p className="tagline">“{movie.tagline}”</p>}

              <div className="details-meta">
                <Rating value={movie.vote_average} votes={movie.vote_count} />
                <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span className="chip chip-outline">{movie.original_language?.toUpperCase()}</span>
              </div>

              <div className="genres">
                {movie.genres.map((g) => (
                  <Link key={g.id} to={`/movies?genre=${g.id}`} className="chip">{g.name}</Link>
                ))}
              </div>

              <h3>Overview</h3>
              <p className="overview">{movie.overview || "No overview available."}</p>
              {director && <p><strong>Director:</strong> {director}</p>}

              <div className="hero-actions">
                <Link to={`/movies/${movie.id}/seats`} className="btn btn-primary">Book tickets</Link>
                {trailer && (
                  <button className="btn btn-outline" onClick={() => setShowTrailer(true)}>▶ Watch trailer</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container page">
        {cast.length > 0 && (
          <section className="section-block">
            <h2>Top cast</h2>
            <div className="cast-grid">
              {cast.map((person) => (
                <div className="cast-card" key={person.id}>
                  <img src={imageUrl(person.profile_path, "w185")} alt={person.name} loading="lazy" />
                  <strong>{person.name}</strong>
                  <span className="muted">{person.character}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="section-block">
          <h2>Showtimes &amp; pricing</h2>
          <div className="showtime-row">
            {SHOWTIMES.map((t) => <span key={t} className="chip chip-outline">{t}</span>)}
          </div>
          <ul className="price-list">
            {Object.values(SEAT_TYPES).map((t) => (
              <li key={t.label}>{t.label}: <strong>{formatPrice(t.price)}</strong></li>
            ))}
          </ul>
          <Link to={`/movies/${movie.id}/seats`} className="btn btn-primary">Choose your seats</Link>
        </section>
      </div>

      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} title={movie.title} onClose={closeTrailer} />
      )}
    </>
  );
}
