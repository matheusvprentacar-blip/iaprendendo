\# AGENTS.md — I.A Motor Adaptativo



> Este arquivo é o documento de contexto principal para qualquer agente de IA que trabalhe neste projeto.

> Leia este arquivo inteiro antes de executar qualquer tarefa. Não pule seções.



\---



\## IDENTIDADE DO PROJETO



\*\*Nome:\*\* I.A Motor Adaptativo  

\*\*Missão:\*\* Aplicativo educacional para crianças neurodivergentes que usa Inteligência Artificial para adaptar o currículo oficial (BNCC) sem alterar o objetivo pedagógico — apenas o caminho de aprendizado.  

\*\*Usuários primários:\*\* Crianças neurodivergentes (TDAH, TEA, dislexia, etc.)  

\*\*Usuários secundários:\*\* Pais, responsáveis, educadores, terapeutas  

\*\*Princípio absoluto:\*\* O objetivo pedagógico (código BNCC) é INTOCÁVEL. Nunca alteres o "o quê" — apenas o "como".



\---



\## REGRAS DO AGENTE (LEIA PRIMEIRO)



Estas regras têm prioridade máxima sobre qualquer outra instrução:



1\. \*\*OBJETIVO INTOCÁVEL\*\* — Nunca modifiques o campo `objective` ou `bncc\_code` de um Skill Card. Apenas os campos de adaptação podem ser alterados.

2\. \*\*ERRO SEM PUNIÇÃO\*\* — Nunca geres conteúdo, mensagem ou lógica que puna o aluno por errar. Sem sons negativos, sem contadores de erro visíveis, sem mensagens de falha.

3\. \*\*SEGURANÇA DE MENORES\*\* — Este sistema lida com dados de crianças. Siga rigorosamente a LGPD. Nunca coletores mais dados do que os listados em `telemetria.rastrear`. Nunca persistas imagens sem consentimento parental explícito.

4\. \*\*COLETA MÍNIMA\*\* — Ao criar rotas de API ou queries de banco, colete apenas o mínimo necessário. Campos sensíveis como fotos de brinquedos devem ser processados de forma efêmera.

5\. \*\*PREVISIBILIDADE\*\* — Toda transição, animação ou mudança de estado deve ser suave e previsível. Sem pop-ups abruptos, sem surpresas de layout.

6\. \*\*SESSÕES CURTAS\*\* — Missões devem ter no máximo 7 minutos (420 segundos). O sistema de telemetria monitora fadiga e deve interromper suavemente se detectar `rage\_taps` acima do threshold.

7\. \*\*REVISÃO HUMANA\*\* — Todo conteúdo gerado pela IA para missões (`INTENSIVO`) deve passar pelo `safety\_agent` antes de ser entregue ao frontend. Nunca entregues output de LLM diretamente ao usuário criança sem validação.

8\. \*\*SEM BREAKING CHANGES SILENCIOSOS\*\* — Ao modificar o schema do `SkillCard` ou do `StudentProfile`, sempre atualiza os tipos em `packages/types/` e documenta a mudança neste arquivo na seção de Changelog.



\---



\## ARQUITETURA DO SISTEMA

```

┌──────────────────────────────────────────────────────────────────┐

│                     CAMADA DE APRESENTAÇÃO                       │

│                                                                  │

│   Mobile (React Native / Expo)     Desktop (Tauri + React)      │

│   ┌─────────────┐ ┌───────────┐    ┌───────────────────────┐   │

│   │  Overworld  │ │  Missão   │    │  Dashboard Pais /      │   │

│   │  (Hub World)│ │  (Game)   │    │  Educadores            │   │

│   └─────────────┘ └───────────┘    └───────────────────────┘   │

└──────────────────────────────────────────────────────────────────┘

&#x20;                              │

&#x20;                   API Gateway (REST / GraphQL)

&#x20;                    Auth: Supabase RBAC

&#x20;                              │

┌──────────────────────────────────────────────────────────────────┐

│                  CAMADA DE ORQUESTRAÇÃO DE IA                    │

│                                                                  │

│  ┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌────────────┐  │

│  │    Agente    │ │   Agente   │ │  Agente  │ │   Agente   │  │

│  │  Currículo   │ │  Adaptação │ │ Conteúdo │ │ Segurança  │  │

│  │  (BNCC/RAG)  │ │  (Matriz)  │ │(Gerador) │ │(Guardrails)│  │

│  └──────────────┘ └────────────┘ └──────────┘ └────────────┘  │

│                                                                  │

│             ┌──────────────────────────────────┐                │

│             │      MOTOR ADAPTATIVO (Core)      │                │

│             │  Entrada → RAG → Matriz →         │                │

│             │  SkillCard JSON → Missão          │                │

│             └──────────────────────────────────┘                │

└──────────────────────────────────────────────────────────────────┘

&#x20;                              │

┌──────────────────────────────────────────────────────────────────┐

│                        CAMADA DE DADOS                           │

│                                                                  │

│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────┐ │

│  │  PostgreSQL   │  │   pgvector   │  │     Redis Cache      │ │

│  │  (Perfis,     │  │  (Buscas     │  │  (Sessão / Offline)  │ │

│  │   Progresso)  │  │  Semânticas) │  │                      │ │

│  └───────────────┘  └──────────────┘  └──────────────────────┘ │

│                                                                  │

│  ┌──────────────────────────────────────────────────────────┐   │

│  │                  TELEMETRIA PEDAGÓGICA                    │   │

│  │  latência\_toque | precisão\_motora | rage\_taps | acerto   │   │

│  └──────────────────────────────────────────────────────────┘   │

└──────────────────────────────────────────────────────────────────┘

```



\---



\## FLUXO DO MOTOR ADAPTATIVO

```

\[Perfil do Aluno]

&#x20;     +

\[Currículo BNCC]  ──►  RAG (pgvector)  ──►  LLM (Gerador)

&#x20;     +                      │

\[Telemetria Real-time]       │  objetivo\_intocavel = true

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │    MATRIZ DE SUPORTE  │

&#x20;                 │  NEUTRO   → padrão   │

&#x20;                 │  LEVE     → simples  │

&#x20;                 │  INTENSIVO→ micro    │

&#x20;                 └──────────────────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │  safety\_agent valida  │

&#x20;                 └──────────────────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │   SKILL CARD (JSON)   │

&#x20;                 └──────────────────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                 Overworld → Missão (3-7 min)

```



\---



\## STACK TECNOLÓGICA



\### Mobile (Interface da Criança)

| Camada | Tecnologia |

|---|---|

| Framework | React Native + Expo SDK 51+ |

| Navegação | Expo Router (file-based) |

| Animações | Reanimated 3 + Skia |

| Estado Global | Zustand |

| Server State | React Query (TanStack Query v5) |

| Offline/Cache | MMKV + SQLite (expo-sqlite) |

| Telemetria | Hook customizado `useTelemetry()` |



\### Desktop (Dashboard Pais/Educadores)

| Camada | Tecnologia |

|---|---|

| Framework | Tauri 2.x + React 18 + TypeScript |

| UI Components | shadcn/ui + Radix UI primitives |

| Formulários | React Hook Form + Zod |

| Gráficos | Recharts |

| Tabelas | TanStack Table |



\### Backend

| Camada | Tecnologia |

|---|---|

| API Principal | Fastify (Node.js) ou FastAPI (Python) |

| ORM | Prisma (Node) / SQLAlchemy (Python) |

| Banco de Dados | PostgreSQL 16 + extensão pgvector |

| Cache | Redis 7 |

| Filas | BullMQ (Node) / Celery (Python) |

| Storage | Supabase Storage |



\### IA / Machine Learning

| Módulo | Tecnologia |

|---|---|

| LLM | OpenAI GPT-4o ou Anthropic Claude |

| RAG Pipeline | LangChain + pgvector |

| Orquestração Agentes | LangGraph ou CrewAI |

| Mascote (Vision) | Replicate API (Stable Diffusion) |

| Telemetria ML | Python scikit-learn |



\### Infraestrutura

| Serviço | Tecnologia |

|---|---|

| Auth | Supabase Auth (RBAC) |

| Hosting DB | Supabase (Postgres gerenciado) |

| Hosting API | Vercel / Railway / Fly.io |

| Monitoramento | Sentry (erros) + PostHog (analytics) |

| CI/CD | GitHub Actions |



\---



\## ESTRUTURA DE PASTAS

```

ia-motor-adaptativo/

├── apps/

│   ├── mobile/                        # React Native / Expo

│   │   ├── app/

│   │   │   ├── (auth)/                # Login, cadastro

│   │   │   ├── (child)/               # Interface da criança

│   │   │   │   ├── overworld/         # Mapa Hub World

│   │   │   │   ├── mission/\[id]/      # Missão ativa

│   │   │   │   └── mascot/            # Mascote mentor

│   │   │   └── (parent)/              # Interface dos pais

│   │   │       ├── dashboard/

│   │   │       └── settings/

│   │   ├── components/

│   │   │   ├── ui/                    # Primitivos do Design System

│   │   │   ├── game/                  # Componentes de missão/jogo

│   │   │   └── mascot/                # Componentes do mascote

│   │   ├── hooks/

│   │   │   ├── useTelemetry.ts        # Captura eventos pedagógicos

│   │   │   ├── useAdaptiveLevel.ts    # Lê nível atual do aluno

│   │   │   └── useOfflineSync.ts      # Sincronização offline

│   │   └── lib/

│   │       ├── telemetry.ts

│   │       └── offline.ts

│   │

│   └── desktop/                       # Tauri (pais/educadores)

│       └── src/

│           ├── pages/

│           │   ├── dashboard/

│           │   ├── reports/

│           │   └── settings/

│           └── components/

│

├── packages/

│   ├── design-system/                 # Tokens + Componentes compartilhados

│   │   ├── tokens/

│   │   │   ├── colors.ts

│   │   │   ├── typography.ts

│   │   │   ├── spacing.ts

│   │   │   └── motion.ts

│   │   └── components/

│   │       ├── MissionCard/

│   │       ├── ProgressBar/

│   │       ├── FeedbackBubble/

│   │       └── SensoryControls/

│   │

│   ├── types/                         # TypeScript types compartilhados

│   │   ├── SkillCard.ts               # Schema do Card de Habilidade

│   │   ├── StudentProfile.ts          # Perfil do aluno

│   │   ├── TelemetryEvent.ts          # Eventos de telemetria

│   │   └── Mission.ts                 # Estrutura de missão

│   │

│   └── utils/                         # Funções utilitárias

│       ├── adaptationEngine.ts        # Lógica da Matriz de Suporte

│       └── telemetryAnalyzer.ts       # Análise de fadiga/frustração

│

├── services/

│   ├── api/                           # Backend principal

│   │   ├── routes/

│   │   │   ├── curriculum/            # CRUD de Skill Cards (BNCC)

│   │   │   ├── profile/               # Perfil pedagógico do aluno

│   │   │   ├── adaptation/            # Motor Adaptativo

│   │   │   ├── telemetry/             # Ingestão de eventos

│   │   │   ├── reports/               # Dashboard de progresso

│   │   │   └── consent/               # Fluxo LGPD

│   │   └── middleware/

│   │       ├── auth.ts                # RBAC

│   │       └── lgpd.ts                # Auditoria de dados

│   │

│   └── ai-engine/                     # Serviço Python de IA

│       ├── agents/

│       │   ├── curriculum\_agent.py    # Busca objetivos na BNCC via RAG

│       │   ├── adaptation\_agent.py    # Aplica Matriz de Suporte

│       │   ├── content\_agent.py       # Gera conteúdo da missão

│       │   └── safety\_agent.py        # Guardrails e validação

│       ├── rag/

│       │   ├── embeddings.py          # Geração de embeddings

│       │   └── retriever.py           # Busca semântica pgvector

│       ├── mascot/

│       │   └── image\_pipeline.py      # Brinquedo → Avatar digital

│       └── telemetry/

│           └── ml\_analyzer.py         # Detecção de padrões de fadiga

│

├── docs/

│   ├── architecture/

│   ├── design-system/

│   └── api/

│

├── infra/

│   ├── docker-compose.yml             # PostgreSQL + pgvector + Redis local

│   └── .github/workflows/            # CI/CD

│

├── AGENTS.md                          # ← ESTE ARQUIVO

└── README.md

```



\---



\## DESIGN SYSTEM



\### Paleta de Cores

```ts

// packages/design-system/tokens/colors.ts



export const colors = {

&#x20; // Primárias — Interface da Criança

&#x20; adventurePurple:      '#7B2FBE',

&#x20; adventurePurpleLight: '#A855F7',

&#x20; sunshineYellow:       '#F59E0B',

&#x20; skyBlue:              '#0EA5E9',

&#x20; forestGreen:          '#10B981',

&#x20; coralRed:             '#F87171', // NUNCA use como "erro punitivo"



&#x20; // Fundos — Overworld

&#x20; bgDeep:               '#0F0A1E',

&#x20; bgCard:               '#1A1033',

&#x20; bgSurface:            '#251B47',



&#x20; // Texto

&#x20; textPrimary:          '#F8F4FF',

&#x20; textSecondary:        '#B8A9D9',

&#x20; textMuted:            '#6E5F8A',



&#x20; // Dashboard Pais/Educadores

&#x20; dashBg:               '#F8F7FF',

&#x20; dashSurface:          '#FFFFFF',

&#x20; dashBorder:           '#E5E0F5',

&#x20; dashAccent:           '#7B2FBE',

} as const;

```



\### Tipografia

```ts

// packages/design-system/tokens/typography.ts



export const typography = {

&#x20; // Fontes

&#x20; fontChild: '"Nunito", "Fredoka One", system-ui',  // Interface criança

&#x20; fontDash:  '"Inter", system-ui',                   // Dashboard adultos



&#x20; // Escala (base 16px)

&#x20; textXs:   '12px',

&#x20; textSm:   '14px',

&#x20; textMd:   '16px',

&#x20; textLg:   '20px',

&#x20; textXl:   '28px',

&#x20; text2Xl:  '36px',

&#x20; textHero: '48px',



&#x20; // Pesos

&#x20; fontRegular: 400,

&#x20; fontMedium:  500,

&#x20; fontBold:    700,

&#x20; fontBlack:   900,

} as const;

```



\### Spacing

```ts

// packages/design-system/tokens/spacing.ts



export const spacing = {

&#x20; // Sistema 8pt

&#x20; s1:  '4px',

&#x20; s2:  '8px',

&#x20; s3:  '12px',

&#x20; s4:  '16px',

&#x20; s5:  '24px',

&#x20; s6:  '32px',

&#x20; s8:  '48px',

&#x20; s10: '64px',

&#x20; s12: '96px',



&#x20; // Border Radius

&#x20; radiusSm:   '8px',

&#x20; radiusMd:   '16px',

&#x20; radiusLg:   '24px',

&#x20; radiusXl:   '32px',

&#x20; radiusPill: '9999px',



&#x20; // Área mínima de toque (WCAG + neurodivergência)

&#x20; touchTarget: '48px',

} as const;

```



\### Motion

```ts

// packages/design-system/tokens/motion.ts



export const motion = {

&#x20; // Durações

&#x20; durationFast:   '150ms',

&#x20; durationNormal: '300ms',

&#x20; durationSlow:   '500ms',

&#x20; durationEnter:  '400ms',



&#x20; // Easing

&#x20; easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // lúdico, bouncy

&#x20; easeSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',        // suave

&#x20; easeOut:    'cubic-bezier(0, 0, 0.2, 1)',           // saída

} as const;



// IMPORTANTE: Sempre respeita prefers-reduced-motion

// Quando ativo, todas as durações caem para 0ms ou fade simples

```



\### Componentes



\#### Interface da Criança (Mobile)



| Componente | Arquivo | Responsabilidade |

|---|---|---|

| `OverworldMap` | `components/game/OverworldMap/` | Mapa navegável com nós de missão |

| `MissionCard` | `components/game/MissionCard/` | Card de habilidade como missão |

| `MascotMentor` | `components/mascot/MascotMentor/` | Avatar animado do mentor |

| `MicroStep` | `components/game/MicroStep/` | Passo único de 30-120s |

| `ProgressBar` | `components/ui/ProgressBar/` | Barra de progresso sem countdown |

| `FeedbackBubble` | `components/ui/FeedbackBubble/` | Feedback positivo, sem punição |

| `SupportBadge` | `components/ui/SupportBadge/` | Indica nível ativo (N/L/I) |

| `RoutineStrip` | `components/ui/RoutineStrip/` | Faixa "primeiro-depois" |

| `SensoryControls` | `components/ui/SensoryControls/` | Controles de contraste/fonte/som |



\#### Dashboard (Desktop)



| Componente | Arquivo | Responsabilidade |

|---|---|---|

| `ProgressDashboard` | `pages/dashboard/` | Visão geral do progresso |

| `SkillMap` | `components/SkillMap/` | Mapa de habilidades BNCC |

| `AlertCard` | `components/AlertCard/` | Alerta de bloqueio do aluno |

| `TelemetryChart` | `components/TelemetryChart/` | Gráficos pedagógicos |

| `ConsentFlow` | `components/ConsentFlow/` | Fluxo de consentimento LGPD |

| `ExportReport` | `components/ExportReport/` | Export PDF/CSV de relatório |



\---



\## TIPOS TYPESCRIPT PRINCIPAIS



\### SkillCard

```ts

// packages/types/SkillCard.ts



export type SupportLevel = 'neutro' | 'leve' | 'intensivo';



export interface SupportConfig {

&#x20; linguagem: 'padrao' | 'simplificada' | 'explicita\_gradual';

&#x20; segmentacao: string;

&#x20; suporte\_visual: boolean;

&#x20; suporte\_auditivo?: boolean;

&#x20; pistas\_opcionais?: boolean;

&#x20; reducao\_itens\_tela?: boolean;

&#x20; duracao\_max\_s: number;

&#x20; modelo\_instrucao?: 'gradual\_release';

}



export interface SkillCard {

&#x20; skill\_id: string;              // ex: "MAT.EI.001"

&#x20; versao: string;                // semver ex: "1.0.0"

&#x20; bncc\_code: string;             // ex: "EF01MA01" — NUNCA ALTERAR

&#x20; habilidade: string;

&#x20; area: string;

&#x20; ano\_escolar: string;

&#x20; objetivo\_intocavel: string;    // READONLY — guardrail

&#x20; matriz\_suporte: Record<SupportLevel, SupportConfig>;

&#x20; skin\_hiperfoco?: {

&#x20;   tema: string;

&#x20;   objetivo\_inalterado: true;

&#x20;   assets: string\[];

&#x20; };

&#x20; missoes: MissionTemplate\[];

&#x20; telemetria: TelemetryConfig;

&#x20; created\_at: string;

&#x20; updated\_at: string;

}

```



\### StudentProfile

```ts

// packages/types/StudentProfile.ts



export interface StudentProfile {

&#x20; id: string;

&#x20; student\_id: string;

&#x20; attention\_level: 1 | 2 | 3 | 4 | 5;       // 1=muito baixo, 5=alto

&#x20; sensory\_sensitivity: 1 | 2 | 3 | 4 | 5;   // 1=baixa, 5=muito alta

&#x20; executive\_functions: {

&#x20;   planning: 1 | 2 | 3 | 4 | 5;

&#x20;   working\_memory: 1 | 2 | 3 | 4 | 5;

&#x20;   inhibitory\_control: 1 | 2 | 3 | 4 | 5;

&#x20; };

&#x20; hyperfocos: string\[];                       // ex: \["dinossauros", "trens"]

&#x20; aversions: string\[];                        // ex: \["sons altos", "textos longos"]

&#x20; current\_support\_level: SupportLevel;

&#x20; updated\_at: string;

}

```



\### TelemetryEvent

```ts

// packages/types/TelemetryEvent.ts



export type TelemetryEventType =

&#x20; | 'latencia\_toque'

&#x20; | 'precisao\_motora'

&#x20; | 'rage\_tap'

&#x20; | 'taxa\_acerto'

&#x20; | 'missao\_iniciada'

&#x20; | 'missao\_concluida'

&#x20; | 'missao\_abandonada'

&#x20; | 'nivel\_adaptado';



export interface TelemetryEvent {

&#x20; id: string;

&#x20; mission\_id: string;

&#x20; student\_id: string;

&#x20; event\_type: TelemetryEventType;

&#x20; value: number;

&#x20; metadata?: Record<string, unknown>;

&#x20; recorded\_at: string;

}



// Thresholds de alerta

export const TELEMETRY\_THRESHOLDS = {

&#x20; rage\_taps\_per\_minute: 10,    // acima disso → sugerir pausa

&#x20; latencia\_media\_ms: 3000,     // acima disso → possível confusão

&#x20; taxa\_acerto\_minima: 0.4,     // abaixo disso → escalar nível de suporte

} as const;

```



\---



\## SCHEMA JSON — SKILL CARD (Exemplo Completo)

```json

{

&#x20; "skill\_id": "MAT.EI.001",

&#x20; "versao": "1.0.0",

&#x20; "bncc\_code": "EF01MA01",

&#x20; "habilidade": "Reconhecer e comparar quantidades",

&#x20; "area": "Matemática",

&#x20; "ano\_escolar": "1º ano EF",

&#x20; "objetivo\_intocavel": "A criança deve reconhecer e comparar quantidades até 10",



&#x20; "matriz\_suporte": {

&#x20;   "neutro": {

&#x20;     "linguagem": "padrao",

&#x20;     "segmentacao": "tarefa completa",

&#x20;     "suporte\_visual": false,

&#x20;     "duracao\_max\_s": 420

&#x20;   },

&#x20;   "leve": {

&#x20;     "linguagem": "simplificada",

&#x20;     "segmentacao": "3 passos",

&#x20;     "suporte\_visual": true,

&#x20;     "pistas\_opcionais": true,

&#x20;     "reducao\_itens\_tela": true,

&#x20;     "duracao\_max\_s": 300

&#x20;   },

&#x20;   "intensivo": {

&#x20;     "linguagem": "explicita\_gradual",

&#x20;     "segmentacao": "micro\_passos\_30s",

&#x20;     "suporte\_visual": true,

&#x20;     "suporte\_auditivo": true,

&#x20;     "duracao\_max\_s": 180,

&#x20;     "modelo\_instrucao": "gradual\_release"

&#x20;   }

&#x20; },



&#x20; "skin\_hiperfoco": {

&#x20;   "tema": "dinossauros",

&#x20;   "objetivo\_inalterado": true,

&#x20;   "assets": \["dino\_icon.png", "bg\_jurassic.png"]

&#x20; },



&#x20; "missoes": \[

&#x20;   {

&#x20;     "id": "miss\_001",

&#x20;     "tipo": "drag\_drop",

&#x20;     "duracao\_s": 180,

&#x20;     "erro\_sem\_punicao": true,

&#x20;     "feedback\_imediato": true

&#x20;   }

&#x20; ],



&#x20; "telemetria": {

&#x20;   "rastrear": \["latencia\_toque", "precisao\_motora", "rage\_taps", "taxa\_acerto"],

&#x20;   "retencao\_dados\_dias": 90,

&#x20;   "lgpd\_consentimento\_exigido": true

&#x20; }

}

```



\---



\## MODELO DE DADOS (PostgreSQL)

```sql

\-- Alunos

CREATE TABLE students (

&#x20; id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; name        VARCHAR(100) NOT NULL,

&#x20; birth\_date  DATE,

&#x20; created\_at  TIMESTAMP DEFAULT NOW()

);



\-- Perfil Pedagógico

CREATE TABLE student\_profiles (

&#x20; id                   UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; student\_id           UUID REFERENCES students(id) ON DELETE CASCADE,

&#x20; attention\_level      SMALLINT CHECK (attention\_level BETWEEN 1 AND 5),

&#x20; sensory\_sensitivity  SMALLINT CHECK (sensory\_sensitivity BETWEEN 1 AND 5),

&#x20; executive\_functions  JSONB,

&#x20; hyperfocos           TEXT\[],

&#x20; aversions            TEXT\[],

&#x20; current\_support\_level VARCHAR(20) DEFAULT 'neutro',

&#x20; updated\_at           TIMESTAMP DEFAULT NOW()

);



\-- Cards de Habilidade

CREATE TABLE skill\_cards (

&#x20; id               UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; skill\_id         VARCHAR(50) UNIQUE NOT NULL,

&#x20; bncc\_code        VARCHAR(30) NOT NULL,

&#x20; area             VARCHAR(50),

&#x20; grade\_year       VARCHAR(20),

&#x20; objective        TEXT NOT NULL, -- READONLY via app

&#x20; support\_matrix   JSONB NOT NULL,

&#x20; created\_at       TIMESTAMP DEFAULT NOW()

);



\-- Missões

CREATE TABLE missions (

&#x20; id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; student\_id      UUID REFERENCES students(id),

&#x20; skill\_card\_id   UUID REFERENCES skill\_cards(id),

&#x20; support\_level   VARCHAR(20) NOT NULL,

&#x20; skin\_theme      VARCHAR(50),

&#x20; status          VARCHAR(20) DEFAULT 'pending',

&#x20; started\_at      TIMESTAMP,

&#x20; completed\_at    TIMESTAMP

);



\-- Telemetria Pedagógica

CREATE TABLE telemetry\_events (

&#x20; id           UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; mission\_id   UUID REFERENCES missions(id),

&#x20; student\_id   UUID REFERENCES students(id),

&#x20; event\_type   VARCHAR(50) NOT NULL,

&#x20; value        FLOAT,

&#x20; metadata     JSONB,

&#x20; recorded\_at  TIMESTAMP DEFAULT NOW()

);



\-- Embeddings BNCC para RAG (pgvector)

CREATE TABLE curriculum\_embeddings (

&#x20; id             UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; skill\_card\_id  UUID REFERENCES skill\_cards(id),

&#x20; embedding      vector(1536) NOT NULL,

&#x20; content        TEXT

);

CREATE INDEX ON curriculum\_embeddings

&#x20; USING ivfflat (embedding vector\_cosine\_ops)

&#x20; WITH (lists = 100);



\-- Consentimento Parental (LGPD)

CREATE TABLE consent\_records (

&#x20; id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20; student\_id  UUID REFERENCES students(id),

&#x20; parent\_id   UUID NOT NULL,

&#x20; scope       TEXT\[] NOT NULL,  -- ex: \['telemetria', 'imagem\_mascote']

&#x20; granted\_at  TIMESTAMP DEFAULT NOW(),

&#x20; revoked\_at  TIMESTAMP

);

```



\---



\## AGENTES DE IA



\### curriculum\_agent

\- \*\*Responsabilidade:\*\* Buscar no banco o objetivo oficial da BNCC usando RAG (pgvector).

\- \*\*Input:\*\* `bncc\_code` + query em linguagem natural.

\- \*\*Output:\*\* `{ skill\_id, objective, bncc\_code, embedding\_context }`.

\- \*\*Restrição:\*\* NUNCA modifica objetivos. Apenas recupera.



\### adaptation\_agent

\- \*\*Responsabilidade:\*\* Receber o perfil do aluno e a telemetria recente, e determinar o nível de suporte adequado (`neutro`, `leve`, `intensivo`).

\- \*\*Input:\*\* `StudentProfile` + últimos 10 eventos de `TelemetryEvent`.

\- \*\*Output:\*\* `{ recommended\_level: SupportLevel, justification: string }`.



\### content\_agent

\- \*\*Responsabilidade:\*\* Gerar o conteúdo textual e visual da missão com base no SkillCard + nível de suporte + tema do hiperfoco.

\- \*\*Input:\*\* `SkillCard` + `SupportLevel` + `hiperfoco\_tema`.

\- \*\*Output:\*\* `MissionContent { instrucoes: string\[], dicas: string\[], skin\_assets: string\[] }`.

\- \*\*Restrição:\*\* Output sempre vai para `safety\_agent` antes de ser entregue.



\### safety\_agent

\- \*\*Responsabilidade:\*\* Validar que o conteúdo gerado não contém punições, linguagem inadequada, objetivos alterados ou qualquer violação das Regras do Agente.

\- \*\*Input:\*\* Output do `content\_agent`.

\- \*\*Output:\*\* `{ approved: boolean, issues: string\[], sanitized\_content?: MissionContent }`.

\- \*\*Restrição:\*\* Se `approved = false`, o conteúdo é descartado e logado para revisão humana. NUNCA entregues ao frontend.



\---



\## ROADMAP — 6 SPRINTS (12 SEMANAS)

```

SPRINT 1 (Semanas 1-2): Fundação \& Currículo

&#x20; \[ ] Setup monorepo (Turborepo + pnpm workspaces)

&#x20; \[ ] Docker Compose: PostgreSQL + pgvector + Redis

&#x20; \[ ] Supabase Auth: roles (child, parent, educator, admin)

&#x20; \[ ] CRUD dos primeiros 10 Skill Cards (BNCC EF 1º ano)

&#x20; \[ ] Tipos TypeScript em packages/types/

&#x20; \[ ] CI/CD básico (GitHub Actions)



SPRINT 2 (Semanas 3-4): Perfil \& Acessibilidade

&#x20; \[ ] Onboarding de perfil do aluno (dimensões observáveis)

&#x20; \[ ] SensoryControls: contraste, tamanho de fonte, volume, velocidade

&#x20; \[ ] Suporte a prefers-reduced-motion

&#x20; \[ ] ConsentFlow: fluxo de consentimento parental (LGPD)

&#x20; \[ ] Middleware lgpd.ts (auditoria de rotas sensíveis)



SPRINT 3 (Semanas 5-6): Motor Adaptativo v1

&#x20; \[ ] Pipeline RAG: embeddings BNCC → pgvector

&#x20; \[ ] curriculum\_agent + adaptation\_agent

&#x20; \[ ] content\_agent + safety\_agent (guardrails)

&#x20; \[ ] Output JSON validado do SkillCard

&#x20; \[ ] Interface de revisão humana (admin)



SPRINT 4 (Semanas 7-8): Missões \& Gamificação v1

&#x20; \[ ] OverworldMap (Hub World navegável)

&#x20; \[ ] Templates de mini-jogos: drag\_drop, tap\_choice, sequência

&#x20; \[ ] Hook useTelemetry() + ingestão de eventos

&#x20; \[ ] MascotMentor (avatar estático + animação básica)

&#x20; \[ ] FeedbackBubble (positivo, sem punição)

&#x20; \[ ] RoutineStrip (primeiro-depois)



SPRINT 5 (Semanas 9-10): Relatórios \& Dashboard

&#x20; \[ ] Dashboard de progresso (Tauri/Desktop)

&#x20; \[ ] TelemetryChart (latência, acerto, rage\_taps)

&#x20; \[ ] AlertCard (aluno travado → threshold rage\_taps)

&#x20; \[ ] ml\_analyzer.py (detecção de padrões de fadiga)

&#x20; \[ ] Export PDF/CSV do relatório do aluno



SPRINT 6 (Semanas 11-12): LGPD, Segurança \& MVP

&#x20; \[ ] Audit log completo (todas as ações sensíveis)

&#x20; \[ ] RBAC refinado (controle granular por role)

&#x20; \[ ] Pipeline do mascote (foto brinquedo → avatar digital)

&#x20; \[ ] Testes de usabilidade com crianças neurodivergentes

&#x20; \[ ] Sentry + PostHog configurados

&#x20; \[ ] README.md completo

&#x20; \[ ] MVP pronto para piloto controlado

```



\---



\## CONVENÇÕES DE CÓDIGO



\- \*\*Commits:\*\* Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

\- \*\*Branch:\*\* `main` (produção) | `develop` (desenvolvimento) | `feat/nome-da-feature`

\- \*\*Testes:\*\* Vitest (unitários) + Playwright (e2e)

\- \*\*Linting:\*\* ESLint + Prettier (`.eslintrc` na raiz)

\- \*\*Idioma do código:\*\* Inglês (variáveis, funções, comentários técnicos)

\- \*\*Idioma do produto:\*\* Português (conteúdo pedagógico, UI da criança)



\---



\## GLOSSÁRIO



| Termo | Definição |

|---|---|

| \*\*Motor Adaptativo\*\* | Sistema central de IA que cruza perfil + currículo + telemetria para gerar a missão ideal |

| \*\*Skill Card\*\* | Unidade mínima de aprendizado em formato JSON. Contém o objetivo BNCC + 3 níveis de adaptação |

| \*\*Matriz de Suporte\*\* | Conjunto de configurações que define como adaptar uma habilidade (Neutro/Leve/Intensivo) |

| \*\*Overworld\*\* | Mapa navegável do jogo (estilo Hub World/Cuphead) onde as missões são selecionadas |

| \*\*Missão\*\* | Sessão de aprendizado gamificada de 3-7 minutos baseada em um Skill Card |

| \*\*Mascote-Mentor\*\* | Avatar digital gerado a partir de foto de brinquedo real. Guia a criança nas missões |

| \*\*Hiperfoco\*\* | Interesse intenso da criança usado como "skin" temática sobre o conteúdo pedagógico |

| \*\*Skin\*\* | Camada visual/temática aplicada sobre a missão sem alterar o objetivo |

| \*\*Telemetria Pedagógica\*\* | Métricas comportamentais coletadas durante missões (latência, precisão, rage taps) |

| \*\*Rage Tap\*\* | Cliques rápidos por frustração — indicador de sobrecarga sensorial ou cognitiva |

| \*\*Guardrails\*\* | Regras de segurança do safety\_agent que impedem output inadequado da IA |

| \*\*RAG\*\* | Retrieval-Augmented Generation — técnica que ancora o LLM nos objetivos reais da BNCC |

| \*\*BNCC\*\* | Base Nacional Comum Curricular — currículo oficial brasileiro |

| \*\*LGPD\*\* | Lei Geral de Proteção de Dados — exige consentimento parental para dados de menores |



\---



\## CHANGELOG DESTE ARQUIVO



| Data | Versão | Mudança |

|---|---|---|

| 2026-04-07 | 1.0.0 | Criação inicial do documento |



\---



\*Última atualização: 2026-04-07 — Gerado com base nas 12 fontes do NotebookLM "I.A Motor Adaptativo"\*

