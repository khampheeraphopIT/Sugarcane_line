/* ──────────────────────────────────────────────
   useAnalyze — Backend /analyze Hook
   ────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import type { AnalysisResponse, AnalysisRequest } from '@/types';
import { apiPostForm } from '@/utils/api';

interface AnalyzeState {
  result: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({
    result: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(async (req: AnalysisRequest) => {
    setState({ result: null, loading: true, error: null });

    const formData = new FormData();
    formData.append('image', req.image);
    formData.append('latitude', String(req.latitude));
    formData.append('longitude', String(req.longitude));
    formData.append('variety', req.variety);
    formData.append('age_months', String(req.ageMonths));
    formData.append('soil_type', req.soilType);

    try {
      const result = await apiPostForm<AnalysisResponse>('/analyze', formData);
      setState({ result, loading: false, error: null });
      return result;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'ไม่สามารถวิเคราะห์ได้';
      setState({ result: null, loading: false, error: msg });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, analyze, reset };
}
