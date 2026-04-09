/* ──────────────────────────────────────────────
   BottomNav — 5-tab mobile navigation
   ────────────────────────────────────────────── */

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ScanLine,
  CloudSun,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/', label: 'หน้าแรก', icon: Home },
  { path: '/scan', label: 'สแกน', icon: ScanLine },
  { path: '/weather', label: 'อากาศ', icon: CloudSun },
  { path: '/history', label: 'ประวัติ', icon: ClipboardList },
  { path: '/knowledge', label: 'ความรู้', icon: BookOpen },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on result page
  if (location.pathname.startsWith('/result')) return null;

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const isActive =
          path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

        return (
          <button
            key={path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
