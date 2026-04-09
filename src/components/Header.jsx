export default function Header({ lastUpdated, isLive, onRefresh }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo-wrap">
          <svg className="logo-svg" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 50 C14 42 18 35 24 31 L26 24 L32 20 L40 17 L50 16 L60 16 L68 18 L74 22 L80 27 L84 33 L87 40 L88 48 L87 56 L83 63 L77 68 L70 73 L62 76 L54 77 L46 76 L38 73 L30 68 L22 61 L17 54Z" fill="#F2C84B" stroke="#006747" strokeWidth="2.8"/>
            <path d="M40 71 L46 74 L54 75 L62 75 L68 73 L74 70 L68 73 L60 75 L52 75 L44 74 L38 72Z" fill="#006747"/>
            <ellipse cx="64" cy="56" rx="5.5" ry="5.5" fill="#006747" stroke="#F2C84B" strokeWidth="1.2"/>
            <ellipse cx="64" cy="56" rx="2.8" ry="2.8" fill="#0a160a"/>
            <line x1="64" y1="50" x2="64" y2="27" stroke="#1a1a18" strokeWidth="1.8"/>
            <polygon points="64,27 78,31 64,36" fill="#cc0000"/>
            <text x="52" y="20" fontFamily="Palatino Linotype,Palatino,serif" fontStyle="italic" fontSize="12" fontWeight="700" fill="#006747" textAnchor="middle" letterSpacing="0.8">Masters</text>
          </svg>
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
