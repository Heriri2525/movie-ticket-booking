import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";

// Route-level code splitting: each page is downloaded only when first visited.
const Home = lazy(() => import("./pages/Home.jsx"));
const Movies = lazy(() => import("./pages/Movies.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const SeatSelection = lazy(() => import("./pages/SeatSelection.jsx"));
const MyBookings = lazy(() => import("./pages/MyBookings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movies/:id" element={<MovieDetails />} />
        <Route path="movies/:id/seats" element={<SeatSelection />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
