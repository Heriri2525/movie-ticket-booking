export default function Pagination({ page, totalPages, onChange }) {
  const last = Math.min(totalPages || 1, 500); // TMDB caps results at 500 pages
  if (last <= 1) return null;

  return (
    <div className="pagination">
      <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </button>
      <span>Page {page} of {last}</span>
      <button className="btn btn-outline btn-sm" disabled={page >= last} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}
