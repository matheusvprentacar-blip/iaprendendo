import type { SupportLevel, MissionTemplate } from './SkillCard';

export type MissionStatus = 'pending' | 'active' | 'completed' | 'abandoned';

export interface Mission {
  id: string;
  student_id: string;
  skill_card_id: string;
  support_level: SupportLevel;
  skin_theme?: string;
  status: MissionStatus;
  started_at?: string;
  completed_at?: string;
  template: MissionTemplate;
}
