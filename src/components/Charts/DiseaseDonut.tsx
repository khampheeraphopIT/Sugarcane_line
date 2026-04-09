/* ──────────────────────────────────────────────
   DiseaseDonut — Disease probability donut chart (ApexCharts)
   ────────────────────────────────────────────── */

import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface DiseaseDonutProps {
  probabilities: Record<string, number>;
}

const COLORS = ['#22c55e', '#ef4444', '#8b5cf6', '#f97316', '#eab308', '#f43f5e'];

export default function DiseaseDonut({ probabilities }: DiseaseDonutProps) {
  const DISEASE_LABELS: Record<string, string> = {
    Healthy: 'ปกติ',
    Red_Rot: 'เน่าแดง',
    Mosaic: 'ใบด่าง',
    Rust: 'ราสนิม',
    Yellow_Leaf: 'ใบเหลือง',
    Blight: 'ใบไหม้',
    Unknown: 'ไม่ระบุ',
  };

  const sortedEntries = Object.entries(probabilities)
    .map(([name, value]) => ({
      name: DISEASE_LABELS[name] ?? name,
      value: Number(value.toFixed(1)),
    }))
    .filter((d) => d.value > 0.5)
    .sort((a, b) => b.value - a.value);

  const series = sortedEntries.map((d) => d.value);
  const labels = sortedEntries.map((d) => d.name);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        speed: 800,
      },
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      }
    },
    colors: COLORS,
    labels: labels,
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'ความน่าจะเป็น',
              fontSize: '12px',
              color: '#94a3b8',
              formatter: () => `${series[0] || 0}%`,
            },
            value: {
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        size: 6,
      },
      labels: {
        colors: '#94a3b8',
      },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <div className="card">
      <p className="section-title">ความน่าจะเป็นของแต่ละโรค</p>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
    </div>
  );
}
