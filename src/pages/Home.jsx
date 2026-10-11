import { getNowPlaying, getPopular, getTopRated, getUpcoming } from "../api/tmdb.js";
import Hero from "../components/Hero.jsx";
import MovieSection from "../components/MovieSection.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Fetchers are defined once outside the component so their identity never changes.
const nowPlaying = (signal) => getNowPlaying(1, signal);
const popular = (signal) => getPopular(1, signal);
const topRated = (signal) => getTopRated(1, signal);
const upcoming = (signal) => getUpcoming(1, signal);

export default function Home() {
  useDocumentTitle("Home");

  return (
    <>
      <Hero />
      <MovieSection title="Now Playing" fetcher={nowPlaying} />
      <MovieSection title="Popular" fetcher={popular} />
      <MovieSection title="Top Rated" fetcher={topRated} />
      <MovieSection title="Coming Soon" fetcher={upcoming} />
    </>
  );
}
