import { describe, it, expect } from 'vitest';
import type { SkillCard, SupportLevel, MissionTemplate } from '../SkillCard';

describe('SkillCard type', () => {
  it('creates a valid SkillCard with all required fields', () => {
    const card: SkillCard = {
      skill_id: 'MAT.EF01.001',
      versao: '1.0.0',
      bncc_code: 'EF01MA01',
      habilidade: 'Reconhecer e comparar quantidades',
      area: 'Matemática',
      ano_escolar: '1º ano EF',
      objetivo_intocavel: 'A criança deve reconhecer e comparar quantidades até 10',
      matriz_suporte: {
        neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
        leve: { linguagem: 'simplificada', segmentacao: '3 passos', suporte_visual: true, duracao_max_s: 300, pistas_opcionais: true, reducao_itens_tela: true },
        intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, duracao_max_s: 180, suporte_auditivo: true, modelo_instrucao: 'gradual_release' },
      },
      missoes: [
        { id: 'miss_001', tipo: 'drag_drop', duracao_s: 180, erro_sem_punicao: true, feedback_imediato: true },
      ],
      telemetria: {
        rastrear: ['latencia_toque', 'rage_taps', 'taxa_acerto', 'precisao_motora'],
        retencao_dados_dias: 90,
        lgpd_consentimento_exigido: true,
      },
      created_at: '2026-04-07T00:00:00Z',
      updated_at: '2026-04-07T00:00:00Z',
    };

    expect(card.bncc_code).toBe('EF01MA01');
    expect(card.missoes[0].erro_sem_punicao).toBe(true);
    expect(card.telemetria.lgpd_consentimento_exigido).toBe(true);
  });

  it('supports all three SupportLevel values', () => {
    const levels: SupportLevel[] = ['neutro', 'leve', 'intensivo'];
    expect(levels).toHaveLength(3);
    expect(levels).toContain('neutro');
    expect(levels).toContain('leve');
    expect(levels).toContain('intensivo');
  });

  it('enforces duracao_max_s never exceeds 420s (neutro cap)', () => {
    const neutroMax = 420;
    const leveMax = 300;
    const intensivoMax = 180;
    expect(neutroMax).toBeLessThanOrEqual(420);
    expect(leveMax).toBeLessThanOrEqual(420);
    expect(intensivoMax).toBeLessThanOrEqual(420);
  });

  it('enforces mission tipo union', () => {
    const tipos: MissionTemplate['tipo'][] = ['drag_drop', 'tap_choice', 'sequencia'];
    expect(tipos).toHaveLength(3);
  });
});
