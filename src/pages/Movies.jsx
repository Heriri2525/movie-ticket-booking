import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { discoverMovies, getGenres, searchMovies } from "../api/tmdb.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import MovieGrid, { MovieGridSkeleton } from "../components/MovieGrid.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useDebounce from "../hooks/useDebounce";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFetch from "../hooks/useFetch";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Highest rated" },
  { value: "primary_release_date.desc", label: "Newest first" },
  { value: "primary_release_date.asc", label: "Oldest first" },
];

export default function Movies() {
  useDocumentTitle("Movies");

  // filters live in the URL so pages can be shared / refreshed / bookmarked
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const genre = params.get("genre") || "";
  const sort = params.get("sort") || "popularity.desc";
  const page = Number(params.get("page")) || 1;

  const [input, setInput] = useState(q);
  const debouncedInput = useDebounce(input, 500);
  const searchRef = useRef(null);

  const updateParams = useCallback(
    (patch) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([key, value]) => {
          if (value === "" || value === null || (key === "page" && value === 1)) next.delete(key);
          else next.set(key, value);
        });
        return next;
      });
    },
    [setParams]
  );

  // push the debounced search text into the URL
  useEffect(() => {
    if (debouncedInput !== q) updateParams({ q: debouncedInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  // keyboard shortcut: "/" focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const genresState = useFetch((signal) => getGenres(signal), []);
  const moviesState = useFetch(
    (signal) =>
      q ? searchMovies(q, page, signal) : discoverMovies({ genre, sort, page }, signal),
    [q, genre, sort, page]
  );

  // when searching, TMDB can't filter by genre, so we do it on the client
  const results = useMemo(() => {
    const list = moviesState.data?.results ?? [];
    if (q && genre) return list.filter((m) => m.genre_ids?.includes(Number(genre)));
    return list;
  }, [moviesState.data, q, genre]);

  const changePage = (p) => {
    updateParams({ page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container page">
      <header className="page-head">
        <h1>Browse Movies</h1>
        <p className="muted">Search, filter and find your next movie night.</p>
      </header>

      <div className="filters">
        <SearchBar value={input} onChange={setInput} inputRef={searchRef} />

        <select value={genre} onChange={(e) => updateParams({ genre: e.target.value, page: 1 })} aria-label="Genre">
          <option value="">All genres</option>
          {genresState.data?.genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select
          value={sort}
          disabled={Boolean(q)}
          onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
          aria-label="Sort by"
          title={q ? "Sorting is disabled while searching" : undefined}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {moviesState.loading && <MovieGridSkeleton count={20} />}
      {moviesState.error && <ErrorMessage message={moviesState.error.message} onRetry={moviesState.refetch} />}

      {!moviesState.loading && !moviesState.error && (
        results.length ? (
          <>
            <MovieGrid movies={results} />
            <Pagination page={page} totalPages={moviesState.data.total_pages} onChange={changePage} />
          </>
        ) : (
          <div className="state-box">
            <h3>No movies found</h3>
            <p>Try a different search term or genre.</p>
          </div>
        )
      )}
    </div>
  );
}
