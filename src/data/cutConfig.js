// ── PGA CHAMPIONSHIP 2026 – MANUAL CUT OVERRIDE ───────────────────────────────
// This list is only active until TOURNAMENT_END. After that date it is
// automatically ignored and ESPN's mc flag is the sole source of truth.
//
// For the US Open (and every future major) you are starting a fresh project,
// so this file is irrelevant there. ESPN auto-detects missed cuts — no manual
// update needed in any future pool.
// ─────────────────────────────────────────────────────────────────────────────

export const TOURNAMENT_END = new Date('2026-05-19'); // list auto-expires after PGA ends

// Cut line: +4 makes it, +5 and above missed the cut (46 golfers)
export const MISSED_CUT = new Set([
  // Group A
  'DeChambeau',

  // Group B
  'Scott', 'Spaun', 'MacIntyre', 'Henley',
  'Fleetwood', 'Hatton', 'Hovland',

  // Group C
  'Bhatia', 'Woodland', 'Hall', 'Bridgeman', 'Knapp', 'Bradley',
  'Penge', 'Thorbjornsen', 'Straka', 'Im', 'Detry', 'Clark',

  // Group D
  'Schenk', 'Ayora', 'Smotherman', 'Horschel', 'Riley', 'Grillo',
  'Higgo', 'Holt', 'Dufner', 'Schaper', 'Highsmith', 'J Smith',
  'Poston', 'Glover', 'McCarty', 'Homa', 'McGreevy', 'Block',
  'Echavarria', 'Rodgers', 'Coody', 'Castillo', 'Fisk', 'Cink',
  'McKibbin', 'Smyth',
]);
