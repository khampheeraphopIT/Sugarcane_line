/* ──────────────────────────────────────────────
   NotifCard — Individual notification card
   ────────────────────────────────────────────── */

import type { AppNotification } from '@/types';
import './NotifCard.css';

interface NotifCardProps {
  notification: AppNotification;
  onRead: (id: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'var(--risk-critical)',
  high: 'var(--risk-high)',
  medium: 'var(--risk-medium)',
  low: 'var(--risk-low)',
};

export default function NotifCard({ notification, onRead }: NotifCardProps) {
  const { id, title, message, priority, icon, timestamp, read } = notification;
  const borderColor = PRIORITY_COLORS[priority] ?? 'var(--border-subtle)';

  const timeAgo = getTimeAgo(timestamp);

  return (
    <div
      className={`notif-card ${read ? 'read' : ''}`}
      style={{ borderLeftColor: borderColor }}
      onClick={() => !read && onRead(id)}
    >
      <div className="notif-header">
        <span className="notif-icon">{icon}</span>
        <span className="notif-title">{title}</span>
        {!read && <span className="notif-dot" />}
      </div>
      <p className="notif-message">{message}</p>
      <span className="notif-time">{timeAgo}</span>
    </div>
  );
}

function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อกี้';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}
