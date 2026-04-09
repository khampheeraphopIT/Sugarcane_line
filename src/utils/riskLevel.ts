/* ──────────────────────────────────────────────
   Risk Level Utility — Single source of truth
   for risk → color / label / emoji mapping
   ────────────────────────────────────────────── */

import type { RiskLevel } from '@/types';

interface RiskMeta {
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
}

/**
 * Convert a numeric risk score (0-100) to a structured risk metadata object.
 */
export function getRiskMeta(score: number): RiskMeta {
  if (score >= 75)
    return {
      level: 'critical',
      label: 'สูงมาก',
      color: 'var(--risk-critical)',
      bgColor: 'var(--risk-critical-bg)',
      emoji: '🔴',
    };
  if (score >= 55)
    return {
      level: 'high',
      label: 'สูง',
      color: 'var(--risk-high)',
      bgColor: 'var(--risk-high-bg)',
      emoji: '🟠',
    };
  if (score >= 35)
    return {
      level: 'medium',
      label: 'ปานกลาง',
      color: 'var(--risk-medium)',
      bgColor: 'var(--risk-medium-bg)',
      emoji: '🟡',
    };
  if (score >= 15)
    return {
      level: 'low',
      label: 'ต่ำ',
      color: 'var(--risk-low)',
      bgColor: 'var(--risk-low-bg)',
      emoji: '🟢',
    };
  return {
    level: 'safe',
    label: 'ปลอดภัย',
    color: 'var(--risk-safe)',
    bgColor: 'var(--risk-safe-bg)',
    emoji: '✅',
  };
}

/**
 * Convert a Thai risk label string from the backend to a RiskMeta.
 */
export function getRiskMetaFromLabel(label: string): RiskMeta {
  if (label.includes('สูงมาก')) return getRiskMeta(80);
  if (label.includes('สูง')) return getRiskMeta(60);
  if (label.includes('ปานกลาง')) return getRiskMeta(40);
  if (label.includes('ต่ำ')) return getRiskMeta(20);
  return getRiskMeta(0);
}
