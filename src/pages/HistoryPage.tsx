/* ──────────────────────────────────────────────
   HistoryPage — Scan history timeline
   ────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { ClipboardList, Trash2, Camera } from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import { getRiskMeta } from '@/utils/riskLevel';
import { DynamicIcon } from '@/components/Common/DynamicIcon';
import './HistoryPage.css';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, clearHistory } = useScanHistory();

  if (history.length === 0) {
    return (
      <div className="page fade-in empty-state">
        <ClipboardList size={48} className="empty-icon" />
        <h3>ยังไม่มีประวัติการสแกน</h3>
        <p>สแกนใบอ้อยครั้งแรกเพื่อเริ่มบันทึกประวัติ</p>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/scan')}>
          <Camera size={20} style={{ marginRight: 8 }} /> สแกนเลย
        </button>
      </div>
    );
  }

  // Group by date
  const grouped = history.reduce<Record<string, typeof history>>((acc, r) => {
    const date = new Date(r.timestamp).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    (acc[date] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          <ClipboardList size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          ประวัติสแกน
        </h2>
        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={clearHistory}>
          <Trash2 size={14} /> ล้าง
        </button>
      </div>

      {/* Stats */}
      <div className="history-stats card">
        <div className="stat-item">
          <span className="stat-num">{history.length}</span>
          <span className="stat-txt">สแกนทั้งหมด</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">
            {history.filter((h) => !h.result.image_analysis.is_healthy).length}
          </span>
          <span className="stat-txt">พบโรค</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">
            {history.filter((h) => h.result.image_analysis.is_healthy).length}
          </span>
          <span className="stat-txt">ปกติ</span>
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(grouped).map(([date, records]) => (
        <div key={date} className="history-group">
          <p className="history-date">{date}</p>
          {records.map((record) => {
            const risk = getRiskMeta(record.result.prediction.risk_score);
            return (
              <div
                key={record.id}
                className="history-item card"
                onClick={() => navigate(`/result/${record.id}`)}
              >
                {record.imageDataUrl && (
                  <img
                    src={record.imageDataUrl}
                    alt=""
                    className="history-thumb"
                  />
                )}
                <div className="history-info">
                  <span className="history-disease">
                    {record.result.image_analysis.disease_name_thai}
                  </span>
                  <span className="history-time">
                    {new Date(record.timestamp).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className="badge"
                  style={{ background: risk.bgColor, color: risk.color }}
                >
                  <DynamicIcon name={
                    risk.level === 'critical' ? 'alert-circle' :
                    risk.level === 'high' ? 'alert-triangle' :
                    risk.level === 'medium' ? 'zap' :
                    risk.level === 'low' ? 'check-circle' : 'shield-check'
                  } size={12} style={{ marginRight: 4 }} />
                  {risk.label}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
