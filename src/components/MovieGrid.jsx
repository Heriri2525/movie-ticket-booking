import MovieCard from "./MovieCard.jsx";

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="movie-card skeleton-card">
          <div className="skeleton skeleton-poster" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

export default function MovieGrid({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
