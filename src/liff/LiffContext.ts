import { createContext, useContext } from 'react';
import type { LineUser } from '@/types';

export interface LiffContextValue {
  user: LineUser | null;
  isReady: boolean;
  isLoggedIn: boolean;
  isMock: boolean;
}

export const LiffContext = createContext<LiffContextValue>({
  user: null,
  isReady: false,
  isLoggedIn: false,
  isMock: false,
});

export function useLiff() {
  return useContext(LiffContext);
}
