import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="container state-box not-found">
      <h1>404</h1>
      <p>This page doesn't exist — maybe the show already ended.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
