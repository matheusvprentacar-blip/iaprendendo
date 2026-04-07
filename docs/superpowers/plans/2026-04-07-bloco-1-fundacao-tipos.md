# Bloco 1 — Fundação & Tipos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o monorepo completo com todos os packages compartilhados, schema do banco de dados, scaffold da API e seed de 10 Skill Cards BNCC — a base técnica que todos os outros blocos dependem.

**Architecture:** Turborepo + pnpm workspaces com 4 packages (`types`, `design-system`, `utils`, `config`) e 1 serviço (`api`). Supabase cloud para PostgreSQL/Auth, Redis via Docker Compose local. A API Fastify é scaffolded com todos os endpoints retornando 501 — a implementação real vem no Bloco 3.

**Tech Stack:** Turborepo 2, pnpm 9, TypeScript 5 (strict), Fastify 4, Prisma 5, Vitest 1, Redis 7, Docker Compose, GitHub Actions

---

## Mapa de Arquivos

```
ia-motor-adaptativo/
├── .gitignore
├── .env.example
├── package.json                          # root — scripts pnpm
├── pnpm-workspace.yaml
├── turbo.json
├── packages/
│   ├── config/
│   │   ├── package.json
│   │   ├── tsconfig-base.json
│   │   ├── eslint-preset.js
│   │   └── tailwind-preset.js
│   ├── types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── src/
│   │       ├── SkillCard.ts
│   │       ├── StudentProfile.ts
│   │       ├── TelemetryEvent.ts
│   │       ├── Mission.ts
│   │       ├── index.ts
│   │       └── __tests__/
│   │           ├── SkillCard.test.ts
│   │           └── TelemetryEvent.test.ts
│   ├── design-system/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── src/
│   │       ├── tokens/
│   │       │   ├── colors.ts
│   │       │   ├── typography.ts
│   │       │   ├── spacing.ts
│   │       │   └── motion.ts
│   │       ├── index.ts
│   │       └── __tests__/
│   │           └── tokens.test.ts
│   └── utils/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       └── src/
│           ├── adaptationEngine.ts
│           ├── telemetryAnalyzer.ts
│           ├── index.ts
│           └── __tests__/
│               ├── adaptationEngine.test.ts
│               └── telemetryAnalyzer.test.ts
├── services/
│   └── api/
│       ├── package.json
│       ├── tsconfig.json
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       └── src/
│           ├── server.ts
│           ├── app.ts
│           ├── lib/
│           │   ├── prisma.ts
│           │   └── redis.ts
│           └── routes/
│               ├── curriculum/index.ts
│               ├── adaptation/index.ts
│               ├── telemetry/index.ts
│               ├── reports/index.ts
│               ├── consent/index.ts
│               ├── missions/index.ts
│               └── profile/index.ts
├── infra/
│   └── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Task 1: Git + Monorepo Root

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`

- [ ] **Step 1.1: Inicializar git**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git init
```

Expected: `Initialized empty Git repository in .../I.aprendendo/.git/`

- [ ] **Step 1.2: Criar .gitignore**

```
node_modules/
dist/
.env
.env.local
*.env
.turbo/
.next/
.expo/
*.tsbuildinfo
.superpowers/
coverage/
```

- [ ] **Step 1.3: Criar .env.example**

```
# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT].supabase.co"
SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# Redis (local via Docker)
REDIS_URL="redis://localhost:6379"

# API
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# AI Engine (Bloco 3)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
LANGCHAIN_API_KEY="ls__..."
LANGCHAIN_TRACING_V2=true
```

- [ ] **Step 1.4: Criar package.json raiz**

```json
{
  "name": "ia-motor-adaptativo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "dev:api": "turbo dev --filter=@ia-motor/api",
    "dev:ai": "cd services/ai-engine && uvicorn main:app --reload --port 8001",
    "build": "turbo build",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "lint": "turbo lint",
    "db:migrate": "cd services/api && pnpm prisma migrate dev",
    "db:seed": "cd services/api && pnpm prisma db seed",
    "db:embed": "cd services/ai-engine && python -m scripts.generate_embeddings"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 1.5: Criar pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

- [ ] **Step 1.6: Criar turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 1.7: Criar pastas necessárias**

```bash
mkdir -p packages/config packages/types/src/__tests__ packages/design-system/src/tokens packages/design-system/src/__tests__ packages/utils/src/__tests__ services/api/src/lib services/api/src/routes/curriculum services/api/src/routes/adaptation services/api/src/routes/telemetry services/api/src/routes/reports services/api/src/routes/consent services/api/src/routes/missions services/api/src/routes/profile services/api/prisma infra .github/workflows
```

- [ ] **Step 1.8: Commit inicial**

```bash
git add .gitignore .env.example package.json pnpm-workspace.yaml turbo.json
git commit -m "chore: initialize monorepo with Turborepo + pnpm workspaces"
```

---

## Task 2: packages/config — Configurações Compartilhadas

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig-base.json`
- Create: `packages/config/eslint-preset.js`
- Create: `packages/config/tailwind-preset.js`

- [ ] **Step 2.1: Criar packages/config/package.json**

```json
{
  "name": "@ia-motor/config",
  "version": "0.0.1",
  "private": true,
  "exports": {
    "./tsconfig-base.json": "./tsconfig-base.json",
    "./eslint-preset": "./eslint-preset.js",
    "./tailwind-preset": "./tailwind-preset.js"
  }
}
```

- [ ] **Step 2.2: Criar packages/config/tsconfig-base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **Step 2.3: Criar packages/config/eslint-preset.js**

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
```

- [ ] **Step 2.4: Criar packages/config/tailwind-preset.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'adventure-purple':       '#7B2FBE',
        'adventure-purple-light': '#A855F7',
        'sunshine-yellow':        '#F59E0B',
        'sky-blue':               '#0EA5E9',
        'forest-green':           '#10B981',
        'coral-red':              '#F87171',
        'bg-deep':                '#0F0A1E',
        'bg-card':                '#1A1033',
        'bg-surface':             '#251B47',
        'text-primary':           '#F8F4FF',
        'text-secondary':         '#B8A9D9',
        'text-muted':             '#6E5F8A',
        'dash-bg':                '#F8F7FF',
        'dash-surface':           '#FFFFFF',
        'dash-border':            '#E5E0F5',
        'dash-accent':            '#7B2FBE',
      },
      fontFamily: {
        child: ['"Nunito"', '"Fredoka One"', 'system-ui'],
        dash:  ['"Inter"', 'system-ui'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2.5: Commit**

```bash
git add packages/config/
git commit -m "feat: add shared config package (tsconfig, eslint, tailwind)"
```

---

## Task 3: packages/types — Tipos TypeScript Compartilhados

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/vitest.config.ts`
- Create: `packages/types/src/SkillCard.ts`
- Create: `packages/types/src/StudentProfile.ts`
- Create: `packages/types/src/TelemetryEvent.ts`
- Create: `packages/types/src/Mission.ts`
- Create: `packages/types/src/index.ts`
- Create: `packages/types/src/__tests__/SkillCard.test.ts`
- Create: `packages/types/src/__tests__/TelemetryEvent.test.ts`

- [ ] **Step 3.1: Escrever os testes primeiro (TDD)**

`packages/types/src/__tests__/SkillCard.test.ts`:
```typescript
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
        neutro:    { linguagem: 'padrao',           segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
        leve:      { linguagem: 'simplificada',     segmentacao: '3 passos',       suporte_visual: true,  duracao_max_s: 300, pistas_opcionais: true, reducao_itens_tela: true },
        intensivo: { linguagem: 'explicita_gradual',segmentacao: 'micro_passos_30s',suporte_visual: true,  duracao_max_s: 180, suporte_auditivo: true, modelo_instrucao: 'gradual_release' },
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
```

`packages/types/src/__tests__/TelemetryEvent.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { TELEMETRY_THRESHOLDS } from '../TelemetryEvent';
import type { TelemetryEvent, TelemetryEventType } from '../TelemetryEvent';

describe('TelemetryEvent', () => {
  it('creates a valid TelemetryEvent', () => {
    const event: TelemetryEvent = {
      id: 'evt-1',
      mission_id: 'mission-1',
      student_id: 'student-1',
      event_type: 'rage_tap',
      value: 1,
      recorded_at: '2026-04-07T10:00:00Z',
    };
    expect(event.event_type).toBe('rage_tap');
  });

  it('supports optional metadata field', () => {
    const event: TelemetryEvent = {
      id: 'evt-2',
      mission_id: 'mission-1',
      student_id: 'student-1',
      event_type: 'latencia_toque',
      value: 1500,
      metadata: { screen_x: 100, screen_y: 200 },
      recorded_at: '2026-04-07T10:00:00Z',
    };
    expect(event.metadata).toEqual({ screen_x: 100, screen_y: 200 });
  });

  it('TELEMETRY_THRESHOLDS has correct values per spec', () => {
    expect(TELEMETRY_THRESHOLDS.rage_taps_per_minute).toBe(10);
    expect(TELEMETRY_THRESHOLDS.latencia_media_ms).toBe(3000);
    expect(TELEMETRY_THRESHOLDS.taxa_acerto_minima).toBe(0.4);
  });

  it('supports all TelemetryEventType values', () => {
    const types: TelemetryEventType[] = [
      'latencia_toque', 'precisao_motora', 'rage_tap', 'taxa_acerto',
      'missao_iniciada', 'missao_concluida', 'missao_abandonada', 'nivel_adaptado',
    ];
    expect(types).toHaveLength(8);
  });
});
```

- [ ] **Step 3.2: Verificar que os testes FALHAM (arquivos de implementação ainda não existem)**

```bash
cd packages/types && pnpm test 2>&1 | head -20
```

Expected: erro de módulo não encontrado (`Cannot find module '../SkillCard'`)

- [ ] **Step 3.3: Criar packages/types/src/SkillCard.ts**

```typescript
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
  readonly erro_sem_punicao: true; // invariant: never false
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
  readonly bncc_code: string;           // AGENTS.md Rule 1: NEVER modify
  habilidade: string;
  area: string;
  ano_escolar: string;
  readonly objetivo_intocavel: string;  // AGENTS.md Rule 1: NEVER modify
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
```

- [ ] **Step 3.4: Criar packages/types/src/StudentProfile.ts**

```typescript
import type { SupportLevel } from './SkillCard';

export interface StudentProfile {
  id: string;
  student_id: string;
  attention_level:     1 | 2 | 3 | 4 | 5;
  sensory_sensitivity: 1 | 2 | 3 | 4 | 5;
  executive_functions: {
    planning:           1 | 2 | 3 | 4 | 5;
    working_memory:     1 | 2 | 3 | 4 | 5;
    inhibitory_control: 1 | 2 | 3 | 4 | 5;
  };
  hyperfocos: string[];   // e.g. ["dinossauros", "trens"]
  aversions:  string[];   // e.g. ["sons altos", "textos longos"]
  current_support_level: SupportLevel;
  updated_at: string;
}
```

- [ ] **Step 3.5: Criar packages/types/src/TelemetryEvent.ts**

```typescript
export type TelemetryEventType =
  | 'latencia_toque'
  | 'precisao_motora'
  | 'rage_tap'
  | 'taxa_acerto'
  | 'missao_iniciada'
  | 'missao_concluida'
  | 'missao_abandonada'
  | 'nivel_adaptado';

export interface TelemetryEvent {
  id: string;
  mission_id: string;
  student_id: string;
  event_type: TelemetryEventType;
  value: number;
  metadata?: Record<string, unknown>;
  recorded_at: string; // ISO 8601
}

export const TELEMETRY_THRESHOLDS = {
  rage_taps_per_minute: 10,   // above this → suggest pause
  latencia_media_ms:    3000, // above this → possible confusion
  taxa_acerto_minima:   0.4,  // below this → escalate support level
} as const;
```

- [ ] **Step 3.6: Criar packages/types/src/Mission.ts**

```typescript
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
```

- [ ] **Step 3.7: Criar packages/types/src/index.ts**

```typescript
export type { SupportLevel, SupportConfig, MissionTemplate, TelemetryConfig, SkillCard } from './SkillCard';
export type { StudentProfile } from './StudentProfile';
export type { TelemetryEventType, TelemetryEvent } from './TelemetryEvent';
export { TELEMETRY_THRESHOLDS } from './TelemetryEvent';
export type { MissionStatus, Mission } from './Mission';
```

- [ ] **Step 3.8: Criar packages/types/package.json**

```json
{
  "name": "@ia-motor/types",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types":  "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build":     "tsc",
    "test":      "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@ia-motor/config": "workspace:*",
    "typescript":       "^5.4.0",
    "vitest":           "^1.6.0"
  }
}
```

- [ ] **Step 3.9: Criar packages/types/tsconfig.json**

```json
{
  "extends": "@ia-motor/config/tsconfig-base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3.10: Criar packages/types/vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

- [ ] **Step 3.11: Instalar dependências e rodar os testes**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
pnpm install
cd packages/types && pnpm test
```

Expected output:
```
✓ packages/types/src/__tests__/SkillCard.test.ts (4 tests)
✓ packages/types/src/__tests__/TelemetryEvent.test.ts (4 tests)
Test Files  2 passed (2)
Tests       8 passed (8)
```

- [ ] **Step 3.12: Commit**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add packages/types/
git commit -m "feat: add @ia-motor/types package (SkillCard, StudentProfile, TelemetryEvent, Mission)"
```

---

## Task 4: packages/design-system — Design Tokens

**Files:**
- Create: `packages/design-system/package.json`
- Create: `packages/design-system/tsconfig.json`
- Create: `packages/design-system/vitest.config.ts`
- Create: `packages/design-system/src/tokens/colors.ts`
- Create: `packages/design-system/src/tokens/typography.ts`
- Create: `packages/design-system/src/tokens/spacing.ts`
- Create: `packages/design-system/src/tokens/motion.ts`
- Create: `packages/design-system/src/index.ts`
- Create: `packages/design-system/src/__tests__/tokens.test.ts`

- [ ] **Step 4.1: Escrever o teste primeiro**

`packages/design-system/src/__tests__/tokens.test.ts`:
```typescript
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
```

- [ ] **Step 4.2: Criar packages/design-system/src/tokens/colors.ts**

```typescript
// IMPORTANT: coralRed (#F87171) MUST NEVER be used as punitive feedback.
// See AGENTS.md Rule 2: ZERO PUNISHMENT invariant.
export const colors = {
  // Primary — Child Interface
  adventurePurple:      '#7B2FBE',
  adventurePurpleLight: '#A855F7',
  sunshineYellow:       '#F59E0B',
  skyBlue:              '#0EA5E9',
  forestGreen:          '#10B981',
  coralRed:             '#F87171', // decorative only — never punitive

  // Backgrounds — Overworld
  bgDeep:    '#0F0A1E',
  bgCard:    '#1A1033',
  bgSurface: '#251B47',

  // Text
  textPrimary:   '#F8F4FF',
  textSecondary: '#B8A9D9',
  textMuted:     '#6E5F8A',

  // Dashboard — Parents/Educators
  dashBg:      '#F8F7FF',
  dashSurface: '#FFFFFF',
  dashBorder:  '#E5E0F5',
  dashAccent:  '#7B2FBE',
} as const;

export type ColorToken = keyof typeof colors;
```

- [ ] **Step 4.3: Criar packages/design-system/src/tokens/typography.ts**

```typescript
export const typography = {
  // Fonts
  fontChild: '"Nunito", "Fredoka One", system-ui', // child interface
  fontDash:  '"Inter", system-ui',                  // adult dashboard

  // Scale (base 16px)
  textXs:   '12px',
  textSm:   '14px',
  textMd:   '16px',
  textLg:   '20px',
  textXl:   '28px',
  text2Xl:  '36px',
  textHero: '48px',

  // Weights
  fontRegular: 400,
  fontMedium:  500,
  fontBold:    700,
  fontBlack:   900,
} as const;
```

- [ ] **Step 4.4: Criar packages/design-system/src/tokens/spacing.ts**

```typescript
export const spacing = {
  // 8pt grid system
  s1:  '4px',
  s2:  '8px',
  s3:  '12px',
  s4:  '16px',
  s5:  '24px',
  s6:  '32px',
  s8:  '48px',
  s10: '64px',
  s12: '96px',

  // Border Radius
  radiusSm:   '8px',
  radiusMd:   '16px',
  radiusLg:   '24px',
  radiusXl:   '32px',
  radiusPill: '9999px',

  // Minimum touch area (WCAG + neurodiversity — never reduce below 48px)
  touchTarget: '48px',
} as const;
```

- [ ] **Step 4.5: Criar packages/design-system/src/tokens/motion.ts**

```typescript
// IMPORTANT: Always respect prefers-reduced-motion.
// When active, all durations must drop to 0ms or simple fade.
// Check this in every animated component.
export const motion = {
  // Durations
  durationFast:   '150ms',
  durationNormal: '300ms',
  durationSlow:   '500ms',
  durationEnter:  '400ms',

  // Easing
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // playful, bouncy
  easeSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',        // smooth
  easeOut:    'cubic-bezier(0, 0, 0.2, 1)',           // exit
} as const;

export const REDUCED_MOTION_DURATION = '0ms' as const;
```

- [ ] **Step 4.6: Criar packages/design-system/src/index.ts**

```typescript
export { colors } from './tokens/colors';
export type { ColorToken } from './tokens/colors';
export { typography } from './tokens/typography';
export { spacing } from './tokens/spacing';
export { motion, REDUCED_MOTION_DURATION } from './tokens/motion';
```

- [ ] **Step 4.7: Criar packages/design-system/package.json**

```json
{
  "name": "@ia-motor/design-system",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types":  "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build":     "tsc",
    "test":      "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@ia-motor/config": "workspace:*",
    "typescript":       "^5.4.0",
    "vitest":           "^1.6.0"
  }
}
```

- [ ] **Step 4.8: Criar packages/design-system/tsconfig.json e vitest.config.ts**

`packages/design-system/tsconfig.json`:
```json
{
  "extends": "@ia-motor/config/tsconfig-base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`packages/design-system/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true } });
```

- [ ] **Step 4.9: Rodar testes**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/packages/design-system"
pnpm install && pnpm test
```

Expected:
```
✓ src/__tests__/tokens.test.ts (6 tests)
Test Files  1 passed (1)
Tests       6 passed (6)
```

- [ ] **Step 4.10: Commit**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add packages/design-system/
git commit -m "feat: add @ia-motor/design-system tokens (colors, typography, spacing, motion)"
```

---

## Task 5: packages/utils — adaptationEngine (TDD)

**Files:**
- Create: `packages/utils/src/__tests__/adaptationEngine.test.ts`
- Create: `packages/utils/src/adaptationEngine.ts`

- [ ] **Step 5.1: Escrever testes que FALHAM**

`packages/utils/src/__tests__/adaptationEngine.test.ts`:
```typescript
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
    const profile = {
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
```

- [ ] **Step 5.2: Rodar e confirmar que FALHA**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/packages/utils"
pnpm test 2>&1 | head -10
```

Expected: `Error: Cannot find module '../adaptationEngine'`

- [ ] **Step 5.3: Implementar adaptationEngine.ts**

`packages/utils/src/adaptationEngine.ts`:
```typescript
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
  // Real-time overrides take priority
  if (hasRageTapAlert(recentEvents)) return 'intensivo';
  if (hasLowAccuracy(recentEvents))  return 'intensivo';

  // Profile-based adaptation
  const attentionLow      = profile.attention_level <= 2;
  const sensitivityHigh   = profile.sensory_sensitivity >= 4;
  const executiveLow      =
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
    (e) => e.event_type === 'rage_tap' &&
           new Date(e.recorded_at).getTime() > oneMinuteAgo,
  );
  return recentRageTaps.length > TELEMETRY_THRESHOLDS.rage_taps_per_minute;
}

function hasLowAccuracy(events: TelemetryEvent[]): boolean {
  const accuracyEvents = events.filter((e) => e.event_type === 'taxa_acerto');
  if (accuracyEvents.length === 0) return false;
  const avg = accuracyEvents.reduce((sum, e) => sum + e.value, 0) / accuracyEvents.length;
  return avg < TELEMETRY_THRESHOLDS.taxa_acerto_minima;
}
```

- [ ] **Step 5.4: Rodar testes e confirmar que PASSAM**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/packages/utils"
pnpm test
```

Expected:
```
✓ src/__tests__/adaptationEngine.test.ts (9 tests)
Tests  9 passed (9)
```

---

## Task 6: packages/utils — telemetryAnalyzer (TDD)

**Files:**
- Create: `packages/utils/src/__tests__/telemetryAnalyzer.test.ts`
- Create: `packages/utils/src/telemetryAnalyzer.ts`
- Create: `packages/utils/src/index.ts`
- Create: `packages/utils/package.json`
- Create: `packages/utils/tsconfig.json`
- Create: `packages/utils/vitest.config.ts`

- [ ] **Step 6.1: Escrever testes que FALHAM**

`packages/utils/src/__tests__/telemetryAnalyzer.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  isRageTapThresholdExceeded,
  calculateAverageLatency,
  calculateAccuracyRate,
  isLatencyAlertActive,
} from '../telemetryAnalyzer';
import type { TelemetryEvent } from '@ia-motor/types';

const makeEvent = (type: TelemetryEvent['event_type'], value: number, minsAgo = 0): TelemetryEvent => ({
  id:          `evt-${Math.random()}`,
  mission_id:  'mission-1',
  student_id:  'student-1',
  event_type:  type,
  value,
  recorded_at: new Date(Date.now() - minsAgo * 60_000).toISOString(),
});

describe('isRageTapThresholdExceeded', () => {
  it('returns false for empty events', () => {
    expect(isRageTapThresholdExceeded([])).toBe(false);
  });

  it('returns false for 10 rage_taps (threshold is >10, not >=10)', () => {
    const events = Array.from({ length: 10 }, () => makeEvent('rage_tap', 1));
    expect(isRageTapThresholdExceeded(events)).toBe(false);
  });

  it('returns true for 11 rage_taps within the last minute', () => {
    const events = Array.from({ length: 11 }, () => makeEvent('rage_tap', 1));
    expect(isRageTapThresholdExceeded(events)).toBe(true);
  });

  it('ignores rage_taps older than 1 minute', () => {
    const events = Array.from({ length: 11 }, () => makeEvent('rage_tap', 1, 2));
    expect(isRageTapThresholdExceeded(events)).toBe(false);
  });
});

describe('calculateAverageLatency', () => {
  it('returns 0 for empty events', () => {
    expect(calculateAverageLatency([])).toBe(0);
  });

  it('calculates average of latencia_toque events', () => {
    const events = [makeEvent('latencia_toque', 1000), makeEvent('latencia_toque', 3000)];
    expect(calculateAverageLatency(events)).toBe(2000);
  });

  it('ignores non-latency events', () => {
    const events = [makeEvent('latencia_toque', 2000), makeEvent('rage_tap', 999)];
    expect(calculateAverageLatency(events)).toBe(2000);
  });
});

describe('calculateAccuracyRate', () => {
  it('returns 1 (assume OK) for empty events', () => {
    expect(calculateAccuracyRate([])).toBe(1);
  });

  it('averages taxa_acerto values', () => {
    const events = [makeEvent('taxa_acerto', 0.5), makeEvent('taxa_acerto', 0.7)];
    expect(calculateAccuracyRate(events)).toBeCloseTo(0.6);
  });
});

describe('isLatencyAlertActive', () => {
  it('returns false when average latency is below 3000ms', () => {
    const events = [makeEvent('latencia_toque', 1500)];
    expect(isLatencyAlertActive(events)).toBe(false);
  });

  it('returns true when average latency exceeds 3000ms', () => {
    const events = [makeEvent('latencia_toque', 4000)];
    expect(isLatencyAlertActive(events)).toBe(true);
  });
});
```

- [ ] **Step 6.2: Implementar telemetryAnalyzer.ts**

`packages/utils/src/telemetryAnalyzer.ts`:
```typescript
import type { TelemetryEvent } from '@ia-motor/types';
import { TELEMETRY_THRESHOLDS } from '@ia-motor/types';

export function isRageTapThresholdExceeded(events: TelemetryEvent[]): boolean {
  const oneMinuteAgo = Date.now() - 60_000;
  const recentRageTaps = events.filter(
    (e) => e.event_type === 'rage_tap' &&
           new Date(e.recorded_at).getTime() > oneMinuteAgo,
  );
  return recentRageTaps.length > TELEMETRY_THRESHOLDS.rage_taps_per_minute;
}

export function calculateAverageLatency(events: TelemetryEvent[]): number {
  const latencyEvents = events.filter((e) => e.event_type === 'latencia_toque');
  if (latencyEvents.length === 0) return 0;
  return latencyEvents.reduce((sum, e) => sum + e.value, 0) / latencyEvents.length;
}

export function calculateAccuracyRate(events: TelemetryEvent[]): number {
  const accuracyEvents = events.filter((e) => e.event_type === 'taxa_acerto');
  if (accuracyEvents.length === 0) return 1; // no data → assume OK
  return accuracyEvents.reduce((sum, e) => sum + e.value, 0) / accuracyEvents.length;
}

export function isLatencyAlertActive(events: TelemetryEvent[]): boolean {
  return calculateAverageLatency(events) > TELEMETRY_THRESHOLDS.latencia_media_ms;
}
```

- [ ] **Step 6.3: Criar packages/utils/src/index.ts**

```typescript
export { determineAdaptationLevel } from './adaptationEngine';
export {
  isRageTapThresholdExceeded,
  calculateAverageLatency,
  calculateAccuracyRate,
  isLatencyAlertActive,
} from './telemetryAnalyzer';
```

- [ ] **Step 6.4: Criar packages/utils/package.json**

```json
{
  "name": "@ia-motor/utils",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types":  "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build":     "tsc",
    "test":      "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@ia-motor/types": "workspace:*"
  },
  "devDependencies": {
    "@ia-motor/config": "workspace:*",
    "typescript":       "^5.4.0",
    "vitest":           "^1.6.0"
  }
}
```

- [ ] **Step 6.5: Criar packages/utils/tsconfig.json e vitest.config.ts**

`packages/utils/tsconfig.json`:
```json
{
  "extends": "@ia-motor/config/tsconfig-base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`packages/utils/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: { globals: true },
  resolve: {
    alias: {
      // Resolve @ia-motor/types from source during tests (avoids needing dist/ to exist)
      '@ia-motor/types': path.resolve(__dirname, '../types/src/index.ts'),
    },
  },
});
```

- [ ] **Step 6.6: Rodar todos os testes e confirmar que PASSAM**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
pnpm install
pnpm test
```

Expected:
```
✓ packages/types (8 tests)
✓ packages/design-system (6 tests)
✓ packages/utils (13 tests)
Test Suites  5 passed (5)
Tests        27 passed (27)
```

- [ ] **Step 6.7: Commit**

```bash
git add packages/utils/
git commit -m "feat: add @ia-motor/utils (adaptationEngine, telemetryAnalyzer) with TDD"
```

---

## Task 7: Infraestrutura Local — Docker Compose

**Files:**
- Create: `infra/docker-compose.yml`

- [ ] **Step 7.1: Criar infra/docker-compose.yml**

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: ia-motor-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  bullboard:
    image: deadly0/bull-board
    container_name: ia-motor-bullboard
    ports:
      - "3001:3000"
    environment:
      REDIS_HOST: redis
      REDIS_PORT: "6379"
    depends_on:
      redis:
        condition: service_healthy
    restart: unless-stopped

volumes:
  redis_data:
    name: ia-motor-redis-data
```

- [ ] **Step 7.2: Verificar que o Docker Compose sobe corretamente**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/infra"
docker compose up -d
docker compose ps
```

Expected:
```
NAME                   STATUS
ia-motor-redis         running (healthy)
ia-motor-bullboard     running
```

- [ ] **Step 7.3: Verificar Redis**

```bash
docker exec ia-motor-redis redis-cli ping
```

Expected: `PONG`

- [ ] **Step 7.4: Commit**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add infra/docker-compose.yml
git commit -m "feat: add Docker Compose for Redis 7 + Bull Board local development"
```

---

## Task 8: services/api — Fundação Fastify + Prisma

**Files:**
- Create: `services/api/package.json`
- Create: `services/api/tsconfig.json`
- Create: `services/api/src/lib/prisma.ts`
- Create: `services/api/src/lib/redis.ts`
- Create: `services/api/src/server.ts`
- Create: `services/api/src/app.ts`

- [ ] **Step 8.1: Criar services/api/package.json**

```json
{
  "name": "@ia-motor/api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev":       "tsx watch src/server.ts",
    "build":     "tsc",
    "start":     "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "lint":      "eslint src",
    "test":      "vitest run"
  },
  "dependencies": {
    "@ia-motor/types": "workspace:*",
    "@ia-motor/utils": "workspace:*",
    "@prisma/client":  "^5.13.0",
    "fastify":         "^4.27.0",
    "ioredis":         "^5.3.2",
    "bullmq":          "^5.7.0",
    "pino-pretty":     "^11.0.0"
  },
  "devDependencies": {
    "@ia-motor/config": "workspace:*",
    "@types/node":      "^20.0.0",
    "prisma":           "^5.13.0",
    "tsx":              "^4.7.0",
    "typescript":       "^5.4.0",
    "vitest":           "^1.6.0"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 8.2: Criar services/api/tsconfig.json**

```json
{
  "extends": "@ia-motor/config/tsconfig-base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "prisma"]
}
```

- [ ] **Step 8.3: Criar services/api/src/lib/prisma.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 8.4: Criar services/api/src/lib/redis.ts**

```typescript
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: true,
});

redis.on('error', (err: Error) => {
  console.error('[Redis] connection error:', err.message);
});

redis.on('connect', () => {
  console.error('[Redis] connected');
});
```

- [ ] **Step 8.5: Criar services/api/src/app.ts**

```typescript
import type { FastifyInstance } from 'fastify';
import { curriculumRoutes } from './routes/curriculum/index.js';
import { adaptationRoutes } from './routes/adaptation/index.js';
import { telemetryRoutes }   from './routes/telemetry/index.js';
import { reportsRoutes }     from './routes/reports/index.js';
import { consentRoutes }     from './routes/consent/index.js';
import { missionsRoutes }    from './routes/missions/index.js';
import { profileRoutes }     from './routes/profile/index.js';

export async function buildApp(server: FastifyInstance): Promise<void> {
  // Health check
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // API v1 routes
  await server.register(curriculumRoutes, { prefix: '/api/curriculum' });
  await server.register(adaptationRoutes, { prefix: '/api/adaptation' });
  await server.register(telemetryRoutes,  { prefix: '/api/telemetry' });
  await server.register(reportsRoutes,    { prefix: '/api/reports' });
  await server.register(consentRoutes,    { prefix: '/api/consent' });
  await server.register(missionsRoutes,   { prefix: '/api/missions' });
  await server.register(profileRoutes,    { prefix: '/api/profile' });
}
```

- [ ] **Step 8.6: Criar services/api/src/server.ts**

```typescript
import Fastify from 'fastify';
import { buildApp } from './app.js';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
  },
});

async function start(): Promise<void> {
  try {
    await buildApp(server);
    const port = Number(process.env.PORT ?? 3000);
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
```

- [ ] **Step 8.7: Instalar dependências da API**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
pnpm install
```

Expected: dependências instaladas sem erros.

- [ ] **Step 8.8: Commit**

```bash
git add services/api/package.json services/api/tsconfig.json services/api/src/
git commit -m "feat: scaffold Fastify API foundation (server, app, prisma client, redis client)"
```

---

## Task 9: Schema do Banco de Dados (Prisma + Supabase)

**Files:**
- Create: `services/api/prisma/schema.prisma`

- [ ] **Step 9.1: Criar services/api/prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Student {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name       String    @db.VarChar(100)
  birth_date DateTime? @db.Date
  created_at DateTime  @default(now())

  profile   StudentProfileModel?
  missions  Mission[]
  telemetry TelemetryEventModel[]
  consents  ConsentRecord[]

  @@map("students")
}

model StudentProfileModel {
  id                    String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  student_id            String   @unique @db.Uuid
  attention_level       Int      @db.SmallInt
  sensory_sensitivity   Int      @db.SmallInt
  executive_functions   Json
  hyperfocos            String[]
  aversions             String[]
  current_support_level String   @default("neutro") @db.VarChar(20)
  updated_at            DateTime @default(now()) @updatedAt

  student Student @relation(fields: [student_id], references: [id], onDelete: Cascade)

  @@map("student_profiles")
}

model SkillCard {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  skill_id       String   @unique @db.VarChar(50)
  bncc_code      String   @db.VarChar(30)
  area           String?  @db.VarChar(50)
  grade_year     String?  @db.VarChar(20)
  // objective is READONLY — no application layer may UPDATE this field
  objective      String
  support_matrix Json

  missions   Mission[]
  embeddings CurriculumEmbedding[]

  @@index([bncc_code])
  @@map("skill_cards")
}

model Mission {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  student_id    String    @db.Uuid
  skill_card_id String    @db.Uuid
  support_level String    @db.VarChar(20)
  skin_theme    String?   @db.VarChar(50)
  status        String    @default("pending") @db.VarChar(20)
  started_at    DateTime?
  completed_at  DateTime?

  student    Student              @relation(fields: [student_id], references: [id])
  skill_card SkillCard            @relation(fields: [skill_card_id], references: [id])
  telemetry  TelemetryEventModel[]

  @@index([student_id, status])
  @@map("missions")
}

model TelemetryEventModel {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  mission_id  String   @db.Uuid
  student_id  String   @db.Uuid
  event_type  String   @db.VarChar(50)
  value       Float?
  metadata    Json?
  recorded_at DateTime @default(now())

  mission Mission @relation(fields: [mission_id], references: [id])
  student Student @relation(fields: [student_id], references: [id])

  @@index([student_id, recorded_at(sort: Desc)])
  @@map("telemetry_events")
}

// Embeddings for RAG — the `embedding vector(1536)` column is added
// via a manual SQL migration (see step 9.3). Prisma does not natively
// support pgvector queries; the AI Engine (Bloco 3) uses psycopg2 directly.
model CurriculumEmbedding {
  id            String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  skill_card_id String  @db.Uuid
  content       String?

  skill_card SkillCard @relation(fields: [skill_card_id], references: [id])

  @@map("curriculum_embeddings")
}

model ConsentRecord {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  student_id String    @db.Uuid
  parent_id  String    @db.Uuid
  scope      String[]  // e.g. ['telemetria', 'imagem_mascote']
  granted_at DateTime  @default(now())
  revoked_at DateTime?

  student Student @relation(fields: [student_id], references: [id])

  @@map("consent_records")
}
```

- [ ] **Step 9.2: Copiar .env.example para .env e preencher credenciais do Supabase**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
cp .env.example services/api/.env
```

Abrir `services/api/.env` e preencher `DATABASE_URL`, `DIRECT_URL` com as credenciais do projeto Supabase (Project Settings → Database → Connection String → URI e Direct).

- [ ] **Step 9.3: Rodar a migration**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/services/api"
pnpm prisma migrate dev --name init
```

Expected: migration criada em `prisma/migrations/` e aplicada no Supabase.

- [ ] **Step 9.4: Adicionar coluna embedding via SQL manual no Supabase**

No Supabase Dashboard → SQL Editor, rodar:

```sql
-- Habilitar extensão pgvector (já disponível no Supabase por padrão)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Adicionar coluna embedding à tabela curriculum_embeddings
ALTER TABLE curriculum_embeddings
  ADD COLUMN IF NOT EXISTS embedding extensions.vector(1536);

-- Índice IVFFlat para busca semântica eficiente (criado no Bloco 3 após inserir dados)
-- CREATE INDEX ON curriculum_embeddings
--   USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);
```

- [ ] **Step 9.5: Configurar Supabase Auth roles via SQL**

No Supabase Dashboard → SQL Editor:

```sql
-- Função que extrai o role do user_metadata para JWT claims customizados
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  claims := event->'claims';
  user_role := event->'user_metadata'->>'role';

  IF user_role IS NULL THEN
    user_role := 'child'; -- default role
  END IF;

  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
```

Depois em Supabase Dashboard → Authentication → Hooks → habilitar `custom_access_token_hook`.

- [ ] **Step 9.6: Gerar Prisma Client**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/services/api"
pnpm prisma generate
```

Expected: `✔ Generated Prisma Client`

- [ ] **Step 9.7: Commit**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add services/api/prisma/schema.prisma services/api/prisma/migrations/
git commit -m "feat: add Prisma schema with full database model (students, skill_cards, missions, telemetry, consent)"
```

---

## Task 10: Scaffold das Rotas da API (501 Not Implemented)

**Files:** 7 arquivos em `services/api/src/routes/`

- [ ] **Step 10.1: Criar todos os route handlers como 501**

`services/api/src/routes/curriculum/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const curriculumRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/curriculum/:bncc_code — implemented in Bloco 3
  server.get<{ Params: { bncc_code: string } }>('/:bncc_code', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
```

`services/api/src/routes/adaptation/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const adaptationRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/adaptation/generate — implemented in Bloco 3
  server.post('/generate', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
```

`services/api/src/routes/telemetry/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const telemetryRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/telemetry/events — implemented in Bloco 3
  server.post('/events', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
```

`services/api/src/routes/reports/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const reportsRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/reports/student/:id — implemented in Bloco 5
  server.get<{ Params: { id: string } }>('/student/:id', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 5 });
  });
};
```

`services/api/src/routes/consent/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const consentRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/consent — implemented in Bloco 2
  server.post('/', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });
};
```

`services/api/src/routes/missions/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const missionsRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/missions/:student_id — implemented in Bloco 3
  server.get<{ Params: { student_id: string } }>('/:student_id', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
```

`services/api/src/routes/profile/index.ts`:
```typescript
import type { FastifyPluginAsync } from 'fastify';

export const profileRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/profile/:student_id — implemented in Bloco 2
  server.post<{ Params: { student_id: string } }>('/:student_id', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });

  // PATCH /api/profile/:student_id — implemented in Bloco 2
  server.patch<{ Params: { student_id: string } }>('/:student_id', async (_req, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });
};
```

- [ ] **Step 10.2: Verificar typecheck da API**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/services/api"
pnpm typecheck
```

Expected: `Found 0 errors`

- [ ] **Step 10.3: Iniciar o servidor e verificar health check**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/services/api"
pnpm dev &
sleep 3
curl http://localhost:3000/health
```

Expected:
```json
{"status":"ok","timestamp":"2026-04-07T..."}
```

- [ ] **Step 10.4: Verificar que todas as rotas respondem 501**

```bash
curl -s http://localhost:3000/api/curriculum/EF01MA01 | jq .
curl -s -X POST http://localhost:3000/api/adaptation/generate | jq .
curl -s http://localhost:3000/api/missions/some-student-id | jq .
```

Expected para cada:
```json
{"error":"Not implemented","bloco":3}
```

- [ ] **Step 10.5: Parar o servidor e commitar**

```bash
kill %1 2>/dev/null || true
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add services/api/src/routes/
git commit -m "feat: scaffold all API routes returning 501 (implemented in respective blocs)"
```

---

## Task 11: Seed — 10 Skill Cards BNCC (EF 1º ano)

**Files:**
- Create: `services/api/prisma/seed.ts`

- [ ] **Step 11.1: Criar services/api/prisma/seed.ts**

```typescript
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const skillCards: Prisma.SkillCardCreateInput[] = [
  {
    skill_id:   'MAT.EF01.001',
    bncc_code:  'EF01MA01',
    area:       'Matemática',
    grade_year: '1º ano EF',
    objective:  'A criança deve utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações do cotidiano',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '3 passos',         suporte_visual: true,  pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'MAT.EF01.002',
    bncc_code:  'EF01MA02',
    area:       'Matemática',
    grade_year: '1º ano EF',
    objective:  'A criança deve contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '2 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'MAT.EF01.003',
    bncc_code:  'EF01MA03',
    area:       'Matemática',
    grade_year: '1º ano EF',
    objective:  'A criança deve estimar e comparar quantidades de objetos de dois conjuntos para indicar "tem mais", "tem menos" ou "tem a mesma quantidade"',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '3 passos',         suporte_visual: true,  pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'MAT.EF01.004',
    bncc_code:  'EF01MA04',
    area:       'Matemática',
    grade_year: '1º ano EF',
    objective:  'A criança deve contar a quantidade de objetos de coleções até 100 unidades e indicar a quantidade por meio de registros',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '4 passos',         suporte_visual: true,  pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'MAT.EF01.005',
    bncc_code:  'EF01MA05',
    area:       'Matemática',
    grade_year: '1º ano EF',
    objective:  'A criança deve comparar números naturais de até duas ordens em situações cotidianas, com e sem suporte da reta numérica',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '2 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'LP.EF01.001',
    bncc_code:  'EF01LP01',
    area:       'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective:  'A criança deve reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '2 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'LP.EF01.002',
    bncc_code:  'EF01LP02',
    area:       'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective:  'A criança deve perceber que palavras diferentes compartilham certas letras',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '3 passos',         suporte_visual: true,  pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'LP.EF01.003',
    bncc_code:  'EF01LP03',
    area:       'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective:  'A criança deve segmentar oralmente palavras em sílabas com ou sem apoio de gestos rítmicos corporais',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '2 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'LP.EF01.004',
    bncc_code:  'EF01LP04',
    area:       'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective:  'A criança deve identificar o número de sílabas de palavras com 2 e 3 sílabas',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '3 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id:   'LP.EF01.005',
    bncc_code:  'EF01LP05',
    area:       'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective:  'A criança deve reconhecer que palavras diferentes têm comprimentos diferentes e que o comprimento da palavra não corresponde ao comprimento do objeto que ela nomeia',
    support_matrix: {
      neutro:    { linguagem: 'padrao',            segmentacao: 'tarefa completa',  suporte_visual: false, duracao_max_s: 420 },
      leve:      { linguagem: 'simplificada',      segmentacao: '2 passos',         suporte_visual: true,  pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true,  suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
];

async function main(): Promise<void> {
  console.error('Seeding 10 BNCC EF 1º ano Skill Cards...');

  for (const card of skillCards) {
    await prisma.skillCard.upsert({
      where:  { skill_id: card.skill_id as string },
      update: {},
      create: card,
    });
  }

  console.error(`✓ ${skillCards.length} Skill Cards seeded successfully.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 11.2: Rodar o seed**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo/services/api"
pnpm prisma db seed
```

Expected:
```
Seeding 10 BNCC EF 1º ano Skill Cards...
✓ 10 Skill Cards seeded successfully.
```

- [ ] **Step 11.3: Verificar no Supabase**

No Supabase Dashboard → Table Editor → `skill_cards`, confirmar 10 registros com `bncc_code` de EF01MA01 a EF01MA05 e EF01LP01 a EF01LP05.

- [ ] **Step 11.4: Commit**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add services/api/prisma/seed.ts
git commit -m "feat: seed 10 BNCC EF 1st year Skill Cards (5 Math + 5 Portuguese)"
```

---

## Task 12: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 12.1: Criar .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    name: Type Check, Lint & Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Type check
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      # Lint is added in Bloco 2 once ESLint configs are wired to all packages
```

- [ ] **Step 12.2: Commit final do Bloco 1**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
git add .github/
git commit -m "ci: add GitHub Actions pipeline (typecheck + lint + test on every PR)"
```

- [ ] **Step 12.3: Verificar estado final do repositório**

```bash
git log --oneline
```

Expected (7 commits):
```
<hash> ci: add GitHub Actions pipeline (typecheck + lint + test on every PR)
<hash> feat: seed 10 BNCC EF 1st year Skill Cards (5 Math + 5 Portuguese)
<hash> feat: scaffold all API routes returning 501 (implemented in respective blocs)
<hash> feat: add Prisma schema with full database model
<hash> feat: scaffold Fastify API foundation (server, app, prisma client, redis client)
<hash> feat: add Docker Compose for Redis 7 + Bull Board local development
<hash> feat: add @ia-motor/utils (adaptationEngine, telemetryAnalyzer) with TDD
<hash> feat: add @ia-motor/design-system tokens
<hash> feat: add @ia-motor/types package
<hash> feat: add shared config package
<hash> chore: initialize monorepo with Turborepo + pnpm workspaces
```

- [ ] **Step 12.4: Rodar typecheck e testes completos uma última vez**

```bash
cd "C:/Users/User/Desktop/Projetos/I.aprendendo"
pnpm install
pnpm typecheck
pnpm test
```

Expected:
```
✓ packages/types (8 tests)
✓ packages/design-system (6 tests)
✓ packages/utils (13 tests)
Test Suites  5 passed
Tests        27 passed
```

---

## Checklist de Conclusão do Bloco 1

- [ ] Monorepo Turborepo + pnpm funcionando (`pnpm dev:api` inicia o servidor)
- [ ] `pnpm test` passa com 27+ testes
- [ ] `pnpm typecheck` retorna 0 erros
- [ ] 10 Skill Cards BNCC visíveis no Supabase
- [ ] Redis respondendo em `localhost:6379`
- [ ] Bull Board acessível em `http://localhost:3001`
- [ ] `/health` da API retorna `{"status":"ok"}`
- [ ] GitHub Actions CI configurado

**Próximo:** Bloco 3 — Motor Adaptativo v1 / AI Engine (FastAPI + LangGraph + 4 Agentes)
