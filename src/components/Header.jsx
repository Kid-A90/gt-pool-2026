export default function Header({ lastUpdated, isLive, onRefresh }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo-wrap">
          {/* REPLACED SVG WITH IMAGE TAG */}
          <img 
            src="/masters-logo.png" 
            alt="Masters Logo" 
            className="logo-svg" 
            style={{ width: '45px', height: 'auto', marginRight: '4px' }} 
          />
          
          <div className="logo-copy">
            <div className="logo-masters">Masters</div>
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