/* ──────────────────────────────────────────────
   App.tsx — Router + Layout + State Hub
   ────────────────────────────────────────────── */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';
import { LiffProvider } from '@/liff/LiffProvider';
import Header from '@/components/Layout/Header';
import BottomNav from '@/components/Layout/BottomNav';

import HomePage from '@/pages/HomePage';
import ScanPage from '@/pages/ScanPage';
import ResultPage from '@/pages/ResultPage';
import WeatherPage from '@/pages/WeatherPage';
import HistoryPage from '@/pages/HistoryPage';
import KnowledgePage from '@/pages/KnowledgePage';
import NotificationPage from '@/pages/NotificationPage';

import { useWeather } from '@/hooks/useWeather';
import { useScanHistory } from '@/hooks/useScanHistory';
import { useNotifications } from '@/hooks/useNotifications';

function AppContent() {
  const weather = useWeather();
  const { history } = useScanHistory();
  const notifs = useNotifications(weather.data, history);

  const handleFetchWeather = useCallback(
    (lat: number, lon: number) => {
      weather.fetchWeather(lat, lon);
    },
    [weather],
  );

  return (
    <>
      <Header unreadCount={notifs.unreadCount} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              weather={weather.data}
              weatherLoading={weather.loading}
              notifications={notifs.notifications}
              onMarkRead={notifs.markAsRead}
              onFetchWeather={handleFetchWeather}
            />
          }
        />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route
          path="/weather"
          element={
            <WeatherPage
              weather={weather.data}
              weatherLoading={weather.loading}
              onFetchWeather={handleFetchWeather}
            />
          }
        />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route
          path="/notifications"
          element={
            <NotificationPage
              notifications={notifs.notifications}
              onMarkRead={notifs.markAsRead}
            />
          }
        />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LiffProvider>
        <AppContent />
      </LiffProvider>
    </BrowserRouter>
  );
}
