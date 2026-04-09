import { useState, useCallback } from 'react';

const KEY = 'gtpool_myteam';

export function useSavedTeam() {
  const [savedTeam, setSavedTeam] = useState(() => localStorage.getItem(KEY) || '');

  const saveTeam = useCallback((name) => {
    localStorage.setItem(KEY, name);
    setSavedTeam(name);
  }, []);

  const clearTeam = useCallback(() => {
    localStorage.removeItem(KEY);
    setSavedTeam('');
  }, []);

  return { savedTeam, saveTeam, clearTeam };
}
