/* ──────────────────────────────────────────────
   NotificationEngine — Real-time alert computation
   Calculates alerts from 3 live data sources:
     1. Weather API (Open-Meteo)
     2. Scan history (localStorage)
     3. Seasonal calendar (current date)
   ────────────────────────────────────────────── */

import type {
  AppNotification,
  WeatherFeatures,
  ScanRecord,
} from '@/types';

const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours
const DEDUP_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY_NOTIFS = 'sugarcane_notifications';
const STORAGE_KEY_LAST_CHECK = 'sugarcane_lastNotifCheck';

// ─── Helpers ─────────────────────────────────

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function daysSince(timestamp: number): number {
  return (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
}

// ─── Engine ──────────────────────────────────

/**
 * Check if enough time has passed since the last notification computation.
 */
export function shouldRecompute(): boolean {
  const last = localStorage.getItem(STORAGE_KEY_LAST_CHECK);
  if (!last) return true;
  return Date.now() - Number(last) >= COOLDOWN_MS;
}

/**
 * Get cached notifications from localStorage.
 */
export function getCachedNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Compute real-time notifications from live data sources.
 * Called only when cooldown (3h) has elapsed.
 */
export function computeNotifications(
  weather: WeatherFeatures | null,
  scanHistory: ScanRecord[],
): AppNotification[] {
  const now = Date.now();
  const alerts: AppNotification[] = [];

  // Load previous alerts for dedup
  const prevAlerts = getCachedNotifications();
  const recentTypes = new Set(
    prevAlerts
      .filter((a) => now - a.timestamp < DEDUP_MS)
      .map((a) => a.title),
  );

  function add(alert: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    if (recentTypes.has(alert.title)) return; // dedup within 24h
    alerts.push({
      ...alert,
      id: makeId(alert.source),
      timestamp: now,
      read: false,
    });
  }

  // ─── Source 1: Weather API ──────────────────

  if (weather) {
    // 1. Heavy rain forecast
    if (weather.forecast_rainy_days_7d >= 3) {
      add({
        title: 'เตือนฝนตกหนัก',
        message: `พยากรณ์ฝนตก ${weather.forecast_rainy_days_7d} วัน ใน 7 วันข้างหน้า — ระวังน้ำขังในแปลง และโรคเน่าแดง`,
        priority: 'critical',
        source: 'weather',
        icon: '🌧️',
      });
    }

    // 2. High disease risk index
    if (weather.weather_risk_index > 70) {
      add({
        title: 'ดัชนีเสี่ยงโรคสูงมาก',
        message: `ดัชนีความเสี่ยงโรค ${weather.weather_risk_index.toFixed(0)}/100 — สภาพอากาศเอื้อต่อการเกิดโรค แนะนำสแกนใบอ้อยทันที`,
        priority: 'critical',
        source: 'weather',
        icon: '🔥',
      });
    }

    // 3. Humidity crisis
    if (weather.high_humidity_hours > 168) {
      add({
        title: 'ความชื้นสูงต่อเนื่อง',
        message: `ความชื้น > 80% ต่อเนื่อง ${weather.high_humidity_hours} ชม. ใน 14 วัน — ใบเปียกนาน เชื้อราเจริญได้ดี`,
        priority: 'high',
        source: 'weather',
        icon: '💧',
      });
    }

    // 4. Pathogen-optimal temperature
    if (weather.optimal_pathogen_hours > 250) {
      add({
        title: 'อุณหภูมิเหมาะกับเชื้อโรค',
        message: `อุณหภูมิ 25-35°C ต่อเนื่อง ${weather.optimal_pathogen_hours} ชม. — ช่วงที่เชื้อโรคเจริญเติบโตได้ดีที่สุด`,
        priority: 'medium',
        source: 'weather',
        icon: '🌡️',
      });
    }

    // 5. Low VPD (fungal risk)
    if (weather.avg_vpd < 0.8) {
      add({
        title: 'VPD ต่ำ — เชื้อราชอบ',
        message: `VPD เฉลี่ย ${weather.avg_vpd.toFixed(2)} kPa (ต่ำมาก) — ใบอ้อยเปียกง่าย เชื้อราเจริญได้ดี`,
        priority: 'medium',
        source: 'weather',
        icon: '🍃',
      });
    }

    // 6. Consecutive rain days
    if (weather.max_consecutive_rain_days >= 4) {
      add({
        title: 'ฝนตกต่อเนื่องหลายวัน',
        message: `ฝนตกต่อเนื่อง ${weather.max_consecutive_rain_days} วัน — เสี่ยงโรคเน่าแดงและใบไหม้ ตรวจแปลงด่วน`,
        priority: 'high',
        source: 'weather',
        icon: '🌧️',
      });
    }
  }

  // ─── Source 2: Scan History ─────────────────

  const lastScan = scanHistory.length > 0
    ? scanHistory.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
    : null;

  // 7. Remind to scan
  if (!lastScan || daysSince(lastScan.timestamp) > 7) {
    const dayCount = lastScan
      ? Math.floor(daysSince(lastScan.timestamp))
      : 999;
    add({
      title: 'ถึงเวลาสแกนใบอ้อย',
      message: lastScan
        ? `ไม่ได้สแกนมา ${dayCount} วันแล้ว — สแกนสม่ำเสมอช่วยตรวจพบโรคได้เร็วขึ้น`
        : 'ยังไม่เคยสแกนใบอ้อย — เริ่มสแกนครั้งแรกเพื่อตรวจสุขภาพแปลงของคุณ',
      priority: 'medium',
      source: 'scan',
      icon: '📸',
    });
  }

  // 8. Follow-up after disease
  if (
    lastScan &&
    !lastScan.result.image_analysis.is_healthy &&
    daysSince(lastScan.timestamp) > 3
  ) {
    add({
      title: 'ติดตามผลหลังพบโรค',
      message: `พบ${lastScan.result.image_analysis.disease_name_thai} เมื่อ ${Math.floor(daysSince(lastScan.timestamp))} วันก่อน — สแกนซ้ำเพื่อดูว่าอาการดีขึ้นหรือไม่`,
      priority: 'high',
      source: 'scan',
      icon: '🔄',
    });
  }

  // 9. Weather worsening + past disease
  if (
    weather &&
    weather.weather_risk_index > 60 &&
    lastScan &&
    !lastScan.result.image_analysis.is_healthy &&
    lastScan.result.prediction.weather_amplified
  ) {
    add({
      title: 'สภาพอากาศแย่ลง + เคยพบโรค',
      message: `สภาพอากาศเสี่ยง (${weather.weather_risk_index.toFixed(0)}/100) + เคยพบ${lastScan.result.image_analysis.disease_name_thai} — ต้องเฝ้าระวังอย่างใกล้ชิด`,
      priority: 'critical',
      source: 'scan',
      icon: '⚠️',
    });
  }

  // ─── Source 3: Seasonal Calendar ───────────

  const month = new Date().getMonth() + 1;

  if (month >= 4 && month <= 5) {
    add({
      title: 'เตรียมแปลงก่อนฤดูฝน',
      message: 'ทำร่องระบายน้ำ สำรองสารป้องกันเชื้อรา และสแกนสุขภาพใบก่อนฤดูฝน',
      priority: 'medium',
      source: 'seasonal',
      icon: '📅',
    });
  }

  if (month >= 8 && month <= 10) {
    add({
      title: 'ฤดูกาลระบาดโรคราสนิม',
      message: 'เดือน ส.ค.-ต.ค. เป็นช่วงที่โรคราสนิมระบาดมากที่สุด — สแกนทุกสัปดาห์',
      priority: 'high',
      source: 'seasonal',
      icon: '🦠',
    });
  }

  if (month >= 6 && month <= 8) {
    add({
      title: 'ช่วงอ้อยย่างปล้อง',
      message: 'อ้อย 4-8 เดือนกำลังย่างปล้อง ระวังโรคเน่าแดงเป็นพิเศษ',
      priority: 'medium',
      source: 'seasonal',
      icon: '🌿',
    });
  }

  // ─── Sort by priority & save ───────────────

  const priorityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  alerts.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3),
  );

  // Merge with previous unread alerts (keep last 50)
  const merged = [
    ...alerts,
    ...prevAlerts.filter((p) => !p.read && daysSince(p.timestamp) < 7),
  ].slice(0, 50);

  // Persist
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(merged));
  localStorage.setItem(STORAGE_KEY_LAST_CHECK, String(Date.now()));

  return merged;
}

/**
 * Mark a notification as read.
 */
export function markAsRead(notifId: string): void {
  const notifs = getCachedNotifications();
  const updated = notifs.map((n) =>
    n.id === notifId ? { ...n, read: true } : n,
  );
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
}

/**
 * Get count of unread notifications.
 */
export function getUnreadCount(): number {
  return getCachedNotifications().filter((n) => !n.read).length;
}
