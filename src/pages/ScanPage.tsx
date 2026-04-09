/* ──────────────────────────────────────────────
   ScanPage — Camera capture + field info + analyze
   ────────────────────────────────────────────── */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useScanHistory } from '@/hooks/useScanHistory';
import type { ScanRecord } from '@/types';
import './ScanPage.css';

export default function ScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geo = useGeolocation();
  const { analyze, loading, error } = useAnalyze();
  const { addRecord } = useScanHistory();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [variety, setVariety] = useState('khon_kaen_3');
  const [ageMonths, setAgeMonths] = useState(6);
  const [soilType, setSoilType] = useState('clay');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageFile) return;

    const result = await analyze({
      image: imageFile,
      latitude: geo.latitude,
      longitude: geo.longitude,
      variety,
      ageMonths,
      soilType,
    });

    if (result) {
      const record: ScanRecord = {
        id: `scan_${Date.now()}`,
        timestamp: Date.now(),
        imageDataUrl: preview ?? undefined,
        latitude: geo.latitude,
        longitude: geo.longitude,
        variety,
        ageMonths,
        soilType,
        result,
      };
      addRecord(record);
      navigate(`/result/${record.id}`);
    }
  };

  return (
    <div className="page fade-in">
      <h2 className="page-title">📸 สแกนใบอ้อย</h2>
      <p className="page-desc">ถ่ายรูปหรือเลือกรูปใบอ้อยเพื่อวิเคราะห์โรค</p>

      {/* Image capture */}
      <div
        className="capture-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="ใบอ้อย" className="capture-preview" />
        ) : (
          <div className="capture-placeholder">
            <Camera size={40} />
            <span>แตะเพื่อถ่ายรูป / เลือกรูป</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      {preview && (
        <button
          className="btn-secondary"
          style={{ marginBottom: 'var(--space-lg)' }}
          onClick={() => {
            setImageFile(null);
            setPreview(null);
          }}
        >
          <Upload size={16} /> เลือกรูปใหม่
        </button>
      )}

      {/* GPS */}
      <div className="scan-section">
        <button className="btn-secondary" onClick={geo.requestLocation}>
          <MapPin size={16} />
          {geo.loading
            ? 'กำลังหาตำแหน่ง...'
            : `📍 ${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}`}
        </button>
      </div>

      {/* Field info */}
      <div className="field-grid">
        <div>
          <label className="label">พันธุ์อ้อย</label>
          <select
            className="select"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
          >
            <option value="khon_kaen_3">ขอนแก่น 3</option>
            <option value="khon_kaen_1">ขอนแก่น 1</option>
            <option value="ut_thong_1">อู่ทอง 1</option>
            <option value="ut_thong_2">อู่ทอง 2</option>
            <option value="lph_11-101">LPH 11-101</option>
            <option value="unknown">ไม่ทราบ</option>
          </select>
        </div>
        <div>
          <label className="label">อายุ (เดือน)</label>
          <input
            className="input"
            type="number"
            min={1}
            max={24}
            value={ageMonths}
            onChange={(e) => setAgeMonths(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">ชนิดดิน</label>
          <select
            className="select"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
          >
            <option value="clay">ดินเหนียว</option>
            <option value="loam">ดินร่วน</option>
            <option value="sandy">ดินทราย</option>
            <option value="clay_loam">ดินร่วนเหนียว</option>
            <option value="silty">ดินตะกอน</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && <p className="scan-error">❌ {error}</p>}

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!imageFile || loading}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="spin" /> กำลังวิเคราะห์...
          </>
        ) : (
          '🔬 เริ่มวิเคราะห์โรค'
        )}
      </button>
    </div>
  );
}
