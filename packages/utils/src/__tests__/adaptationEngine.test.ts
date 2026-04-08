import { describe, it, expect } from 'vitest';
import { determineAdaptationLevel } from '../adaptationEngine';
import type { StudentProfile } from '@ia-motor/types';
import type { TelemetryEvent } from '@ia-motor/types';

const baseProfile: StudentProfile = {
  id: 'profile-1',
  student_id: 'student-1',
  attention_level: 3,
  sensory_sensitivity: 2,
  executive_functions: { planning: 3, working_memory: 3, inhibitory_control: 3 },
  hyperfocos: [],
  aversions: [],
  current_support_level: 'neutro',
  updated_at: '2026-04-07T00:00:00Z',
};

const makeRageTap = (minsAgo = 0): TelemetryEvent => ({
  id: `evt-${Math.random()}`,
  mission_id: 'mission-1',
  student_id: 'student-1',
  event_type: 'rage_tap',
  value: 1,
  recorded_at: new Date(Date.now() - minsAgo * 60_000).toISOString(),
});

const makeAccuracyEvent = (value: number): TelemetryEvent => ({
  id: `evt-${Math.random()}`,
  mission_id: 'mission-1',
  student_id: 'student-1',
  event_type: 'taxa_acerto',
  value,
  recorded_at: new Date().toISOString(),
});

describe('determineAdaptationLevel', () => {
  it('returns neutro for balanced profile with no telemetry issues', () => {
    expect(determineAdaptationLevel(baseProfile, [])).toBe('neutro');
  });

  it('returns intensivo when attention=1 AND sensory=5 (worst case)', () => {
    const profile = { ...baseProfile, attention_level: 1 as const, sensory_sensitivity: 5 as const };
    expect(determineAdaptationLevel(profile, [])).toBe('intensivo');
  });

  it('returns leve when attention=2 (low attention only)', () => {
    const profile = { ...baseProfile, attention_level: 2 as const };
    expect(determineAdaptationLevel(profile, [])).toBe('leve');
  });

  it('returns leve when sensory=4 (high sensitivity only)', () => {
    const profile = { ...baseProfile, sensory_sensitivity: 4 as const };
    expect(determineAdaptationLevel(profile, [])).toBe('leve');
  });

  it('returns leve when planning executive function is low (<=2)', () => {
    const profile: StudentProfile = {
      ...baseProfile,
      executive_functions: { planning: 2, working_memory: 3, inhibitory_control: 3 },
    };
    expect(determineAdaptationLevel(profile, [])).toBe('leve');
  });

  it('returns intensivo when >10 rage_taps in last minute', () => {
    const events = Array.from({ length: 11 }, () => makeRageTap(0));
    expect(determineAdaptationLevel(baseProfile, events)).toBe('intensivo');
  });

  it('does NOT trigger intensivo for rage_taps older than 1 minute', () => {
    const events = Array.from({ length: 11 }, () => makeRageTap(2));
    expect(determineAdaptationLevel(baseProfile, events)).toBe('neutro');
  });

  it('returns intensivo when accuracy rate is below 0.4', () => {
    const events = [makeAccuracyEvent(0.2), makeAccuracyEvent(0.3)];
    expect(determineAdaptationLevel(baseProfile, events)).toBe('intensivo');
  });

  it('does NOT trigger intensivo for accuracy above 0.4', () => {
    const events = [makeAccuracyEvent(0.7)];
    expect(determineAdaptationLevel(baseProfile, events)).toBe('neutro');
  });
});
