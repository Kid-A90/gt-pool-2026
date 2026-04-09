import BoardRow from './BoardRow.jsx';
import { sortEntries } from '../utils/scoring.js';

function BoardHeader() {
  return (
    <div className="bhead">
      <div className="bh">POS</div>
      <div className="bh bh-nm">PLAYER</div>
      <div className="bh">A GOLFER</div>
      <div className="bh">B GOLFER</div>
      <div className="bh">C GOLFER</div>
      <div className="bh">D GOLFER</div>
      <div className="bh bh-td">TODAY</div>
      <div className="bh bh-gap">GAP</div>
      <div className="bh">TOTAL</div>
    </div>
  );
}

function SectionDivider({ label, onClearSearch }) {
  return (
    <div style={{
      background: 'var(--g3)', padding: '8px 16px',
      borderTop: '1px solid rgba(242,200,75,.2)',
      borderBottom: '1px solid rgba(242,200,75,.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
        {label}
      </span>
      {onClearSearch && (
        <button
          className="close-btn"
          onClick={onClearSearch}
          style={{ fontSize: 10, padding: '4px 10px' }}
        >
          ✕ Show All
        </button>
      )}
    </div>
  );
}

export default function Leaderboard({ scoredEntries, savedTeam, teamSearch, golferFilter, sortMode, onClearSearch }) {
  if (!scoredEntries.length) return null;

  const gfQ = golferFilter.toLowerCase();
  const tQ = teamSearch.trim().toLowerCase();
  const isTeamSearch = tQ.length > 0;

  const leaderTotal = scoredEntries
    .filter(e => e.has && !e.voided)
    .reduce((min, e) => (e.tot < min ? e.tot : min), Infinity);
  const safeLeaderTotal = isFinite(leaderTotal) ? leaderTotal : 0;

  // Apply filters
  let visible = scoredEntries;
  if (tQ) visible = visible.filter(e => e.name.toLowerCase().includes(tQ));
  if (gfQ) visible = visible.filter(e => ['a', 'b', 'c', 'd'].some(s => e[s].toLowerCase().includes(gfQ)));

  const rowProps = (e, i) => ({
    entry: e,
    leaderTotal: safeLeaderTotal,
    sortMode,
    savedTeam,
    golferFilter,
    animDelay: i * 0.016,
  });

  // ── Team search mode ──────────────────────────────────────────────
  if (isTeamSearch) {
    const matched = sortEntries(visible, sortMode);
    const leaders = sortEntries(
      scoredEntries.filter(e => e.has && !e.voided),
      'score'
    ).slice(0, 10);

    if (!matched.length) {
      return (
        <div className="empty"><p>No matching entries found.</p></div>
      );
    }

    return (
      <div className="board">
        {/* Search banner */}
        <div style={{
          background: 'var(--g)', padding: '9px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '2px solid var(--y)',
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--y)', fontWeight: 700 }}>
            Search Results
          </span>
          <button className="close-btn" onClick={onClearSearch} style={{ fontSize: 10, padding: '4px 10px' }}>
            ✕ Show All
          </button>
        </div>
        <BoardHeader />
        {matched.map((e, i) => <BoardRow key={e.name} {...rowProps(e, i)} />)}
        <SectionDivider label="Tournament Leaders — See How Far Back You Are" />
        {leaders.map((e, i) => <BoardRow key={`ld-${e.name}`} {...rowProps(e, i)} />)}
      </div>
    );
  }

  // ── Default mode: pin saved team, then full field ─────────────────
  const sorted = sortEntries(visible, sortMode);

  if (!sorted.length) {
    return <div className="empty"><p>No matching entries found.</p></div>;
  }

  if (savedTeam) {
    const mine = sorted.filter(e => e.name.toLowerCase() === savedTeam.toLowerCase());
    const rest = sorted.filter(e => e.name.toLowerCase() !== savedTeam.toLowerCase());

    return (
      <div className="board">
        {mine.length > 0 && (
          <>
            <div style={{
              background: 'var(--g)', padding: '9px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '2px solid var(--y)',
            }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--y)', fontWeight: 700 }}>
                ⭐ {savedTeam}
              </span>
              <span style={{ fontSize: 10, fontWeight: 300, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                Your Saved Team
              </span>
            </div>
            <BoardHeader />
            {mine.map((e, i) => <BoardRow key={e.name} {...rowProps(e, i)} />)}
          </>
        )}
        {mine.length > 0 && rest.length > 0 && (
          <SectionDivider label="Full Leaderboard" />
        )}
        {mine.length === 0 && <BoardHeader />}
        {rest.map((e, i) => <BoardRow key={e.name} {...rowProps(e, i)} />)}
      </div>
    );
  }

  // No saved team — plain sorted board
  return (
    <div className="board">
      <BoardHeader />
      {sorted.map((e, i) => <BoardRow key={e.name} {...rowProps(e, i)} />)}
    </div>
  );
}
