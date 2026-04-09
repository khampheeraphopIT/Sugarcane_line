/* ──────────────────────────────────────────────
   KnowledgePage — Disease encyclopedia + Tips
   ────────────────────────────────────────────── */

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Calendar, Bug, Sun, ShieldCheck, Pill, FlaskConical } from 'lucide-react';
import { DISEASES } from '@/data/diseases';
import { getCurrentSeasonalTip, getUpcomingSeasonalTips } from '@/data/seasonalGuide';
import { DynamicIcon } from '@/components/Common/DynamicIcon';
import type { DiseaseInfo } from '@/types';
import './KnowledgePage.css';

export default function KnowledgePage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const currentTip = getCurrentSeasonalTip();
  const upcoming = getUpcomingSeasonalTips();

  return (
    <div className="page fade-in">
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
        <BookOpen size={18} style={{ verticalAlign: 'middle' }} /> คลังความรู้
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
        ข้อมูลโรคอ้อย + ปฏิทินดูแลรายเดือน
      </p>

      {/* Seasonal tip */}
      <div className="card-elevated" style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-title">
          <Calendar size={14} style={{ marginRight: 6, color: 'var(--primary)' }} />
          เดือนนี้ — {currentTip.title}
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          {currentTip.description}
        </p>
        <ul className="tip-tasks">
          {currentTip.tasks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Upcoming months */}
      <p className="section-title">ปฏิทิน 3 เดือนข้างหน้า</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)', overflowX: 'auto' }}>
        {upcoming.map((tip) => (
          <div
            key={tip.month}
            className="card"
            style={{ minWidth: 140, flex: '0 0 auto', padding: 12, textAlign: 'center' }}
          >
            <DynamicIcon name={tip.icon} size={24} style={{ color: 'var(--primary)', marginBottom: 8 }} />
            <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{tip.title}</p>
          </div>
        ))}
      </div>

      {/* Disease encyclopedia */}
      <p className="section-title">
        <Bug size={14} style={{ marginRight: 6, color: 'var(--risk-critical)' }} />
        สารานุกรมโรคอ้อย
      </p>
      <div className="disease-list">
        {DISEASES.map((disease) => (
          <DiseaseAccordion
            key={disease.id}
            disease={disease}
            isOpen={expanded === disease.id}
            onToggle={() =>
              setExpanded(expanded === disease.id ? null : disease.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

function DiseaseAccordion({
  disease,
  isOpen,
  onToggle,
}: {
  disease: DiseaseInfo;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`disease-accordion card ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <div className="accordion-icon">
          <DynamicIcon name={disease.icon} size={18} />
        </div>
        <div className="accordion-title">
          <span className="disease-name">{disease.nameThai}</span>
          <span className="disease-pathogen">{disease.pathogen}</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="accordion-body fade-in">
          <div className="disease-section">
            <h4>อาการ</h4>
            <ul>
              {disease.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="disease-section">
            <h4>
              <Sun size={14} style={{ marginRight: 6, color: '#facc15' }} />
              สภาพอากาศที่กระตุ้น
            </h4>
            <p>{disease.triggerWeather}</p>
          </div>

          <div className="disease-section">
            <h4>
              <ShieldCheck size={14} style={{ marginRight: 6, color: 'var(--risk-safe)' }} />
              วิธีป้องกัน
            </h4>
            <ul>
              {disease.prevention.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="disease-section">
            <h4>
              <Pill size={14} style={{ marginRight: 6, color: '#a855f7' }} />
              การรักษา
            </h4>
            <ul>
              {disease.treatment.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {disease.chemicals[0] !== '-' && (
            <div className="disease-section">
              <h4>
                <FlaskConical size={14} style={{ marginRight: 6, color: '#3b82f6' }} />
                สารเคมีแนะนำ
              </h4>
              <ul>
                {disease.chemicals.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
