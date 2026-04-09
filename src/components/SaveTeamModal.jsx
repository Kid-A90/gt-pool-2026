import { useState, useEffect, useRef } from 'react';

export default function SaveTeamModal({ entries, savedTeam, onSave, onClear, onClose, visible }) {
  const [inputVal, setInputVal] = useState('');
  const [matches, setMatches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setInputVal('');
      setMatches([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [visible]);

  function handleInput(val) {
    setInputVal(val);
    const q = val.trim().toLowerCase();
    if (!q || !entries.length) { setMatches([]); return; }
    setMatches(entries.filter(e => e.name.toLowerCase().includes(q)).slice(0, 7));
  }

  function pickTeam(name) {
    setInputVal(name);
    setMatches([]);
  }

  function handleSave() {
    const v = inputVal.trim();
    if (!v) return;
    onSave(v);
  }

  function handleBgClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!visible) return null;

  const hasSaved = Boolean(savedTeam);

  return (
    <div className="modal-bg show" onClick={handleBgClick}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>

        <h3>{hasSaved ? 'Change Your Team' : 'Save Your Team'}</h3>

        {hasSaved && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            background: '#f0faf4', border: '1.5px solid #c8e6d4', borderRadius: 6,
            padding: '12px 14px', marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#006747', marginBottom: 3 }}>
                Currently Saved
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>
                {savedTeam}
              </div>
            </div>
            <button className="mbtn mbtn-delete" onClick={onClear} style={{ flex: 0, whiteSpace: 'nowrap', padding: '8px 14px' }}>
              🗑 Remove
            </button>
          </div>
        )}

        <p dangerouslySetInnerHTML={{
          __html: hasSaved
            ? 'Start typing to find a different team, or remove your current saved team. Saved in <b>this browser only</b> — each person sets their own on their own device.'
            : 'Start typing to find your team name from the list. Saved in <b>this browser only</b> — each person sets their own on their own device.'
        }} />

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => handleInput(e.target.value)}
          placeholder={hasSaved ? 'Search to change team…' : 'e.g. Chris Tibbs For Birdie'}
        />

        {matches.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {matches.map(e => (
              <div
                key={e.name}
                onClick={() => pickTeam(e.name)}
                style={{
                  padding: '9px 12px', background: '#f5f3ee', borderRadius: 4, cursor: 'pointer',
                  fontFamily: "'Oswald',sans-serif", fontSize: 14, color: '#1a1a1a',
                  marginBottom: 4, border: '1px solid #e0ddd6', transition: 'background .12s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#eeecd6'}
                onMouseOut={e => e.currentTarget.style.background = '#f5f3ee'}
              >
                {e.name}
              </div>
            ))}
          </div>
        )}

        {matches.length === 0 && inputVal.trim() && (
          <div style={{ marginBottom: 14, padding: '8px 12px', fontFamily: "'Oswald',sans-serif", fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>
            No matching teams found
          </div>
        )}

        <div className="modal-btns">
          <button className="mbtn mbtn-cancel" onClick={onClose}>Cancel</button>
          <button className="mbtn mbtn-save" onClick={handleSave}>Save Team</button>
        </div>
      </div>
    </div>
  );
}
