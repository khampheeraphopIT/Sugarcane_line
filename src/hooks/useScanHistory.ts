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
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    // Validate each record individually — skip corrupt entries
    return parsed.filter((r: ScanRecord) => {
      try {
        return r && r.id && r.timestamp >= cutoff && r.result;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function saveHistory(records: ScanRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // QuotaExceededError — strip imageDataUrl from oldest records and retry
    console.warn('localStorage quota exceeded, trimming image data...');
    const trimmed = records.map((r, i) => 
      i > 5 ? { ...r, imageDataUrl: undefined } : r
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Still too big — keep only last 10 records
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed.slice(0, 10)));
    }
  }
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
