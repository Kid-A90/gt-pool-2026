import GolferCell from './GolferCell.jsx';
import { fmt } from '../utils/scoring.js';

export default function BoardRow({ entry: e, leaderTotal, sortMode, savedTeam, golferFilter }) {
  const gfQ = golferFilter.toLowerCase();
  const isSaved = savedTeam && e.name.toLowerCase() === savedTeam.toLowerCase();

  // Position label
  const rkStr = e.voided ? 'VOID' : (sortMode === 'alpha' ? '—' : (e.rank != null ? String(e.rank) : '—'));
  const posCls = `bc-pos${e.rank === 1 ? ' p1' : e.rank === 2 ? ' p2' : e.rank === 3 ? ' p3' : ''}`;

  // Row class
  const rowCls = [
    'brow fu',
    e.voided ? 'voided' : '',
    !e.voided && isSaved ? 'myt' : '',
  ].filter(Boolean).join(' ');

  // Total
  const totStr = e.voided ? 'VOID' : (e.has ? fmt(e.tot) : '—');
  const totCls = `tot-n ${e.voided ? 'tp' : (e.has ? (e.tot < 0 ? 'tu' : e.tot > 0 ? 'to' : 'te') : 'tp')}`;

  // Gap
  const gap = (!e.voided && e.has) ? (e.tot - leaderTotal) : null;
  const gapStr = gap === null ? '—' : gap === 0 ? 'LEADER' : (gap > 0 ? `+${gap}` : String(gap));
  const gapCls = `bc bc-gap${gap === 0 ? ' lead' : ''}`;

  // Per-slot helpers
  function slotCls(slot) {
    const isMC = e.mcFlags?.[slot];
    const hlMatch = gfQ && e[slot].toLowerCase().includes(gfQ);
    return `bc bc-g${isMC ? ' mc-hit' : ''}${hlMatch ? ' hl' : ''}`;
  }

  function slotHighlighted(slot) {
    return gfQ ? e[slot].toLowerCase().includes(gfQ) : false;
  }

  return (
    <div className={rowCls}>
      {/* Position */}
      <div
        className={`bc ${posCls}`}
        style={e.voided ? { color: '#ccc', fontSize: 11, letterSpacing: 1 } : undefined}
      >
        {rkStr}
      </div>

      {/* Name */}
      <div className="bc bc-nm">
        <span className="nm-txt">{e.name}</span>
        {!e.voided && isSaved && <span className="you-tag">You</span>}
        {e.voided && <span className="void-tag">MC Void</span>}
      </div>

      {/* A B C D golfer cells */}
      {['a', 'b', 'c', 'd'].map(slot => (
        <div key={slot} className={slotCls(slot)}>
          <GolferCell
            name={e[slot]}
            data={e[`${slot}g`]}
            score={e[`${slot}s`]}
            isMC={e.mcFlags?.[slot]}
            isHighlighted={slotHighlighted(slot)}
          />
        </div>
      ))}

      {/* Today (placeholder — ESPN doesn't give round-by-round in leaderboard endpoint) */}
      <div className="bc bc-td" style={{ fontSize: 13, fontWeight: 400, color: '#bbb', justifyContent: 'center' }}>
        —
      </div>

      {/* Gap */}
      <div className={gapCls}>{gapStr}</div>

      {/* Total */}
      <div className="bc bc-tot">
        <span
          className={totCls}
          style={e.voided ? { fontSize: 13, letterSpacing: 1 } : undefined}
        >
          {totStr}
        </span>
        {!e.voided && e.has && <span className="tot-lbl">Total</span>}
      </div>
    </div>
  );
}
