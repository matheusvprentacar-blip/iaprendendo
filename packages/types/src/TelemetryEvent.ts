export type TelemetryEventType =
  | 'latencia_toque'
  | 'precisao_motora'
  | 'rage_tap'
  | 'taxa_acerto'
  | 'missao_iniciada'
  | 'missao_concluida'
  | 'missao_abandonada'
  | 'nivel_adaptado';

export interface TelemetryEvent {
  id: string;
  mission_id: string;
  student_id: string;
  event_type: TelemetryEventType;
  value: number;
  metadata?: Record<string, unknown>;
  recorded_at: string;
}

export const TELEMETRY_THRESHOLDS = {
  rage_taps_per_minute: 10,
  latencia_media_ms: 3000,
  taxa_acerto_minima: 0.4,
} as const;
