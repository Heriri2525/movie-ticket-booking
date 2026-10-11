import { memo } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../api/tmdb.js";
import Rating from "./Rating.jsx";

// memo: the card only re-renders when its `movie` prop changes
function MovieCard({ movie }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";

  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-card-link">
        <div className="poster-wrap">
          <img
            src={imageUrl(movie.poster_path, "w342")}
            alt={`${movie.title} poster`}
            loading="lazy"
            width="342"
            height="513"
          />
          <div className="poster-rating"><Rating value={movie.vote_average} /></div>
        </div>
        <div className="movie-card-body">
          <h3 title={movie.title}>{movie.title}</h3>
          <p className="muted">{year}</p>
        </div>
      </Link>
      <Link to={`/movies/${movie.id}/seats`} className="btn btn-primary btn-sm btn-block">
        Book now
      </Link>
    </article>
  );
}

export default memo(MovieCard);
