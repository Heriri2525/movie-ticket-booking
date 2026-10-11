import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>
);
