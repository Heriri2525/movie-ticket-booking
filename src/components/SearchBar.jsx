export default function SearchBar({ value, onChange, inputRef }) {
  return (
    <div className="search-bar">
      <span aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search movies…  (press / to focus)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search movies"
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
