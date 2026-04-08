export type SupportLevel = 'neutro' | 'leve' | 'intensivo';

export interface SupportConfig {
  linguagem: 'padrao' | 'simplificada' | 'explicita_gradual';
  segmentacao: string;
  suporte_visual: boolean;
  suporte_auditivo?: boolean;
  pistas_opcionais?: boolean;
  reducao_itens_tela?: boolean;
  duracao_max_s: number;
  modelo_instrucao?: 'gradual_release';
}

export interface MissionTemplate {
  id: string;
  tipo: 'drag_drop' | 'tap_choice' | 'sequencia';
  duracao_s: number;
  readonly erro_sem_punicao: true;
  feedback_imediato: boolean;
}

export interface TelemetryConfig {
  rastrear: Array<'latencia_toque' | 'precisao_motora' | 'rage_taps' | 'taxa_acerto'>;
  retencao_dados_dias: number;
  lgpd_consentimento_exigido: boolean;
}

export interface SkillCard {
  readonly skill_id: string;
  versao: string;
  readonly bncc_code: string;
  habilidade: string;
  area: string;
  ano_escolar: string;
  readonly objetivo_intocavel: string;
  matriz_suporte: Record<SupportLevel, SupportConfig>;
  skin_hiperfoco?: {
    tema: string;
    readonly objetivo_inalterado: true;
    assets: string[];
  };
  missoes: MissionTemplate[];
  telemetria: TelemetryConfig;
  created_at: string;
  updated_at: string;
}
