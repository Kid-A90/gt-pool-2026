import { useState, useMemo } from 'react';
import BoardRow from './BoardRow.jsx';
import { sortEntries } from '../utils/scoring.js';

const PAGE = 100;

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
        <button className="close-btn" onClick={onClearSearch} style={{ fontSize: 10, padding: '4px 10px' }}>
          ✕ Show All
        </button>
      )}
    </div>
  );
}

function ShowMoreBtn({ shown, total, onMore }) {
  const remaining = total - shown;
  if (remaining <= 0) return null;
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <button
        className="chip"
        style={{ fontSize: 13, padding: '8px 24px' }}
        onClick={onMore}
      >
        Show {Math.min(remaining, PAGE)} more ({remaining} remaining)
      </button>
    </div>
  );
}

function RowList({ rows, leaderTotal, sortMode, savedTeam, golferFilter, initialLimit }) {
  const [limit, setLimit] = useState(initialLimit ?? PAGE);
  const visible = rows.slice(0, limit);
  const rowProps = e => ({ entry: e, leaderTotal, sortMode, savedTeam, golferFilter });
  return (
    <>
      {visible.map(e => <BoardRow key={e.name + e.a + e.b + e.c + e.d} {...rowProps(e)} />)}
      <ShowMoreBtn shown={limit} total={rows.length} onMore={() => setLimit(l => l + PAGE)} />
    </>
  );
}

export default function Leaderboard({ scoredEntries, savedTeam, teamSearch, golferFilter, sortMode, onClearSearch }) {
  if (!scoredEntries.length) return null;

  const gfQ = golferFilter.toLowerCase();
  const tQ = teamSearch.trim().toLowerCase();
  const isTeamSearch = tQ.length > 0;

  const leaderTotal = useMemo(() => {
    const min = scoredEntries
      .filter(e => e.has && !e.voided)
      .reduce((m, e) => (e.tot < m ? e.tot : m), Infinity);
    return isFinite(min) ? min : 0;
  }, [scoredEntries]);

  // Apply filters
  let visible = scoredEntries;
  if (tQ) visible = visible.filter(e => e.name.toLowerCase().includes(tQ));
  if (gfQ) visible = visible.filter(e => ['a', 'b', 'c', 'd'].some(s => e[s].toLowerCase().includes(gfQ)));

  const sharedProps = { leaderTotal, sortMode, savedTeam, golferFilter };

  // ── Team search mode ──────────────────────────────────────────────
  if (isTeamSearch) {
    const matched = sortEntries(visible, sortMode);
    const leaders = sortEntries(
      scoredEntries.filter(e => e.has && !e.voided), 'score'
    ).slice(0, 10);

    if (!matched.length) return <div className="empty"><p>No matching entries found.</p></div>;

    return (
      <div className="board">
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
        <RowList rows={matched} {...sharedProps} initialLimit={matched.length} />
        <SectionDivider label="Tournament Leaders — See How Far Back You Are" />
        <RowList rows={leaders} {...sharedProps} initialLimit={10} />
      </div>
    );
  }

  // ── Default mode ──────────────────────────────────────────────────
  const sorted = sortEntries(visible, sortMode);
  if (!sorted.length) return <div className="empty"><p>No matching entries found.</p></div>;

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
            <RowList rows={mine} {...sharedProps} initialLimit={mine.length} />
          </>
        )}
        {mine.length > 0 && rest.length > 0 && <SectionDivider label="Full Leaderboard" />}
        {mine.length === 0 && <BoardHeader />}
        <RowList rows={rest} {...sharedProps} />
      </div>
    );
  }

  return (
    <div className="board">
      <BoardHeader />
      <RowList rows={sorted} {...sharedProps} />
    </div>
  );
}
