/* ──────────────────────────────────────────────
   RiskGauge — SVG circular risk indicator
   ────────────────────────────────────────────── */

import { getRiskMeta } from '@/utils/riskLevel';
import './RiskGauge.css';

interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function RiskGauge({ score, size = 160, label }: RiskGaugeProps) {
  const meta = getRiskMeta(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(score, 100) / 100) * circumference;
  const center = size / 2;

  return (
    <div className="risk-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={meta.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${center} ${center})`}
          className="gauge-arc"
          style={
            {
              '--gauge-offset': `${circumference}`,
              '--gauge-target': `${circumference - progress}`,
            } as React.CSSProperties
          }
        />
        {/* Glow effect */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={meta.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${center} ${center})`}
          opacity="0.3"
          filter="blur(6px)"
        />
      </svg>
      <div className="gauge-content">
        <span className="gauge-score" style={{ color: meta.color }}>
          {Math.round(score)}
        </span>
        <span className="gauge-label" style={{ color: meta.color }}>
          {label ?? meta.label}
        </span>
      </div>
    </div>
  );
}
