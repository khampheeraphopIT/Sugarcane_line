/* ──────────────────────────────────────────────
   SugarcaneAI — Shared TypeScript Types
   ────────────────────────────────────────────── */

// ─── LINE User ───────────────────────────────
export interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

// ─── Disease ─────────────────────────────────
export type DiseaseClass =
  | 'Healthy'
  | 'Red_Rot'
  | 'Mosaic'
  | 'Rust'
  | 'Yellow_Leaf'
  | 'Blight';

export type Severity = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface DiseaseInfo {
  id: number;
  name: DiseaseClass;
  nameThai: string;
  pathogen: string;
  severity: Severity;
  symptoms: string[];
  triggerWeather: string;
  prevention: string[];
  treatment: string[];
  chemicals: string[];
  icon: string;
}

// ─── Analysis Request / Response ─────────────
export interface AnalysisRequest {
  image: File;
  latitude: number;
  longitude: number;
  variety: string;
  ageMonths: number;
  soilType: string;
}

export interface ImageAnalysis {
  predicted_class: number;
  disease_name: DiseaseClass;
  disease_name_thai: string;
  severity: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  detected_leaves: number;
  bounding_boxes: BoundingBox[];
  is_healthy: boolean;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  conf: number;
}

export interface WeatherFeatures {
  avg_temp_14d: number;
  avg_humidity_14d: number;
  total_precip_14d: number;
  high_humidity_hours: number;
  max_consecutive_rain_days: number;
  optimal_pathogen_hours: number;
  avg_diurnal_range: number;
  avg_vpd: number;
  weather_risk_index: number;
  forecast_rainy_days_7d: number;
  weather_summary: string;
}

export interface ForecastRisk7d {
  score_7d: number;
  level_7d: string;
  rainy_days_ahead: number;
}

export interface Prediction {
  final_disease: DiseaseClass | 'Unknown';
  final_confidence: number;
  risk_score: number;
  risk_level: string;
  image_agrees: boolean;
  weather_amplified: boolean;
  forecast_risk_7d: ForecastRisk7d;
  model: string;
  warning?: string;
}

export interface Report {
  summary: string;
  disease_explanation: string;
  immediate_actions: string[];
  prevention_7days: string;
  chemical_options: string[];
  monitoring_tips: string;
  severity_explanation: string;
}

export interface AnalysisResponse {
  success: boolean;
  is_ood?: boolean;
  ood_message?: string;
  image_analysis: ImageAnalysis;
  weather_features: WeatherFeatures | Record<string, never>;
  prediction: Prediction;
  report: Report;
}

// ─── Scan History ────────────────────────────
export interface ScanRecord {
  id: string;
  timestamp: number;
  imageDataUrl?: string;
  latitude: number;
  longitude: number;
  variety: string;
  ageMonths: number;
  soilType: string;
  result: AnalysisResponse;
}

// ─── Notifications ───────────────────────────
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationSource = 'weather' | 'scan' | 'seasonal';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  source: NotificationSource;
  icon: string;
  timestamp: number;
  read: boolean;
}

// ─── Seasonal Guide ──────────────────────────
export interface SeasonalTip {
  month: number;
  title: string;
  description: string;
  tasks: string[];
  icon: string;
}

// ─── Risk Level Helper ───────────────────────
export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';
