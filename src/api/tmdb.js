// TMDB API layer — every network call in the app goes through this file.
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const imageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

async function request(endpoint, params = {}, signal) {
  if (!API_KEY || API_KEY === "your_tmdb_api_key_here") {
    throw new Error(
      "Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file and restart the dev server."
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Invalid TMDB API key.");
    if (res.status === 404) throw new Error("We couldn't find what you were looking for.");
    throw new Error(`Request failed (${res.status}). Please try again.`);
  }
  return res.json();
}

export const getNowPlaying = (page = 1, signal) =>
  request("/movie/now_playing", { page }, signal);

export const getPopular = (page = 1, signal) =>
  request("/movie/popular", { page }, signal);

export const getTopRated = (page = 1, signal) =>
  request("/movie/top_rated", { page }, signal);

export const getUpcoming = (page = 1, signal) =>
  request("/movie/upcoming", { page }, signal);

export const searchMovies = (query, page = 1, signal) =>
  request("/search/movie", { query, page, include_adult: false }, signal);

export const discoverMovies = ({ genre, sort = "popularity.desc", page = 1 }, signal) =>
  request(
    "/discover/movie",
    {
      with_genres: genre,
      sort_by: sort,
      page,
      include_adult: false,
      "vote_count.gte": sort.startsWith("vote_average") ? 200 : undefined,
    },
    signal
  );

export const getGenres = (signal) => request("/genre/movie/list", {}, signal);

export const getMovieDetails = (id, signal) =>
  request(`/movie/${id}`, { append_to_response: "credits,videos" }, signal);
