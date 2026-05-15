export default function Header({ lastUpdated, isLive, onRefresh }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo-wrap">
          <img
            src="/pga-logo.png"
            alt="PGA Championship Logo"
            className="logo-svg"
          />
          <div className="logo-copy">
            <div className="logo-title">PGA Championship</div>
            <div className="logo-pool">GT II Pool 2026 &nbsp;·&nbsp; Live Leaderboard</div>
          </div>
        </div>

        <div className="hdr-r">
          {timeStr && (
            <div className="upd-txt">Updated {timeStr}</div>
          )}
          <div className="pill">
            <div className={`dot${isLive ? '' : ' off'}`} />
            <span>{isLive ? 'Live' : 'Awaiting Data'}</span>
          </div>
          <button className="rbtn" onClick={onRefresh}>↻ Refresh</button>
        </div>
      </div>
    </header>
  );
}
