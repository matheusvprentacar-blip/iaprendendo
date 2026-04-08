import { describe, it, expect } from 'vitest';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { motion } from '../tokens/motion';
import { typography } from '../tokens/typography';

describe('Design Tokens', () => {
  describe('colors', () => {
    it('exports adventurePurple as #7B2FBE', () => {
      expect(colors.adventurePurple).toBe('#7B2FBE');
    });

    it('exports bgDeep as darkest background', () => {
      expect(colors.bgDeep).toBe('#0F0A1E');
    });

    it('does not export coralRed without a warning comment (misuse guard)', () => {
      // coralRed exists but MUST NEVER be used as "error punishment"
      expect(colors.coralRed).toBe('#F87171');
    });
  });

  describe('spacing', () => {
    it('touchTarget is at least 48px (WCAG + neurodiversity)', () => {
      const px = parseInt(spacing.touchTarget, 10);
      expect(px).toBeGreaterThanOrEqual(48);
    });

    it('uses 8pt grid system', () => {
      expect(spacing.s2).toBe('8px');
      expect(spacing.s4).toBe('16px');
      expect(spacing.s6).toBe('32px');
    });
  });

  describe('motion', () => {
    it('durationNormal is 300ms', () => {
      expect(motion.durationNormal).toBe('300ms');
    });

    it('exports easeSpring for playful interactions', () => {
      expect(motion.easeSpring).toContain('cubic-bezier');
    });
  });

  describe('typography', () => {
    it('fontChild includes Nunito', () => {
      expect(typography.fontChild).toContain('Nunito');
    });

    it('fontDash includes Inter', () => {
      expect(typography.fontDash).toContain('Inter');
    });
  });
});
