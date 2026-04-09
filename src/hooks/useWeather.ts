/* ──────────────────────────────────────────────
   useWeather — Weather Data Hook
   Fetches from backend /weather/preview
   ────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import type { WeatherFeatures } from '@/types';
import { apiGet } from '@/utils/api';

interface WeatherState {
  data: WeatherFeatures | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiGet<WeatherFeatures>(
        `/weather/preview?lat=${lat}&lon=${lon}`,
      );
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'ไม่สามารถดึงข้อมูลอากาศได้';
      setState({ data: null, loading: false, error: msg });
      return null;
    }
  }, []);

  return { ...state, fetchWeather };
}
