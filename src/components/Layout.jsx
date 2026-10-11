import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  // scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        {/* key resets the boundary when the user navigates away from a crashed page */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Loader fullPage label="Loading page…" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
