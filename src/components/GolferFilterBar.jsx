export default function GolferFilterBar({ golferName, onClear }) {
  if (!golferName) return null;

  return (
    <div className="gf-bar">
      <span>Showing entries containing golfer: <span>{golferName}</span></span>
      <button className="gf-clear" onClick={onClear}>✕ Clear</button>
    </div>
  );
}
