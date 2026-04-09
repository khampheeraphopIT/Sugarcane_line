/* ──────────────────────────────────────────────
   ForecastChart — 7-day risk bar chart (Recharts)
   ────────────────────────────────────────────── */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getRiskMeta } from '@/utils/riskLevel';

interface ForecastChartProps {
  riskScore: number;
  forecastRainyDays: number;
}

export default function ForecastChart({
  riskScore,
  forecastRainyDays,
}: ForecastChartProps) {
  // Simulate 7-day forecast variation based on actual weather data
  const days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const data = days.map((name, i) => {
    const isRainy = i < forecastRainyDays;
    const variation = (Math.sin(i * 1.2) * 10) + (isRainy ? 15 : -5);
    const score = Math.max(0, Math.min(100, riskScore + variation));
    return { name, score: Math.round(score) };
  });

  return (
    <div className="card" style={{ padding: 'var(--space-md)' }}>
      <p
        className="section-title"
        style={{ marginBottom: 'var(--space-sm)', paddingLeft: 'var(--space-sm)' }}
      >
        ความเสี่ยง 7 วันข้างหน้า
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis hide domain={[0, 100]} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={getRiskMeta(entry.score).color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
