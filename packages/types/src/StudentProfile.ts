import type { SupportLevel } from './SkillCard';

export interface StudentProfile {
  id: string;
  student_id: string;
  attention_level: 1 | 2 | 3 | 4 | 5;
  sensory_sensitivity: 1 | 2 | 3 | 4 | 5;
  executive_functions: {
    planning: 1 | 2 | 3 | 4 | 5;
    working_memory: 1 | 2 | 3 | 4 | 5;
    inhibitory_control: 1 | 2 | 3 | 4 | 5;
  };
  hyperfocos: string[];
  aversions: string[];
  current_support_level: SupportLevel;
  updated_at: string;
}
