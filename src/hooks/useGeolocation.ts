/* ──────────────────────────────────────────────
   useGeolocation — GPS Hook
   ────────────────────────────────────────────── */

import { useState, useCallback } from 'react';

interface GeoState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
}

// Default: Khon Kaen, Thailand (sugarcane belt)
const DEFAULT_LAT = 16.4322;
const DEFAULT_LON = 102.8236;

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LON,
    loading: false,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'เบราว์เซอร์ไม่รองรับ GPS' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: `ไม่สามารถดึงตำแหน่งได้: ${err.message}`,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return { ...state, requestLocation };
}
