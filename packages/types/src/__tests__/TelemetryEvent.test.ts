import { describe, it, expect } from 'vitest';
import { TELEMETRY_THRESHOLDS } from '../TelemetryEvent';
import type { TelemetryEvent, TelemetryEventType } from '../TelemetryEvent';

describe('TelemetryEvent', () => {
  it('creates a valid TelemetryEvent', () => {
    const event: TelemetryEvent = {
      id: 'evt-1',
      mission_id: 'mission-1',
      student_id: 'student-1',
      event_type: 'rage_tap',
      value: 1,
      recorded_at: '2026-04-07T10:00:00Z',
    };
    expect(event.event_type).toBe('rage_tap');
  });

  it('supports optional metadata field', () => {
    const event: TelemetryEvent = {
      id: 'evt-2',
      mission_id: 'mission-1',
      student_id: 'student-1',
      event_type: 'latencia_toque',
      value: 1500,
      metadata: { screen_x: 100, screen_y: 200 },
      recorded_at: '2026-04-07T10:00:00Z',
    };
    expect(event.metadata).toEqual({ screen_x: 100, screen_y: 200 });
  });

  it('TELEMETRY_THRESHOLDS has correct values per spec', () => {
    expect(TELEMETRY_THRESHOLDS.rage_taps_per_minute).toBe(10);
    expect(TELEMETRY_THRESHOLDS.latencia_media_ms).toBe(3000);
    expect(TELEMETRY_THRESHOLDS.taxa_acerto_minima).toBe(0.4);
  });

  it('supports all TelemetryEventType values', () => {
    const types: TelemetryEventType[] = [
      'latencia_toque', 'precisao_motora', 'rage_tap', 'taxa_acerto',
      'missao_iniciada', 'missao_concluida', 'missao_abandonada', 'nivel_adaptado',
    ];
    expect(types).toHaveLength(8);
  });
});
