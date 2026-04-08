// IMPORTANT: coralRed (#F87171) MUST NEVER be used as punitive feedback.
// See AGENTS.md Rule 2: ZERO PUNISHMENT invariant.
export const colors = {
  // Primary — Child Interface
  adventurePurple: '#7B2FBE',
  adventurePurpleLight: '#A855F7',
  sunshineYellow: '#F59E0B',
  skyBlue: '#0EA5E9',
  forestGreen: '#10B981',
  coralRed: '#F87171', // decorative only — never punitive

  // Backgrounds — Overworld
  bgDeep: '#0F0A1E',
  bgCard: '#1A1033',
  bgSurface: '#251B47',

  // Text
  textPrimary: '#F8F4FF',
  textSecondary: '#B8A9D9',
  textMuted: '#6E5F8A',

  // Dashboard — Parents/Educators
  dashBg: '#F8F7FF',
  dashSurface: '#FFFFFF',
  dashBorder: '#E5E0F5',
  dashAccent: '#7B2FBE',
} as const;

export type ColorToken = keyof typeof colors;
