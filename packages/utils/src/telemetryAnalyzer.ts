import type { TelemetryEvent } from '@ia-motor/types';
import { TELEMETRY_THRESHOLDS } from '@ia-motor/types';

export function isRageTapThresholdExceeded(events: TelemetryEvent[]): boolean {
  const oneMinuteAgo = Date.now() - 60_000;
  const recentRageTaps = events.filter(
    (event) => event.event_type === 'rage_tap' && new Date(event.recorded_at).getTime() > oneMinuteAgo,
  );

  return recentRageTaps.length > TELEMETRY_THRESHOLDS.rage_taps_per_minute;
}

export function calculateAverageLatency(events: TelemetryEvent[]): number {
  const latencyEvents = events.filter((event) => event.event_type === 'latencia_toque');
  if (latencyEvents.length === 0) {
    return 0;
  }

  return latencyEvents.reduce((sum, event) => sum + event.value, 0) / latencyEvents.length;
}

export function calculateAccuracyRate(events: TelemetryEvent[]): number {
  const accuracyEvents = events.filter((event) => event.event_type === 'taxa_acerto');
  if (accuracyEvents.length === 0) {
    return 1;
  }

  return accuracyEvents.reduce((sum, event) => sum + event.value, 0) / accuracyEvents.length;
}

export function isLatencyAlertActive(events: TelemetryEvent[]): boolean {
  return calculateAverageLatency(events) > TELEMETRY_THRESHOLDS.latencia_media_ms;
}
