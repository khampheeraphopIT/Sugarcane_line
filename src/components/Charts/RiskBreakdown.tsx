/* ──────────────────────────────────────────────
   RiskBreakdown — Weather risk factor bars
   ────────────────────────────────────────────── */

import type { WeatherFeatures } from '@/types';
import './RiskBreakdown.css';

interface RiskBreakdownProps {
  weather: WeatherFeatures;
}

interface Factor {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: string;
}

export default function RiskBreakdown({ weather }: RiskBreakdownProps) {
  const factors: Factor[] = [
    {
      label: 'ความชื้นสูง',
      value: weather.high_humidity_hours,
      max: 336,
      unit: 'ชม.',
      color: '#3b82f6',
      icon: '💧',
    },
    {
      label: 'ฝนต่อเนื่อง',
      value: weather.max_consecutive_rain_days,
      max: 14,
      unit: 'วัน',
      color: '#06b6d4',
      icon: '🌧️',
    },
    {
      label: 'อุณหภูมิเชื้อโรค',
      value: weather.optimal_pathogen_hours,
      max: 336,
      unit: 'ชม.',
      color: '#f97316',
      icon: '🌡️',
    },
    {
      label: 'VPD (ยิ่งต่ำยิ่งเสี่ยง)',
      value: Math.max(0, 3 - weather.avg_vpd),
      max: 3,
      unit: '',
      color: '#a78bfa',
      icon: '🍃',
    },
  ];

  return (
    <div className="card">
      <p className="section-title">ปัจจัยเสี่ยงจากสภาพอากาศ</p>
      <div className="breakdown-list">
        {factors.map((f) => {
          const pct = Math.min((f.value / f.max) * 100, 100);
          return (
            <div key={f.label} className="breakdown-item">
              <div className="breakdown-header">
                <span>
                  {f.icon} {f.label}
                </span>
                <span className="breakdown-value">
                  {f.unit
                    ? `${Math.round(f.value)} ${f.unit}`
                    : f.value.toFixed(1)}
                </span>
              </div>
              <div className="breakdown-bar-bg">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${pct}%`, background: f.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
