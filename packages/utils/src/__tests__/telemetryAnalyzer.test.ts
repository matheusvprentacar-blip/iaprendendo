import { describe, it, expect } from 'vitest';
import {
  isRageTapThresholdExceeded,
  calculateAverageLatency,
  calculateAccuracyRate,
  isLatencyAlertActive,
} from '../telemetryAnalyzer';
import type { TelemetryEvent } from '@ia-motor/types';

const makeEvent = (type: TelemetryEvent['event_type'], value: number, minsAgo = 0): TelemetryEvent => ({
  id: `evt-${Math.random()}`,
  mission_id: 'mission-1',
  student_id: 'student-1',
  event_type: type,
  value,
  recorded_at: new Date(Date.now() - minsAgo * 60_000).toISOString(),
});

describe('isRageTapThresholdExceeded', () => {
  it('returns false for empty events', () => {
    expect(isRageTapThresholdExceeded([])).toBe(false);
  });

  it('returns false for 10 rage_taps (threshold is >10, not >=10)', () => {
    const events = Array.from({ length: 10 }, () => makeEvent('rage_tap', 1));
    expect(isRageTapThresholdExceeded(events)).toBe(false);
  });

  it('returns true for 11 rage_taps within the last minute', () => {
    const events = Array.from({ length: 11 }, () => makeEvent('rage_tap', 1));
    expect(isRageTapThresholdExceeded(events)).toBe(true);
  });

  it('ignores rage_taps older than 1 minute', () => {
    const events = Array.from({ length: 11 }, () => makeEvent('rage_tap', 1, 2));
    expect(isRageTapThresholdExceeded(events)).toBe(false);
  });
});

describe('calculateAverageLatency', () => {
  it('returns 0 for empty events', () => {
    expect(calculateAverageLatency([])).toBe(0);
  });

  it('calculates average of latencia_toque events', () => {
    const events = [makeEvent('latencia_toque', 1000), makeEvent('latencia_toque', 3000)];
    expect(calculateAverageLatency(events)).toBe(2000);
  });

  it('ignores non-latency events', () => {
    const events = [makeEvent('latencia_toque', 2000), makeEvent('rage_tap', 999)];
    expect(calculateAverageLatency(events)).toBe(2000);
  });
});

describe('calculateAccuracyRate', () => {
  it('returns 1 (assume OK) for empty events', () => {
    expect(calculateAccuracyRate([])).toBe(1);
  });

  it('averages taxa_acerto values', () => {
    const events = [makeEvent('taxa_acerto', 0.5), makeEvent('taxa_acerto', 0.7)];
    expect(calculateAccuracyRate(events)).toBeCloseTo(0.6);
  });
});

describe('isLatencyAlertActive', () => {
  it('returns false when average latency is below 3000ms', () => {
    const events = [makeEvent('latencia_toque', 1500)];
    expect(isLatencyAlertActive(events)).toBe(false);
  });

  it('returns true when average latency exceeds 3000ms', () => {
    const events = [makeEvent('latencia_toque', 4000)];
    expect(isLatencyAlertActive(events)).toBe(true);
  });
});
