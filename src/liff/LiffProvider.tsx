/* ──────────────────────────────────────────────
   LIFF Provider — Handles LINE LIFF init & mock
   ────────────────────────────────────────────── */

import {
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { MOCK_LINE_USER } from './mock';
import { LiffContext, type LiffContextValue } from './LiffContext';

const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiffContextValue>({
    user: null,
    isReady: false,
    isLoggedIn: false,
    isMock: IS_LOCALHOST,
  });

  useEffect(() => {
    if (IS_LOCALHOST) {
      // Mock mode for local development
      setState({
        user: MOCK_LINE_USER,
        isReady: true,
        isLoggedIn: true,
        isMock: true,
      });
      return;
    }

    // Real LIFF initialization
    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId) {
      console.warn('VITE_LIFF_ID is not set. Running in mock mode.');
      setState({
        user: MOCK_LINE_USER,
        isReady: true,
        isLoggedIn: true,
        isMock: true,
      });
      return;
    }

    import('@line/liff').then(({ default: liff }) => {
      liff
        .init({ liffId })
        .then(async () => {
          if (!liff.isLoggedIn()) {
            liff.login();
            return;
          }
          const profile = await liff.getProfile();
          setState({
            user: {
              userId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
            },
            isReady: true,
            isLoggedIn: true,
            isMock: false,
          });
        })
        .catch((err: Error) => {
          console.error('LIFF init failed:', err);
          setState((prev) => ({ ...prev, isReady: true }));
        });
    });
  }, []);

  return <LiffContext.Provider value={state}>{children}</LiffContext.Provider>;
}
