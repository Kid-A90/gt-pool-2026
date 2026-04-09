import { fmt } from '../utils/scoring.js';

export default function GolferCell({ name, data, score, isMC, isHighlighted }) {
  const haScore = data && score !== null;
  const mc = data?.mc || isMC;

  const str = mc ? 'MC' : (haScore ? fmt(score) : (data ? (data.str || 'E') : '—'));

  let badgeCls = 'gs ';
  if (mc) badgeCls += 'gmc';
  else if (!haScore) badgeCls += 'gw';
  else if (score < 0) badgeCls += 'gu';
  else if (score > 0) badgeCls += 'go';
  else badgeCls += 'ge';

  const nameCls = `gnm${isHighlighted ? ' hl-nm' : ''}`;

  return (
    <>
      <span className={nameCls}>{name}</span>
      <span className={badgeCls}>{str}</span>
    </>
  );
}
