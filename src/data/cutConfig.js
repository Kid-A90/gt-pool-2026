// ── CUT CONFIGURATION ─────────────────────────────────────────────────────────
// Update this file at the cut of each major tournament.
//
// HOW TO UPDATE FOR A NEW MAJOR:
//   1. Replace TOURNAMENT with the event name/year
//   2. Set CUT_LINE to the score that *makes* the cut
//      (e.g. 3 means +3 survives, +4 is out)
//   3. Clear MISSED_CUT and repopulate from the cut sheet Excel:
//        node scripts/buildCutList.js <path-to-xlsx> <cut-score>
//      Or populate manually using the golfer shorthands from entries.json
// ─────────────────────────────────────────────────────────────────────────────

export const TOURNAMENT = '2026 PGA Championship – Quail Hollow';
export const CUT_LINE   = 3; // +3 makes the cut; +4 and above are eliminated

// Golfer shorthands exactly as they appear in entries.json / the pool sheet.
// Any team whose A/B/C/D slot matches one of these names is voided (MC).
export const MISSED_CUT = new Set([
  // Group A
  'DeChambeau',

  // Group B
  'Scott', 'Spaun', 'MacIntyre', 'Henley', 'Lowry',
  'Fleetwood', 'Hatton', 'Hovland',

  // Group C
  'Bhatia', 'Noren', 'Berger', 'Woodland', 'Hall', 'Bridgeman',
  'Knapp', 'Bradley', 'Penge', 'Thorbjornsen', 'Hojgaard',
  'Straka', 'Im', 'Detry', 'Clark',

  // Group D
  'Schenk', 'Ayora', 'Smotherman', 'Horschel', 'Campbell',
  'Bezuidenhout', 'Riley', 'Grillo', 'Higgo', 'Holt', 'Dufner',
  'Schaper', 'Highsmith', 'Keefer', 'Parry', 'Vegas', 'J Smith',
  'Poston', 'Glover', 'McCarty', 'Homa', 'McGreevy', 'Block',
  'Brennan', 'Echavarria', 'Rodgers', 'Coody', 'Castillo', 'Fisk',
  'Cink', 'Pendrith', 'McKibbin', 'Smyth',
]);
