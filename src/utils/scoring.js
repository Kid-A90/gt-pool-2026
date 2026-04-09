import { NAMES } from './nameMap.js';

// Parse a score string ("E", "+3", "-2", "0") → integer
export function parseSc(v) {
  const s = String(v ?? '').trim();
  if (!s || s === 'E') return 0;
  const n = parseInt(s.replace('+', ''), 10);
  return isNaN(n) ? 0 : n;
}

// Format an integer score → display string ("E", "+3", "-2")
export function fmt(n) {
  return n === 0 ? 'E' : n > 0 ? `+${n}` : String(n);
}

// Resolve a sheet name to a scores entry using NAMES dict + fallback last-name match
// scores: { [espnDisplayName]: { score, str, pos, thru, mc } }
// nmap: optional extra mappings from the NameMapping sheet
export function getG(sh, scores, nmap = {}) {
  if (scores[sh]) return scores[sh];
  const m = nmap[sh];
  if (m && scores[m]) return scores[m];
  const k = NAMES[sh] || NAMES[sh?.trim()];
  if (k && scores[k]) return scores[k];
  const last = sh?.split(' ').pop()?.toLowerCase();
  if (last) {
    const kk = Object.keys(scores).find(k => k.toLowerCase().endsWith(' ' + last));
    if (kk) return scores[kk];
  }
  return null;
}

// Build scored entry objects from raw entries + live scores map
// entries: [{ name, a, b, c, d }]
// scores:  { [espnDisplayName]: { score, str, pos, thru, mc } }
export function buildScored(entries, scores, nmap = {}) {
  return entries.map(e => {
    const ag = getG(e.a, scores, nmap);
    const bg = getG(e.b, scores, nmap);
    const cg = getG(e.c, scores, nmap);
    const dg = getG(e.d, scores, nmap);

    const as = ag?.mc ? 0 : (ag?.score ?? null);
    const bs = bg?.mc ? 0 : (bg?.score ?? null);
    const cs = cg?.mc ? 0 : (cg?.score ?? null);
    const ds = dg?.mc ? 0 : (dg?.score ?? null);

    const has = [as, bs, cs, ds].some(s => s !== null);
    const tot = [as, bs, cs, ds].reduce((s, v) => s + (v ?? 0), 0);

    const anyMC = has && [
      { d: ag, s: as }, { d: bg, s: bs }, { d: cg, s: cs }, { d: dg, s: ds }
    ].some(x => x.d?.mc === true);

    const mcFlags = { a: ag?.mc || false, b: bg?.mc || false, c: cg?.mc || false, d: dg?.mc || false };

    return { ...e, as, bs, cs, ds, tot, has, ag, bg, cg, dg, voided: anyMC, mcFlags };
  });
}

// Assign .rank to each entry (null for voided / no scores)
export function assignRanks(arr) {
  const sorted = [...arr].filter(e => e.has && !e.voided).sort((a, b) => a.tot - b.tot);
  let rk = 1;
  // Mutate entry objects directly — avoids name-collision bug with duplicate team names
  sorted.forEach((e, i) => {
    e.rank = (i > 0 && e.tot === sorted[i - 1].tot) ? sorted[i - 1].rank : rk;
    rk = i + 2;
  });
  arr.forEach(e => { if (e.voided || !e.has) e.rank = null; });
}

// Sort entries by score (voided always last) or alphabetically
export function sortEntries(arr, sortMode = 'score') {
  if (sortMode === 'alpha') {
    const live = [...arr].filter(e => !e.voided).sort((a, b) => a.name.localeCompare(b.name));
    const dead = [...arr].filter(e => e.voided).sort((a, b) => a.name.localeCompare(b.name));
    return [...live, ...dead];
  }
  return [...arr].sort((a, b) => {
    if (a.voided && !b.voided) return 1;
    if (!a.voided && b.voided) return -1;
    if (!a.has && !b.has) return 0;
    if (!a.has) return 1;
    if (!b.has) return -1;
    return a.tot - b.tot;
  });
}
