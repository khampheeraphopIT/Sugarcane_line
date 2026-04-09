/* ──────────────────────────────────────────────
   WeatherPage — Detailed weather dashboard
   ────────────────────────────────────────────── */

import { useEffect } from 'react';
import RiskGauge from '@/components/Weather/RiskGauge';
import WeatherCard from '@/components/Weather/WeatherCard';
import ForecastChart from '@/components/Weather/ForecastChart';
import RiskBreakdown from '@/components/Charts/RiskBreakdown';
import type { WeatherFeatures } from '@/types';

interface WeatherPageProps {
  weather: WeatherFeatures | null;
  weatherLoading: boolean;
  onFetchWeather: (lat: number, lon: number) => void;
}

export default function WeatherPage({
  weather,
  weatherLoading,
  onFetchWeather,
}: WeatherPageProps) {
  useEffect(() => {
    if (!weather && !weatherLoading) {
      onFetchWeather(16.4322, 102.8236);
    }
  }, [weather, weatherLoading, onFetchWeather]);

  if (weatherLoading || !weather) {
    return (
      <div className="page fade-in">
        <h2 className="page-title" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>🌤️ สภาพอากาศ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          <div className="skeleton" style={{ height: 160, width: 160, borderRadius: '50%', margin: '0 auto' }} />
          <div className="skeleton" style={{ height: 120 }} />
          <div className="skeleton" style={{ height: 160 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🌤️ สภาพอากาศแปลงอ้อย</h2>

      {/* Risk gauge */}
      <div style={{ textAlign: 'center' }}>
        <RiskGauge score={weather.weather_risk_index} size={180} label="ดัชนีเสี่ยงรวม" />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
          {weather.weather_summary}
        </p>
      </div>

      {/* Current stats */}
      <WeatherCard weather={weather} />

      {/* Risk breakdown */}
      <RiskBreakdown weather={weather} />

      {/* 7-day forecast */}
      <ForecastChart
        riskScore={weather.weather_risk_index}
        forecastRainyDays={weather.forecast_rainy_days_7d}
      />

      {/* Extra info */}
      <div className="card">
        <p className="section-title">ข้อมูลเพิ่มเติม</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>ช่วงอุณหภูมิกลางวัน-กลางคืน</span>
            <span style={{ fontWeight: 600 }}>{weather.avg_diurnal_range}°C</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>ฝนพยากรณ์ 7 วัน</span>
            <span style={{ fontWeight: 600 }}>{weather.forecast_rainy_days_7d} วัน</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>ชม. อุณหภูมิเหมาะเชื้อโรค</span>
            <span style={{ fontWeight: 600 }}>{weather.optimal_pathogen_hours} ชม.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
