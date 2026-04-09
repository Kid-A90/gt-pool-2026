export default function Controls({
  teamSearch, golferFilter, sortMode, savedTeam,
  entryCount, totalCount,
  onTeamSearch, onGolferFilter, onSortChange, onOpenSaveModal,
}) {
  const isTeamSearch = teamSearch.length > 0;

  const saveBtnClass = `chip save-chip${savedTeam ? ' saved' : ''}`;
  const saveBtnLabel = savedTeam
    ? `⭐ ${savedTeam.length > 20 ? savedTeam.slice(0, 18) + '…' : savedTeam} ▾`
    : '⭐ Save My Team';

  return (
    <div className="ctls">
      {/* Team search */}
      <div className="sbox">
        <svg width="15" height="15" fill="rgba(255,255,255,.5)" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.868-3.834zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
        </svg>
        <input
          className="sinput"
          type="text"
          placeholder="Search team name…"
          value={teamSearch}
          onChange={e => onTeamSearch(e.target.value)}
        />
      </div>

      {/* Golfer filter */}
      <div className="gbox">
        <svg width="15" height="15" fill="rgba(255,255,255,.5)" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 0zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3.5c.28 0 .5.22.5.5v4a.5.5 0 0 1-1 0V8c0-.28.22-.5.5-.5z"/>
        </svg>
        <input
          className="ginput"
          type="text"
          placeholder="Filter by golfer…"
          value={golferFilter}
          onChange={e => onGolferFilter(e.target.value)}
        />
      </div>

      <div className="divider" />

      {/* Sort */}
      <button
        className={`chip${sortMode === 'score' ? ' on' : ''}`}
        onClick={() => onSortChange('score')}
      >
        By Score
      </button>
      <button
        className={`chip${sortMode === 'alpha' ? ' on' : ''}`}
        onClick={() => onSortChange('alpha')}
      >
        A–Z
      </button>

      <div className="divider" />

      {/* Save team */}
      <button className={saveBtnClass} onClick={onOpenSaveModal}>
        {saveBtnLabel}
      </button>

      {/* Entry count */}
      <div className="ect">
        {isTeamSearch
          ? <><b>{entryCount}</b> matched</>
          : <>Showing <b>{entryCount}</b> of <b>{totalCount}</b></>
        }
      </div>
    </div>
  );
}
