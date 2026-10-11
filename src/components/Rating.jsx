export default function Rating({ value = 0, votes }) {
  const score = Number(value) || 0;
  return (
    <span className="rating" title={votes ? `${votes.toLocaleString()} votes` : undefined}>
      <span className="star">★</span> {score ? score.toFixed(1) : "NR"}
    </span>
  );
}
