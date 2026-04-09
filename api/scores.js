// Vercel serverless function — proxies ESPN Masters leaderboard
// Returns: { [espnDisplayName]: { score, str, pos, thru, mc } }

const ESPN_URLS = [
  'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function parseSc(v) {
  const s = String(v ?? '').trim();
  if (!s || s === 'E') return 0;
  const n = parseInt(s.replace('+', ''), 10);
  return isNaN(n) ? 0 : n;
}

function fsc(v) {
  const s = String(v ?? '').trim();
  if (!s || s === 'E' || s === '0') return 'E';
  const n = parseInt(s.replace('+', ''), 10);
  if (isNaN(n)) return 'E';
  return n > 0 ? `+${n}` : String(n);
}

export default async function handler(req, res) {
  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS).end();
    return;
  }

  for (const url of ESPN_URLS) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MastersPool/1.0)' },
      });
      if (!r.ok) continue;

      const d = await r.json();
      const ev =
        (d.events || []).find(
          e =>
            (e.name || '').toLowerCase().includes('masters') ||
            (e.shortName || '').toLowerCase().includes('masters')
        ) || (d.events || [])[0];

      if (!ev) continue;

      const competitors = ev.competitions?.[0]?.competitors || [];

      // Build score → { count, minOrder } for tie detection and correct position
      const scoreGroups = {};
      competitors.forEach(c => {
        const sv = typeof c.score === 'string' ? c.score : (c.score?.value ?? c.score?.displayValue ?? '0');
        const n = parseSc(sv);
        const ord = c.order ?? 999;
        if (!scoreGroups[n]) scoreGroups[n] = { count: 0, minOrder: ord };
        scoreGroups[n].count++;
        if (ord < scoreGroups[n].minOrder) scoreGroups[n].minOrder = ord;
      });

      const scores = {};
      competitors.forEach(c => {
        const fn = c.athlete?.displayName || '';
        if (!fn) return;
        const sv = typeof c.score === 'string' ? c.score : (c.score?.value ?? c.score?.displayValue ?? '0');
        const n = parseSc(sv);

        const grp = scoreGroups[n];
        const pos = grp?.count > 1 ? `T${grp.minOrder}` : `${c.order ?? ''}`;

        const r1holes = c.linescores?.[0]?.linescores?.length ?? 0;
        const thru = r1holes === 18 ? 'F' : r1holes > 0 ? `Thru ${r1holes}` : '';

        const mc = !!(c.status?.eliminated || c.status?.displayValue?.toLowerCase().includes('cut'));

        scores[fn] = { score: n, str: fsc(sv), pos, thru, mc };
      });

      res.writeHead(200, { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(scores));
      return;
    } catch {
      continue;
    }
  }

  // All sources failed — return empty object so the client degrades gracefully
  res.writeHead(200, { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify({}));
}
