import type { StudentProfile, SupportLevel, TelemetryEvent } from '@ia-motor/types';
import { TELEMETRY_THRESHOLDS } from '@ia-motor/types';

/**
 * Determines the appropriate SupportLevel for a student based on their profile
 * and recent telemetry events.
 *
 * Priority order:
 * 1. Real-time telemetry signals (immediate override)
 * 2. Profile dimensions (planning, attention, sensory)
 */
export function determineAdaptationLevel(
  profile: StudentProfile,
  recentEvents: TelemetryEvent[],
): SupportLevel {
  if (hasRageTapAlert(recentEvents)) return 'intensivo';
  if (hasLowAccuracy(recentEvents)) return 'intensivo';

  const attentionLow = profile.attention_level <= 2;
  const sensitivityHigh = profile.sensory_sensitivity >= 4;
  const executiveLow =
    profile.executive_functions.planning <= 2 ||
    profile.executive_functions.working_memory <= 2 ||
    profile.executive_functions.inhibitory_control <= 2;

  if (attentionLow && sensitivityHigh) return 'intensivo';
  if (attentionLow || sensitivityHigh || executiveLow) return 'leve';
  return 'neutro';
}

function hasRageTapAlert(events: TelemetryEvent[]): boolean {
  const oneMinuteAgo = Date.now() - 60_000;
  const recentRageTaps = events.filter(
    (e) => e.event_type === 'rage_tap' && new Date(e.recorded_at).getTime() > oneMinuteAgo,
  );
  return recentRageTaps.length > TELEMETRY_THRESHOLDS.rage_taps_per_minute;
}

function hasLowAccuracy(events: TelemetryEvent[]): boolean {
  const accuracyEvents = events.filter((e) => e.event_type === 'taxa_acerto');
  if (accuracyEvents.length === 0) return false;
  const avg = accuracyEvents.reduce((sum, e) => sum + e.value, 0) / accuracyEvents.length;
  return avg < TELEMETRY_THRESHOLDS.taxa_acerto_minima;
}
