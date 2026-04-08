// IMPORTANT: Always respect prefers-reduced-motion.
// When active, all durations must drop to 0ms or simple fade.
// Check this in every animated component.
export const motion = {
  // Durations
  durationFast: '150ms',
  durationNormal: '300ms',
  durationSlow: '500ms',
  durationEnter: '400ms',

  // Easing
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // playful, bouncy
  easeSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // smooth
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)', // exit
} as const;

export const REDUCED_MOTION_DURATION = '0ms' as const;
