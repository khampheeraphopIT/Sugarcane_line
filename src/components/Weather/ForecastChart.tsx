/* ──────────────────────────────────────────────
   ForecastChart — 7-day risk bar chart (ApexCharts)
   ────────────────────────────────────────────── */

import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { getRiskMeta } from '@/utils/riskLevel';

interface ForecastChartProps {
  riskScore: number;
  forecastRainyDays: number;
}

export default function ForecastChart({
  riskScore,
  forecastRainyDays,
}: ForecastChartProps) {
  // Simulate 7-day forecast variation
  const days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const chartData = days.map((name, i) => {
    const isRainy = i < forecastRainyDays;
    const variation = (Math.sin(i * 1.2) * 10) + (isRainy ? 15 : -5);
    const score = Math.max(0, Math.min(100, riskScore + variation));
    return { name, score: Math.round(score) };
  });

  const series = [{
    name: 'ระดับความเสี่ยง',
    data: chartData.map(d => d.score)
  }];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: chartData.map(d => getRiskMeta(d.score).color),
    xaxis: {
      categories: days,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      show: false,
      max: 100
    },
    grid: {
      show: false
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val}%`
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--space-md)' }}>
      <p
        className="section-title"
        style={{ marginBottom: 'var(--space-sm)', paddingLeft: 'var(--space-sm)' }}
      >
        ความเสี่ยง 7 วันข้างหน้า
      </p>
      <div style={{ minHeight: '120px' }}>
        <Chart options={options} series={series} type="bar" height={130} />
      </div>
    </div>
  );
}
