/* ──────────────────────────────────────────────
   DiseaseDonut — Disease probability donut chart
   ────────────────────────────────────────────── */

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#8b5cf6', '#f97316', '#eab308', '#f43f5e'];

interface DiseaseDonutProps {
  probabilities: Record<string, number>;
}

export default function DiseaseDonut({ probabilities }: DiseaseDonutProps) {
  const DISEASE_LABELS: Record<string, string> = {
    Healthy: 'ปกติ',
    Red_Rot: 'เน่าแดง',
    Mosaic: 'ใบด่าง',
    Rust: 'ราสนิม',
    Yellow_Leaf: 'ใบเหลือง',
    Blight: 'ใบไหม้',
  };

  const data = Object.entries(probabilities)
    .map(([name, value]) => ({
      name: DISEASE_LABELS[name] ?? name,
      value: Number(value.toFixed(1)),
    }))
    .filter((d) => d.value > 0.5)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="card">
      <p className="section-title">ความน่าจะเป็นของแต่ละโรค</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {data.map((d, idx) => (
          <div
            key={d.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: COLORS[idx % COLORS.length],
                display: 'inline-block',
              }}
            />
            {d.name} {d.value}%
          </div>
        ))}
      </div>
    </div>
  );
}
