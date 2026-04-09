/* ──────────────────────────────────────────────
   HomePage — Dashboard
   ────────────────────────────────────────────── */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CloudSun, ChevronRight, Hand, ClipboardCheck } from 'lucide-react';
import { useLiff } from '@/liff/LiffContext';
import RiskGauge from '@/components/Weather/RiskGauge';
import WeatherCard from '@/components/Weather/WeatherCard';
import ForecastChart from '@/components/Weather/ForecastChart';
import NotifCard from '@/components/Notification/NotifCard';
import type { WeatherFeatures, AppNotification } from '@/types';
import './HomePage.css';

interface HomePageProps {
  weather: WeatherFeatures | null;
  weatherLoading: boolean;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onFetchWeather: (lat: number, lon: number) => void;
}

export default function HomePage({
  weather,
  weatherLoading,
  notifications,
  onMarkRead,
  onFetchWeather,
}: HomePageProps) {
  const { user } = useLiff();
  const navigate = useNavigate();

  // Fetch weather on mount with default location
  useEffect(() => {
    if (!weather && !weatherLoading) {
      onFetchWeather(16.4322, 102.8236);
    }
  }, [weather, weatherLoading, onFetchWeather]);

  const recentNotifs = notifications.slice(0, 3);

  return (
    <div className="page fade-in">
      {/* Greeting */}
      <div className="home-greeting">
        <h2>
          สวัสดี, <span className="green">{user?.displayName ?? 'เกษตรกร'}</span>{' '}
          <Hand
            size={24}
            style={{
              display: 'inline',
              verticalAlign: 'middle',
              color: '#facc15',
              marginLeft: '4px'
            }}
          />
        </h2>
        <p className="home-subtitle">รายงานสุขภาพแปลงอ้อยของคุณ</p>
      </div>

      {/* Risk Gauge */}
      <div className="home-gauge-section">
        {weather ? (
          <RiskGauge score={weather.weather_risk_index} label="ดัชนีเสี่ยง" />
        ) : (
          <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%', margin: '0 auto' }} />
        )}
        <p className="gauge-caption">
          {weather
            ? weather.weather_summary
            : 'กำลังโหลดข้อมูลสภาพอากาศ...'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="home-actions">
        <button className="action-btn scan-btn" onClick={() => navigate('/scan')}>
          <Camera size={24} />
          <span>สแกนใบอ้อย</span>
        </button>
        <button className="action-btn weather-btn" onClick={() => navigate('/weather')}>
          <CloudSun size={24} />
          <span>สภาพอากาศ</span>
        </button>
      </div>

      {/* Weather Summary */}
      {weather && <WeatherCard weather={weather} />}

      {/* Forecast */}
      {weather && (
        <ForecastChart
          riskScore={weather.weather_risk_index}
          forecastRainyDays={weather.forecast_rainy_days_7d}
        />
      )}

      {/* Recent Notifications */}
      {recentNotifs.length > 0 && (
        <div className="home-notifs">
          <div className="home-notifs-header">
            <p className="section-title" style={{ margin: 0 }}>
              การแจ้งเตือนล่าสุด
            </p>
            <button
              className="see-all-btn"
              onClick={() => navigate('/notifications')}
            >
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>
          <div className="notifs-list">
            {recentNotifs.map((n) => (
              <NotifCard key={n.id} notification={n} onRead={onMarkRead} />
            ))}
          </div>
        </div>
      )}

      {/* Data notice */}
      <p className="data-notice">
        <ClipboardCheck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> ระบบจัดเก็บประวัติการวิเคราะห์ล่าสุด 30 วัน เพื่อประสิทธิภาพการใช้งาน
      </p>
    </div>
  );
}
