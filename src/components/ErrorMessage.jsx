export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box" role="alert">
      <h3>Oops!</h3>
      <p>{message || "Something went wrong."}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
