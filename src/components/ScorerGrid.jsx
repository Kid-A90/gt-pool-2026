import { fmt } from '../utils/scoring.js';

export default function ScorerGrid({ entries, getG, golferFilter, onGolferClick }) {
  if (!entries.length) return null;

  const gfQ = golferFilter.toLowerCase();

  // Collect unique golfers per group
  const grps = { A: new Set(), B: new Set(), C: new Set(), D: new Set() };
  entries.forEach(e => {
    grps.A.add(e.a);
    grps.B.add(e.b);
    grps.C.add(e.c);
    grps.D.add(e.d);
  });

  return (
    <div className="scr-sec">
      <div className="scr-hdr">
        <h3>Golfer Scores by Group — Click to Filter</h3>
      </div>
      <div className="scr-grid">
        {Object.entries(grps).map(([grp, names]) => {
          const players = [...names]
            .map(n => {
              const d = getG(n);
              return { n, d, sc: d?.mc ? 0 : (d?.score ?? 999) };
            })
            .sort((a, b) => a.sc - b.sc);

          return (
            <div className="sg" key={grp}>
              <div className="sg-h">Group {grp}</div>
              {players.map(p => {
                const str = p.d?.mc ? 'MC' : (p.d && p.sc !== 999 ? fmt(p.sc) : '—');
                const color = p.d?.mc ? '#aaa' : p.sc < 0 ? '#cc0000' : p.sc > 0 ? '#1a1a1a' : '#666';
                const isActive = gfQ && p.n.toLowerCase().includes(gfQ);

                return (
                  <div
                    key={p.n}
                    className={`sg-r${isActive ? ' active-gf' : ''}`}
                    onClick={() => onGolferClick(p.n)}
                  >
                    <span className="sg-nm">{p.n}</span>
                    <div className="sg-rt">
                      <span className="sg-sc" style={{ color }}>{str}</span>
                      <span className="sg-ps">{p.d?.pos || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
