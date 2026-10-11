export default function Loader({ label = "Loading…", fullPage = false }) {
  return (
    <div className={`loader ${fullPage ? "loader-full" : ""}`} role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
