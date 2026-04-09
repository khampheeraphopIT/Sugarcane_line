/* ──────────────────────────────────────────────
   WeatherCard — Current weather summary
   ────────────────────────────────────────────── */

import { Thermometer, Droplets, CloudRain, Wind } from 'lucide-react';
import type { WeatherFeatures } from '@/types';
import './WeatherCard.css';

interface WeatherCardProps {
  weather: WeatherFeatures;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="weather-card card">
      <div className="weather-grid">
        <div className="weather-stat">
          <Thermometer size={18} className="stat-icon temp" />
          <span className="stat-value">{weather.avg_temp_14d}°C</span>
          <span className="stat-label">อุณหภูมิ</span>
        </div>
        <div className="weather-stat">
          <Droplets size={18} className="stat-icon humidity" />
          <span className="stat-value">{weather.avg_humidity_14d}%</span>
          <span className="stat-label">ความชื้น</span>
        </div>
        <div className="weather-stat">
          <CloudRain size={18} className="stat-icon rain" />
          <span className="stat-value">{weather.total_precip_14d}mm</span>
          <span className="stat-label">ฝน 14 วัน</span>
        </div>
        <div className="weather-stat">
          <Wind size={18} className="stat-icon vpd" />
          <span className="stat-value">{weather.avg_vpd}</span>
          <span className="stat-label">VPD</span>
        </div>
      </div>
    </div>
  );
}
