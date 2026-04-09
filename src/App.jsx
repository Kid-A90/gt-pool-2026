import { useState, useMemo } from 'react';
import './styles/globals.css';

import { useScores } from './hooks/useScores.js';
import { useSavedTeam } from './hooks/useSavedTeam.js';
import { buildScored, assignRanks, getG } from './utils/scoring.js';

import Header from './components/Header.jsx';
import UploadZone from './components/UploadZone.jsx';
import Controls from './components/Controls.jsx';
import GolferFilterBar from './components/GolferFilterBar.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import ScorerGrid from './components/ScorerGrid.jsx';
import SaveTeamModal from './components/SaveTeamModal.jsx';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [nmap, setNmap] = useState({});
  const [teamSearch, setTeamSearch] = useState('');
  const [golferFilter, setGolferFilter] = useState('');
  const [sortMode, setSortMode] = useState('score');
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'ok'|'err'|'warn', msg }

  const { scores, loading, error, lastUpdated, refresh } = useScores();
  const { savedTeam, saveTeam, clearTeam } = useSavedTeam();

  const hasEntries = entries.length > 0;
  const isLive = hasEntries && Object.keys(scores).length > 0 && !error;

  // Show a status bar message when scores update
  useMemo(() => {
    if (!hasEntries) return;
    if (loading) { setStatus({ type: 'ok', msg: 'Fetching live scores…' }); return; }
    if (error) { setStatus({ type: 'warn', msg: '⚠ Refresh failed — showing last known scores.' }); return; }
    if (Object.keys(scores).length === 0) {
      setStatus({ type: 'warn', msg: '⚠ Live scores unavailable — showing entries without scores. Scores appear when tournament is live.' });
      return;
    }
    setStatus({ type: 'ok', msg: `Live scores updated — ${Object.keys(scores).length} players. Auto-refreshes every 5 min.` });
  }, [scores, loading, error, hasEntries]);

  // Build and rank scored entries
  const scoredEntries = useMemo(() => {
    if (!hasEntries) return [];
    const arr = buildScored(entries, scores, nmap);
    assignRanks(arr);
    return arr;
  }, [entries, scores, nmap, hasEntries]);

  // Visible count for controls display
  const gfQ = golferFilter.toLowerCase();
  const tQ = teamSearch.trim().toLowerCase();
  const visibleCount = useMemo(() => {
    let v = scoredEntries;
    if (tQ) v = v.filter(e => e.name.toLowerCase().includes(tQ));
    if (gfQ) v = v.filter(e => ['a', 'b', 'c', 'd'].some(s => e[s].toLowerCase().includes(gfQ)));
    return v.length;
  }, [scoredEntries, tQ, gfQ]);

  function handleLoad(newEntries, newNmap) {
    setEntries(newEntries);
    setNmap(newNmap);
    setStatus({ type: 'ok', msg: `Loaded ${newEntries.length} entries. Fetching live scores…` });
    refresh();
  }

  function handleGolferClick(name) {
    if (golferFilter.toLowerCase() === name.toLowerCase()) {
      setGolferFilter('');
    } else {
      setGolferFilter(name);
    }
  }

  function handleSaveTeam(name) {
    saveTeam(name);
    setModalOpen(false);
  }

  function handleClearTeam() {
    clearTeam();
    setModalOpen(false);
  }

  // getG wrapper bound to current scores + nmap
  function resolveGolfer(name) {
    return getG(name, scores, nmap);
  }

  return (
    <>
      <Header
        lastUpdated={lastUpdated}
        isLive={isLive}
        onRefresh={refresh}
      />

      <main className="main">
        <UploadZone onLoad={handleLoad} visible={!hasEntries} />

        {status && (
          <div className={`st${status.type === 'err' ? ' err' : status.type === 'warn' ? ' warn' : ''}`}>
            {status.msg}
          </div>
        )}

        {hasEntries && (
          <>
            <Controls
              teamSearch={teamSearch}
              golferFilter={golferFilter}
              sortMode={sortMode}
              savedTeam={savedTeam}
              entryCount={visibleCount}
              totalCount={scoredEntries.length}
              onTeamSearch={setTeamSearch}
              onGolferFilter={setGolferFilter}
              onSortChange={setSortMode}
              onOpenSaveModal={() => setModalOpen(true)}
            />

            <GolferFilterBar
              golferName={golferFilter}
              onClear={() => setGolferFilter('')}
            />

            <Leaderboard
              scoredEntries={scoredEntries}
              savedTeam={savedTeam}
              teamSearch={teamSearch}
              golferFilter={golferFilter}
              sortMode={sortMode}
              onClearSearch={() => setTeamSearch('')}
            />

            <ScorerGrid
              entries={entries}
              getG={resolveGolfer}
              golferFilter={golferFilter}
              onGolferClick={handleGolferClick}
            />
          </>
        )}
      </main>

      <footer className="foot">
        GT II Pool 2026 &nbsp;·&nbsp; Masters Tournament · Augusta National Golf Club &nbsp;·&nbsp; Live Scores via ESPN &nbsp;·&nbsp; Auto-refreshes every 5 minutes
      </footer>

      <SaveTeamModal
        entries={entries}
        savedTeam={savedTeam}
        onSave={handleSaveTeam}
        onClear={handleClearTeam}
        onClose={() => setModalOpen(false)}
        visible={modalOpen}
      />
    </>
  );
}
