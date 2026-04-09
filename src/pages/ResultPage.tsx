/* ──────────────────────────────────────────────
   ResultPage — Full analysis result display
   ────────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Shield, Zap, Calendar, Pill, Eye, Camera } from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import RiskGauge from '@/components/Weather/RiskGauge';
import DiseaseDonut from '@/components/Charts/DiseaseDonut';
import { getRiskMeta } from '@/utils/riskLevel';
import { DynamicIcon } from '@/components/Common/DynamicIcon';
import './ResultPage.css';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecord } = useScanHistory();

  const record = id ? getRecord(id) : null;

  if (!record) {
    return (
      <div className="page fade-in" style={{ textAlign: 'center', paddingTop: '20vh' }}>
        <p className="text-muted">ไม่พบข้อมูลการสแกน</p>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  const { image_analysis, weather_features, prediction, report } = record.result;
  const riskMeta = getRiskMeta(prediction.risk_score);

  const isHealthy = image_analysis.is_healthy;
  const isOod = record.result.is_ood;

  return (
    <div className="page fade-in result-page">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> กลับ
      </button>

      {/* Disease name */}
      <div className="result-disease-header">
        <h2>{isOod ? 'ภาพไม่ถูกต้อง/ไม่ชัดเจน' : isHealthy ? 'สุขภาพใบอ้อยดีเยี่ยม' : image_analysis.disease_name_thai}</h2>
        <div className="badge" style={{ background: riskMeta.bgColor, color: riskMeta.color }}>
          <DynamicIcon name={
            riskMeta.level === 'critical' ? 'alert-circle' :
            riskMeta.level === 'high' ? 'alert-triangle' :
            riskMeta.level === 'medium' ? 'zap' :
            riskMeta.level === 'low' ? 'check-circle' : 'shield-check'
          } size={14} style={{ marginRight: 4 }} />
          {riskMeta.label}
        </div>
      </div>

      {/* Scan image */}
      {record.imageDataUrl && (
        <img src={record.imageDataUrl} alt="สแกน" className="result-image" />
      )}

      {/* Risk gauge */}
      {!isOod && (
        <>
          <div className="result-section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
            <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isHealthy ? 'ระดับความสมบูรณ์ของใบอ้อย' : 'คะแนนความรุนแรงของโรค'}
            </p>
          </div>
          <RiskGauge score={prediction.risk_score} />
        </>
      )}

      {/* OOD Warning */}
      {isOod && (
        <div className="card" style={{ borderColor: 'var(--risk-medium)', marginTop: 16 }}>
          <p style={{ color: 'var(--risk-medium)', fontWeight: 600 }}>
            <AlertTriangle size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            {record.result.ood_message}
          </p>
        </div>
      )}

      {/* Prediction summary */}
      <div className="card result-summary">
        <div className="summary-row">
          <span className="summary-label">ความเชี่ยวชาญของ AI</span>
          <span className="summary-value">{prediction.final_confidence}%</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">จำนวนใบที่ตรวจพบ</span>
          <span className="summary-value">{image_analysis.detected_leaves} ใบ</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">ปัจจัยเสริมจากสภาพอากาศ</span>
          <span className="summary-value">
            {prediction.weather_amplified ? (
              <span style={{ color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} /> มีผลกระทบสูง
              </span>
            ) : (
              <span style={{ color: 'var(--risk-safe)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> ปกติ
              </span>
            )}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">แนวโน้มใน 7 วัน</span>
          <span className="summary-value">{prediction.forecast_risk_7d.level_7d}</span>
        </div>
      </div>

      {/* Disease probability */}
      {!isHealthy && !isOod && <DiseaseDonut probabilities={image_analysis.all_probabilities} />}

      {/* Weather summary */}
      {weather_features && (
        <div className="card">
          <p className="section-title">สภาพอากาศที่ส่งผล</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {weather_features.weather_summary}
          </p>
        </div>
      )}

      {/* Report */}
      <div className="card">
        <p className="section-title">
          <Shield size={14} /> รายงาน AI
        </p>
        <p className="report-summary">{report.summary}</p>

        {report.disease_explanation && (
          <>
            <p className="report-heading">{isHealthy ? 'วิเคราะห์ความสมบูรณ์' : 'สาเหตุ'}</p>
            <p className="report-text">{report.disease_explanation}</p>
          </>
        )}

        <p className="report-heading">
          {isHealthy ? (
            <><CheckCircle size={14} style={{ marginRight: 6, color: 'var(--risk-safe)' }} /> การดูแลรักษาต่อเนื่อง</>
          ) : (
            <><Zap size={14} style={{ marginRight: 6, color: 'var(--risk-critical)' }} /> สิ่งที่ต้องทำทันที</>
          )}
        </p>
        <ul className="report-list">
          {report.immediate_actions.map((a: string, i: number) => (
            <li key={i}>{a}</li>
          ))}
        </ul>

        <p className="report-heading">
          <Calendar size={14} style={{ marginRight: 6, color: 'var(--primary)' }} /> 
          {isHealthy ? 'การป้องกันและบำรุงใน 7 วัน' : 'แนวทาง 7 วันข้างหน้า'}
        </p>
        <p className="report-text">{report.prevention_7days}</p>

        {!isHealthy && report.chemical_options && report.chemical_options.length > 0 && (
          <>
            <p className="report-heading">
              <Pill size={14} style={{ marginRight: 6, color: '#8b5cf6' }} /> สารเคมีแนะนำ
            </p>
            <ul className="report-list">
              {report.chemical_options.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        )}

        <p className="report-heading">
          <Eye size={14} style={{ marginRight: 6, color: 'var(--text-muted)' }} /> สิ่งที่ควรสังเกต
        </p>
        <p className="report-text">{report.monitoring_tips}</p>
      </div>

      <button className="btn-primary" onClick={() => navigate('/scan')}>
        <Camera size={20} style={{ marginRight: 8 }} /> สแกนอีกครั้ง
      </button>
    </div>
  );
}
