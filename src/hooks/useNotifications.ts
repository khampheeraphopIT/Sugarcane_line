/* ──────────────────────────────────────────────
   useNotifications — Real-time alerts hook
   Uses NotificationEngine with 3h cooldown.
   ────────────────────────────────────────────── */

import { useState, useCallback, useEffect } from 'react';
import type { AppNotification, WeatherFeatures, ScanRecord } from '@/types';
import {
  shouldRecompute,
  computeNotifications,
  getCachedNotifications,
  markAsRead as markAsReadEngine,
  getUnreadCount,
} from '@/services/notificationEngine';

export function useNotifications(
  weather: WeatherFeatures | null,
  scanHistory: ScanRecord[],
) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getCachedNotifications(),
  );
  const [unreadCount, setUnreadCount] = useState(() => getUnreadCount());

  // Recompute when weather data arrives & cooldown has elapsed
  useEffect(() => {
    if (!weather) return;
    if (!shouldRecompute()) return;

    // Use microtask to avoid synchronous setState inside effect warning
    Promise.resolve().then(() => {
      const computed = computeNotifications(weather, scanHistory);
      setNotifications(computed);
      setUnreadCount(computed.filter((n) => !n.read).length);
    });
  }, [weather, scanHistory]);

  const markAsRead = useCallback((id: string) => {
    markAsReadEngine(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  return { notifications, unreadCount, markAsRead };
}
