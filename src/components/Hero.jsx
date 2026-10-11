import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getNowPlaying, imageUrl } from "../api/tmdb.js";
import useFetch from "../hooks/useFetch";
import ErrorMessage from "./ErrorMessage.jsx";
import Loader from "./Loader.jsx";
import Rating from "./Rating.jsx";

export default function Hero() {
  const { data, loading, error, refetch } = useFetch((signal) => getNowPlaying(1, signal), []);
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false); // ref: changing it must NOT re-render

  const slides = data ? data.results.filter((m) => m.backdrop_path).slice(0, 5) : [];

  // auto-advance every 6s, unless the mouse is over the hero
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) return <div className="hero hero-empty"><Loader label="Loading featured movies…" /></div>;
  if (error) return <div className="hero hero-empty"><ErrorMessage message={error.message} onRetry={refetch} /></div>;
  if (!slides.length) return null;

  const movie = slides[index];

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${imageUrl(movie.backdrop_path, "w1280")})` }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="hero-overlay">
        <div className="container hero-content">
          <span className="chip">Now playing</span>
          <h1>{movie.title}</h1>
          <div className="hero-meta">
            <Rating value={movie.vote_average} votes={movie.vote_count} />
            <span>{movie.release_date?.slice(0, 4)}</span>
          </div>
          <p className="hero-overview">{movie.overview}</p>
          <div className="hero-actions">
            <Link to={`/movies/${movie.id}/seats`} className="btn btn-primary">Book tickets</Link>
            <Link to={`/movies/${movie.id}`} className="btn btn-outline">View details</Link>
          </div>
          <div className="hero-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={i === index ? "active" : ""}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
