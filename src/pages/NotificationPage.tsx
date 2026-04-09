/* ──────────────────────────────────────────────
   NotificationPage — All alerts center
   ────────────────────────────────────────────── */

import { Bell } from 'lucide-react';
import NotifCard from '@/components/Notification/NotifCard';
import type { AppNotification } from '@/types';

interface NotificationPageProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
}

export default function NotificationPage({
  notifications,
  onMarkRead,
}: NotificationPageProps) {
  if (notifications.length === 0) {
    return (
      <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '15vh', textAlign: 'center' }}>
        <Bell size={48} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
        <h3 style={{ fontSize: '1.1rem' }}>ไม่มีการแจ้งเตือน</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          ระบบจะแจ้งเตือนเมื่อตรวจพบความเสี่ยง
        </p>
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <div className="page fade-in">
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
        <Bell size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        การแจ้งเตือน
      </h2>

      {unread.length > 0 && (
        <>
          <p className="section-title">ใหม่ ({unread.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-xl)' }}>
            {unread.map((n) => (
              <NotifCard key={n.id} notification={n} onRead={onMarkRead} />
            ))}
          </div>
        </>
      )}

      {read.length > 0 && (
        <>
          <p className="section-title">อ่านแล้ว</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {read.map((n) => (
              <NotifCard key={n.id} notification={n} onRead={onMarkRead} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
