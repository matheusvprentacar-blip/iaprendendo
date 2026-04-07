# 🧠 Stack Completa — I.A Motor Adaptativo

---

## VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              I.A MOTOR ADAPTATIVO                           │
│                                                                             │
│   📱 MOBILE          🖥️ DESKTOP          ⚙️ BACKEND         🤖 AI ENGINE    │
│   React Native       Tauri + React       Fastify            LangGraph       │
│   Expo SDK 51        shadcn/ui           Node.js            LangChain       │
│   Reanimated 3       TypeScript          Prisma             GPT-4o / Claude │
│                                                                             │
│   🗄️ DATABASE         📡 INFRA           🔐 AUTH            📊 OBS          │
│   PostgreSQL 16       Supabase           Supabase Auth      Sentry          │
│   pgvector            Vercel / Railway   RBAC               PostHog         │
│   Redis               Docker             LGPD               Grafana         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 FRONTEND MOBILE — Interface da Criança

> Plataforma principal. Onde a criança vive o Overworld e as Missões.

| Categoria | Tecnologia | Versão | Por quê |
|---|---|---|---|
| **Framework** | React Native + Expo | SDK 51 | Cross-platform iOS/Android, ecossistema maduro |
| **Linguagem** | TypeScript | 5.x | Type safety, essencial para o schema do SkillCard |
| **Navegação** | Expo Router | v3 | File-based routing, deep linking nativo |
| **Animações** | Reanimated 3 | 3.x | 60fps no thread nativo, essencial para UX fluida |
| **Gráficos 2D** | React Native Skia | latest | Renderização vetorial para o Overworld/Mapa |
| **Game Engine** | Unity WebGL (embed) | LTS | Templates de mini-jogos (drag & drop, sequências) |
| **Estado Global** | Zustand | 4.x | Zero boilerplate, simples e performático |
| **Server State** | TanStack Query | v5 | Cache, sincronização, retry automático |
| **Formulários** | React Hook Form + Zod | latest | Validação tipada dos formulários de perfil |
| **Storage Offline** | MMKV | latest | 10x mais rápido que AsyncStorage para cache |
| **SQLite Local** | expo-sqlite | latest | Dados offline completos (missões sem internet) |
| **Audio** | expo-av | latest | Sons de feedback positivo, narração do mascote |
| **Câmera** | expo-camera | latest | Foto do brinquedo → mascote digital |
| **Acessibilidade** | React Native A11y | nativo | Screen readers, contraste, fonte ajustável |
| **Testes** | Jest + React Native Testing Library | latest | Testes unitários e de componente |
| **E2E** | Maestro | latest | Testes de fluxo mobile (mais simples que Detox) |

---

## 🖥️ FRONTEND DESKTOP — Dashboard Pais & Educadores

> Interface de relatórios, alertas e configuração do perfil do aluno.

| Categoria | Tecnologia | Versão | Por quê |
|---|---|---|---|
| **Framework** | Tauri | 2.x | App desktop nativo via Rust + WebView, leve e seguro |
| **UI Layer** | React 18 + TypeScript | 18.x / 5.x | Reutiliza componentes do monorepo |
| **Componentes** | shadcn/ui | latest | Componentes acessíveis, customizáveis, sem lock-in |
| **Primitivos** | Radix UI | latest | Base acessível (ARIA) para os componentes |
| **Estilo** | Tailwind CSS | 3.x | Utilitário, consistente com os tokens do Design System |
| **Formulários** | React Hook Form + Zod | latest | Formulários de configuração e perfil |
| **Gráficos** | Recharts | latest | Dashboard de telemetria pedagógica |
| **Tabelas** | TanStack Table | v8 | Relatórios de progresso com sorting/filter |
| **PDF Export** | React PDF | latest | Geração de relatório para terapeuta/escola |
| **Testes** | Vitest + Testing Library | latest | Testes unitários rápidos |
| **E2E** | Playwright | latest | Testes de fluxo do dashboard |

---

## ⚙️ BACKEND — API Principal

> Orquestra dados, autenticação, rotas e comunicação com o AI Engine.

| Categoria | Tecnologia | Versão | Por quê |
|---|---|---|---|
| **Framework** | Fastify | 4.x | 2x mais rápido que Express, schema validation nativo |
| **Linguagem** | TypeScript (Node.js 20) | LTS | Tipos compartilhados com o frontend via monorepo |
| **ORM** | Prisma | 5.x | Type-safe, migrations, integração com PostgreSQL |
| **Validação** | Zod | 3.x | Schemas compartilhados entre API e frontend |
| **Filas** | BullMQ | 4.x | Jobs assíncronos (geração de missões, relatórios) |
| **Websocket** | Fastify WS | latest | Telemetria em tempo real durante missões |
| **Cache** | ioredis (Redis client) | latest | Cache de perfis, sessões, resultados de RAG |
| **Testes** | Vitest + supertest | latest | Testes de rotas e integração |
| **Docs API** | Swagger/OpenAPI | auto | Gerado pelo Fastify automaticamente |

### Rotas principais
```
POST   /api/adaptation/generate        → Motor Adaptativo (gera SkillCard)
GET    /api/curriculum/:bncc_code      → Busca objetivo BNCC
POST   /api/telemetry/events           → Ingestão de eventos
GET    /api/reports/student/:id        → Relatório de progresso
POST   /api/consent                    → Registro de consentimento LGPD
GET    /api/missions/:student_id       → Missões pendentes
PATCH  /api/profile/:student_id        → Atualiza perfil pedagógico
```

---

## 🤖 AI ENGINE — Motor de IA

> Serviço Python separado. Responsável por toda a inteligência adaptativa.

| Categoria | Tecnologia | Versão | Por quê |
|---|---|---|---|
| **Framework** | FastAPI | 0.110+ | API assíncrona Python, auto-docs Swagger |
| **LLM Principal** | OpenAI GPT-4o | latest | Geração de conteúdo pedagógico adaptado |
| **LLM Backup** | Anthropic Claude 3.5 Sonnet | latest | Fallback e validação cruzada |
| **Orquestração** | LangGraph | latest | Grafo de agentes com estado (curriculum→adaptation→content→safety) |
| **RAG Pipeline** | LangChain | 0.2+ | Retrieval, chunking, prompt templates |
| **Embeddings** | text-embedding-3-small (OpenAI) | latest | Embeddings de 1536 dims para pgvector |
| **Vector Search** | pgvector (via psycopg2) | latest | Busca semântica dos objetivos BNCC |
| **Imagem Mascote** | Replicate API | latest | Stable Diffusion para brinquedo → avatar |
| **ML Telemetria** | scikit-learn | 1.4+ | Detecção de padrões de fadiga/frustração |
| **Validação** | Pydantic v2 | 2.x | Validação dos schemas (SkillCard, StudentProfile) |
| **Testes** | pytest + pytest-asyncio | latest | Testes dos agentes e pipelines |
| **Observ. IA** | LangSmith | latest | Rastreio de chamadas LLM e latência |

### Pipeline dos 4 Agentes
```
curriculum_agent   → Recupera objetivo BNCC via RAG (READ-ONLY)
        ↓
adaptation_agent   → Define nível de suporte (Neutro/Leve/Intensivo)
        ↓
content_agent      → Gera conteúdo + skin do hiperfoco
        ↓
safety_agent       → Valida guardrails → aprova ou descarta
        ↓
    SkillCard JSON (entregue ao backend)
```

---

## 🗄️ BANCO DE DADOS

| Categoria | Tecnologia | Por quê |
|---|---|---|
| **Banco Principal** | PostgreSQL 16 | Relacional robusto, suporta JSONB (support_matrix) |
| **Extensão Vetorial** | pgvector | Busca semântica dos embeddings BNCC no mesmo banco |
| **Cache / Sessões** | Redis 7 | Cache de perfis, filas BullMQ, sessões online |
| **Storage de Arquivos** | Supabase Storage | Fotos de brinquedos, avatares gerados, assets de skin |
| **Backup** | pg_dump + Supabase Backups | Backups diários automáticos |

### Índices críticos
```sql
-- Busca semântica (RAG)
CREATE INDEX ON curriculum_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Telemetria por aluno
CREATE INDEX ON telemetry_events (student_id, recorded_at DESC);

-- Missões por status
CREATE INDEX ON missions (student_id, status);
```

---

## 🔐 AUTENTICAÇÃO & SEGURANÇA

| Categoria | Tecnologia | Por quê |
|---|---|---|
| **Auth Provider** | Supabase Auth | JWT nativo, fácil integração com RLS |
| **RBAC** | Roles: `child`, `parent`, `educator`, `admin` | Controle granular de acesso |
| **Row Level Security** | PostgreSQL RLS | Pais só veem dados dos próprios filhos |
| **Consentimento** | Tabela `consent_records` customizada | Conformidade LGPD para menores |
| **Secrets** | Doppler / .env vault | Gerência de API keys (OpenAI, Replicate) |
| **Rate Limiting** | Fastify rate-limit | Proteção dos endpoints de IA |
| **CORS** | Fastify CORS | Whitelist de origens (mobile + desktop) |
| **Audit Log** | Tabela `audit_logs` | Registro de todas as ações sensíveis (LGPD) |

---

## 🏗️ INFRAESTRUTURA & DEPLOY

| Categoria | Tecnologia | Por quê |
|---|---|---|
| **Banco Gerenciado** | Supabase (PostgreSQL + pgvector) | Gerenciado, pgvector nativo, free tier generoso |
| **API Deploy** | Railway | Deploy simples Node.js, auto-scale |
| **AI Engine Deploy** | Fly.io | Suporte a Python + GPU inference |
| **CDN / Assets** | Cloudflare R2 + CDN | Assets de skin/mascote com baixa latência |
| **Mobile Build** | EAS Build (Expo) | CI/CD de builds iOS e Android na nuvem |
| **Desktop Build** | Tauri GitHub Actions | Build automático para Windows, Mac, Linux |
| **Containers Local** | Docker Compose | Dev environment (Postgres + Redis + pgvector) |

---

## 🛠️ DEVOPS & TOOLING

| Categoria | Tecnologia | Por quê |
|---|---|---|
| **Monorepo** | Turborepo | Build cache, paralelismo, shared packages |
| **Package Manager** | pnpm | Workspaces, mais rápido que npm/yarn |
| **CI/CD** | GitHub Actions | Pipelines de test, build e deploy |
| **Commits** | Conventional Commits + Commitlint | Padrão para changelog automático |
| **Changelog** | Changesets | Versionamento semântico dos packages |
| **Linting** | ESLint + Prettier | Formatação consistente |
| **Type Check** | TypeScript strict mode | Zero erros de tipo em CI |
| **Testes CI** | Vitest + Playwright + Maestro | Roda em todo PR |
| **Code Review** | PR template + CODEOWNERS | Revisão obrigatória em rotas sensíveis |

---

## 📊 OBSERVABILIDADE & MONITORAMENTO

| Categoria | Tecnologia | O que monitora |
|---|---|---|
| **Erros** | Sentry | Crashes mobile, erros de API, falhas do AI Engine |
| **Analytics** | PostHog | Funil de uso, eventos pedagógicos, retenção |
| **LLM Tracing** | LangSmith | Latência dos agentes, tokens consumidos, falhas de guardrail |
| **Infra** | Grafana + Prometheus | CPU/RAM/latência da API e do AI Engine |
| **Alertas** | PagerDuty / Slack webhook | `rage_taps` anômalos, falhas de safety_agent |
| **Uptime** | Better Uptime | Monitoramento de disponibilidade dos endpoints |

---

## 🧩 MONOREPO — MAPA DE PACOTES

```
ia-motor-adaptativo/               ← Turborepo root
│
├── apps/
│   ├── mobile/                    → React Native + Expo (criança)
│   └── desktop/                   → Tauri + React (pais/educadores)
│
├── packages/
│   ├── design-system/             → Tokens + componentes compartilhados
│   ├── types/                     → SkillCard, StudentProfile, Telemetry
│   ├── utils/                     → adaptationEngine, telemetryAnalyzer
│   └── config/                    → ESLint, TypeScript, Tailwind configs
│
└── services/
    ├── api/                       → Fastify (Node.js)
    └── ai-engine/                 → FastAPI (Python)
```

---

## 💰 CUSTO ESTIMADO (MVP)

| Serviço | Plano | Custo/mês |
|---|---|---|
| Supabase | Pro | ~$25 |
| Railway (API) | Starter | ~$10 |
| Fly.io (AI Engine) | Pay-as-you-go | ~$20-50 |
| OpenAI API | Pay-per-token | ~$30-100 (depende do uso) |
| Replicate (mascote) | Pay-per-run | ~$10 |
| Cloudflare R2 | Free tier | $0 |
| EAS Build | Free tier | $0 |
| Sentry | Free tier | $0 |
| PostHog | Free tier (1M eventos) | $0 |
| **TOTAL MVP** | | **~$100-200/mês** |

---

## ⚡ DECISÕES-CHAVE E ALTERNATIVAS

| Decisão | Escolhido | Alternativa descartada | Motivo |
|---|---|---|---|
| Mobile framework | React Native + Expo | Flutter | Ecossistema JS compartilhado com desktop |
| Desktop framework | Tauri | Electron | Tauri é 10x mais leve (Rust core) |
| Backend language | Node.js (Fastify) | Go / Django | Tipos compartilhados com frontend |
| AI orchestration | LangGraph | AutoGen / CrewAI | Grafo de estados mais controlável para guardrails |
| Vector DB | pgvector (no Postgres) | Pinecone / Weaviate | Evita um serviço a mais — tudo no mesmo banco |
| Auth | Supabase Auth | Auth0 / Clerk | Integração nativa com Postgres RLS |
| Game engine | Unity WebGL embed | Phaser.js | Assets de qualidade superior para engajamento |

---

Essa é a stack completa, end-to-end. Tudo pensado para escalar do MVP até um produto com múltiplos alunos, mantendo a conformidade LGPD e a segurança pedagógica como não-negociáveis.