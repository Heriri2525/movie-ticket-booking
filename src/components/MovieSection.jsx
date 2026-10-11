import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ErrorMessage from "./ErrorMessage.jsx";
import MovieGrid, { MovieGridSkeleton } from "./MovieGrid.jsx";

/** A titled row of movies loaded with the `fetcher` it receives. */
export default function MovieSection({ title, fetcher, limit = 10, linkTo = "/movies" }) {
  const { data, loading, error, refetch } = useFetch(fetcher, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          <Link to={linkTo} className="link-arrow">View all →</Link>
        </div>
        {loading && <MovieGridSkeleton count={limit} />}
        {error && <ErrorMessage message={error.message} onRetry={refetch} />}
        {data && <MovieGrid movies={data.results.slice(0, limit)} />}
      </div>
    </section>
  );
}
