// applyVoidLogic mutates each entry in-place:
//   entry.voided = true  if any golfer on the team missed the cut
//   entry.mcFlags = { a, b, c, d }  — which slots specifically MC'd
//
// This is separated from buildScored so it can be called again
// if the MC logic needs to change independently of scoring.
export function applyVoidLogic(entries) {
  entries.forEach(entry => {
    const slots = ['a', 'b', 'c', 'd'];
    const mcFlags = {};

    slots.forEach(slot => {
      const gData = entry[`${slot}g`]; // ag, bg, cg, dg set by buildScored
      mcFlags[slot] = gData?.mc === true;
    });

    entry.mcFlags = mcFlags;
    // Only void when we actually have live scores (entry.has = true)
    entry.voided = entry.has && Object.values(mcFlags).some(Boolean);
  });
}
