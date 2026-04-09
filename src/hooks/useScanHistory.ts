/* ──────────────────────────────────────────────
   useScanHistory — localStorage Scan History
   Auto-cleans records older than 30 days.
   ────────────────────────────────────────────── */

import { useState, useCallback, useEffect } from 'react';
import type { ScanRecord } from '@/types';

const STORAGE_KEY = 'sugarcane_scan_history';
const MAX_AGE_DAYS = 30;

function loadHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records: ScanRecord[] = JSON.parse(raw);
    // Auto-cleanup: remove records older than 30 days
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    return records.filter((r) => r.timestamp >= cutoff);
  } catch {
    return [];
  }
}

function saveHistory(records: ScanRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function useScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>(() => loadHistory());

  // Sync cleaned history back to localStorage on mount
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addRecord = useCallback((record: ScanRecord) => {
    setHistory((prev) => {
      const updated = [record, ...prev].slice(0, 100); // cap at 100
      saveHistory(updated);
      return updated;
    });
  }, []);

  const getRecord = useCallback(
    (id: string) => history.find((r) => r.id === id) ?? null,
    [history],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addRecord, getRecord, clearHistory };
}
