/* ──────────────────────────────────────────────
   Header — App bar with user profile & alerts
   ────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useLiff } from '@/liff/LiffContext';
import './Header.css';

interface HeaderProps {
  unreadCount: number;
}

export default function Header({ unreadCount }: HeaderProps) {
  const { user } = useLiff();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">🌾</div>
        <div>
          <h1 className="header-title">SugarcaneAI</h1>
          {user && (
            <p className="header-greeting">
              สวัสดี, {user.displayName}
            </p>
          )}
        </div>
      </div>

      <button
        className="header-bell"
        onClick={() => navigate('/notifications')}
        aria-label="การแจ้งเตือน"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
    </header>
  );
}
