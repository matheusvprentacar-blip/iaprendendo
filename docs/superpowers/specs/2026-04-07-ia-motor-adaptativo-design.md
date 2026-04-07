# Design Spec — I.A Motor Adaptativo

**Data:** 2026-04-07
**Status:** Aprovado
**Abordagem:** AI-Core First
**Dev:** Solo

---

## Contexto

Aplicativo educacional para crianças neurodivergentes (TDAH, TEA, dislexia) que usa IA para adaptar o currículo oficial BNCC sem alterar o objetivo pedagógico — apenas o caminho de aprendizado. O princípio absoluto é: o objetivo pedagógico (`bncc_code` + `objetivo_intocavel`) nunca é modificado, apenas a forma de ensiná-lo.

**Usuários primários:** crianças neurodivergentes
**Usuários secundários:** pais, responsáveis, educadores, terapeutas

---

## Decisões de Design

| Decisão | Escolha | Motivo |
|---|---|---|
| Ordem de construção | AI-Core First (1→3→2→4→5→6) | Valida a hipótese central (IA adaptativa) o mais rápido possível |
| MVP goal | Motor de IA: 4 agentes gerando SkillCards válidos | Validar a hipótese antes de construir interfaces |
| LLM primário | OpenAI GPT-4o | Como documentado no AGENTS.md |
| LLM fallback | Anthropic Claude 3.5 Sonnet | Fallback automático em erro/timeout |
| Ambiente de desenvolvimento | Híbrido: Supabase cloud + API/AI Engine local | Banco gerenciado sem custo de setup, iteração rápida local |
| Pipeline do mascote | Pós-MVP v1.1 (Replicate/Stable Diffusion) | Complexidade alta, não bloqueia o valor central |

---

## Arquitetura Geral

```
CAMADA DE APRESENTAÇÃO
┌──────────────────┐   ┌─────────────────────────┐
│  apps/mobile     │   │  apps/desktop            │
│  React Native    │   │  Tauri 2.x + React 18    │
│  Expo SDK 51     │   │  shadcn/ui + Tailwind     │
│  (Bloco 4)       │   │  (Bloco 5)               │
└──────────────────┘   └─────────────────────────┘
         │                          │
         └──────────┬───────────────┘
                    ▼ REST / WebSocket
┌─────────────────────────────────────────────────┐
│  services/api  (Bloco 1 scaffold, Bloco 3 impl) │
│  Fastify 4.x · Node.js 20 · Prisma 5 · BullMQ  │
└─────────────────────────────────────────────────┘
                    ▼ HTTP interno
┌─────────────────────────────────────────────────┐
│  services/ai-engine  (Bloco 3)                  │
│  FastAPI · LangGraph · LangChain · Pydantic v2  │
│  curriculum_agent → adaptation_agent →          │
│  content_agent → safety_agent                   │
└─────────────────────────────────────────────────┘
                    ▼
┌───────────────┐  ┌───────────────┐  ┌──────────┐
│ PostgreSQL 16 │  │   pgvector    │  │ Redis 7  │
│ Supabase cloud│  │ Supabase cloud│  │  local   │
└───────────────┘  └───────────────┘  └──────────┘

packages/types · packages/design-system · packages/utils
→ compartilhados entre todos os apps e services
```

### Fluxo central do Motor Adaptativo

```
POST /api/adaptation/generate
  { student_id, bncc_code, hiperfoco_tema }
        │
        ▼
  Fastify API → job na fila BullMQ (Redis)
        │
        ▼
  AI Engine consumer pega job
        │
        ├─ curriculum_agent  → busca objetivo BNCC via RAG (pgvector)
        ├─ adaptation_agent  → define SupportLevel (neutro/leve/intensivo)
        ├─ content_agent     → gera conteúdo + skin hiperfoco (GPT-4o)
        └─ safety_agent      → valida guardrails
              │
              ├─ approved=true  → SkillCard salvo no PostgreSQL
              └─ approved=false → descartado + logado + fila revisão humana

GET /api/missions/:student_id → retorna missões prontas
```

---

## Os 6 Blocos

### Bloco 1 — Fundação & Tipos (obrigatório, primeiro)

**Entregáveis:**
- Monorepo: Turborepo + pnpm workspaces
- `packages/types/`: SkillCard, StudentProfile, TelemetryEvent, Mission
- `packages/design-system/tokens/`: colors, typography, spacing, motion
- `packages/utils/`: adaptationEngine.ts, telemetryAnalyzer.ts
- `packages/config/`: eslint-preset, tsconfig-base, tailwind-preset
- Schema PostgreSQL completo via Prisma migrations → Supabase
- Supabase Auth: roles `child`, `parent`, `educator`, `admin`
- 10 primeiros Skill Cards BNCC (EF 1º ano) — seed script
- `services/api/` scaffolded: todas as rotas com handlers vazios
- `infra/docker-compose.yml`: Redis 7 + Bull Board
- GitHub Actions CI: type-check + lint + test em todo PR

**Decisões técnicas:**
- Supabase cloud desde o início — banco gerenciado
- Redis via Docker Compose local durante desenvolvimento
- Prisma como ORM (compartilha tipos com frontend via monorepo)
- TypeScript strict mode em todos os workspaces

---

### Bloco 3 — Motor Adaptativo v1 / AI Engine (segundo na ordem)

**Entregáveis:**
- `services/ai-engine/` completo (FastAPI)
- Pipeline RAG: geração de embeddings dos 10 Skill Cards → pgvector
- LangGraph: grafo de agentes `curriculum → adaptation → content → safety`
- `curriculum_agent.py`: busca READ-ONLY via pgvector
- `adaptation_agent.py`: recebe StudentProfile mockado + telemetria → define SupportLevel
- `content_agent.py`: gera conteúdo + skin hiperfoco via GPT-4o
- `safety_agent.py`: guardrails — valida ausência de punição, objetivo intocado, linguagem adequada
- Fallback automático GPT-4o → Claude 3.5 Sonnet em erro/timeout
- BullMQ consumer no `services/api/` conectado ao AI Engine
- Endpoint `POST /api/adaptation/generate` funcional
- LangSmith configurado para tracing de chamadas LLM
- Rota `/admin/queue` para revisão humana de conteúdo rejeitado
- `telemetry/ml_analyzer.py` scaffolded com estrutura base (implementação completa no Bloco 5)

**Nota sobre StudentProfile mockado:** Um fixture JSON hardcoded (ex: `{ attention_level: 3, sensory_sensitivity: 2, hyperfocos: ["dinossauros"] }`) usado para testar o pipeline de IA. Não é configurável via API neste bloco — o Bloco 2 substitui pelo perfil real coletado via API de onboarding.

---

### Bloco 2 — Perfil & Acessibilidade (terceiro na ordem)

**Entregáveis (backend/API — sem UI mobile, que vem no Bloco 4):**
- API de onboarding: rota `POST /api/profile/:student_id` que recebe as 5 dimensões do StudentProfile (attention_level, sensory_sensitivity, executive_functions, hyperfocos, aversions)
- ConsentFlow API: rota `POST /api/consent` com persistência em `consent_records`
- Middleware `lgpd.ts`: auditoria de todas as rotas que acessam dados sensíveis
- Substituição do StudentProfile mockado do Bloco 3 pelo perfil real (o AI Engine passa a buscar do banco)

**Entregáveis que ficam para o Bloco 4 (precisam de apps/mobile):**
- UI de onboarding mobile (telas de coleta do perfil)
- SensoryControls: contraste, tamanho de fonte, volume, velocidade de animação
- Suporte a `prefers-reduced-motion` nos componentes mobile

---

### Bloco 4 — Missões & Gamificação Mobile (quarto)

**Entregáveis:**
- OverworldMap: mapa navegável com nós de missão (Expo Router + React Native Skia)
- Templates de mini-jogos: `drag_drop`, `tap_choice`, `sequência`
- Hook `useTelemetry()`: captura `latencia_toque`, `precisao_motora`, `rage_taps`, `taxa_acerto`
- Threshold de rage_taps: > 10/min → encerra missão suavemente
- MascotMentor: avatar estático + animação básica (Reanimated 3)
- FeedbackBubble: feedback positivo exclusivamente, sem contadores de erro visíveis
- RoutineStrip: "primeiro-depois"
- Suporte offline: MMKV (cache rápido) + expo-sqlite (missões completas sem internet)
- Sincronização: `useOfflineSync.ts` envia eventos ao reconectar

---

### Bloco 5 — Dashboard Desktop (quinto)

**Entregáveis:**
- App Tauri 2.x + React 18 + TypeScript
- shadcn/ui + Radix UI + Tailwind CSS
- TelemetryChart (Recharts): latência, acerto, rage_taps por sessão
- AlertCard: threshold rage_taps → alerta ao educador/pai
- `ml_analyzer.py` completado: detecção de padrões de fadiga por scikit-learn
- Export PDF (React PDF) e CSV (TanStack Table) do relatório do aluno
- SkillMap: mapa de habilidades BNCC com progresso visual

---

### Bloco 6 — LGPD, Segurança & MVP Final (sexto)

**Entregáveis:**
- Tabela `audit_logs`: registro de todas as ações sensíveis
- RBAC granular: permissões por role em cada endpoint
- Sentry configurado: crashes mobile + erros de API + falhas do AI Engine
- PostHog configurado: funil de uso, eventos pedagógicos, retenção
- Testes E2E: Playwright (desktop) + Maestro (mobile)
- README.md completo com guia de setup para novos devs
- Configuração Railway (API) + Fly.io (AI Engine) para deploy

---

## Invariantes Absolutos

Estas regras nunca podem ser violadas por nenhum componente do sistema:

1. **Objetivo intocável:** `bncc_code` e `objetivo_intocavel` são `readonly` no TypeScript e sem permissão de UPDATE no PostgreSQL. O safety_agent rejeita qualquer output que os altere.

2. **Zero punição:** Campo `erro_sem_punicao: true` é obrigatório em toda `MissionTemplate`. O safety_agent verifica lista negra de padrões punitivos no conteúdo gerado. FeedbackBubble nunca exibe contadores de erro.

3. **Coleta mínima (LGPD):** Telemetria rastreia apenas `latencia_toque`, `precisao_motora`, `rage_taps`, `taxa_acerto`. Qualquer novo campo exige atualização do `consent_records.scope` e nova assinatura parental.

4. **Sessões ≤ 7 minutos:** `duracao_max_s` máximo é 420s. `useTelemetry()` encerra missão suavemente ao detectar `rage_taps > 10/min`. Toda transição usa os tokens de motion — sem pop-ups abruptos.

5. **LLM nunca direto ao usuário:** Todo output do `content_agent` passa obrigatoriamente pelo `safety_agent` antes de ser salvo. A API nunca entrega ao frontend um SkillCard com `safety_approved = false`. Rejeitados vão para `/admin/queue`.

---

## Tratamento de Erros — Motor de IA

```
content_agent chama GPT-4o
  ├─ sucesso → safety_agent valida
  │    ├─ approved=true  → salva SkillCard no banco
  │    └─ approved=false → descarta, loga, enfileira revisão humana
  └─ erro/timeout → retry com Claude 3.5 Sonnet (fallback)
         ├─ sucesso → safety_agent valida (mesmo fluxo)
         └─ erro    → job vai para dead-letter queue (BullMQ)
                       → alerta via Sentry
                       → missão permanece com status "pending"
```

---

## Ambiente de Desenvolvimento

| Serviço | Onde | Como |
|---|---|---|
| PostgreSQL 16 + pgvector | Supabase cloud | `DATABASE_URL` no `.env` |
| Supabase Auth | Supabase cloud | `SUPABASE_URL` + `SUPABASE_ANON_KEY` no `.env` |
| Redis 7 | Docker local | `docker compose up -d` |
| Bull Board | Docker local | `http://localhost:3001` |
| Fastify API | Local | `pnpm dev:api` |
| FastAPI AI Engine | Local | `pnpm dev:ai` |
| LangSmith | Cloud (gratuito) | `LANGCHAIN_API_KEY` no `.env` |

---

## Estrutura do Monorepo

```
ia-motor-adaptativo/          ← Turborepo root
├── apps/
│   ├── mobile/               ← adicionado no Bloco 4
│   └── desktop/              ← adicionado no Bloco 5
├── packages/
│   ├── types/                ← Bloco 1
│   ├── design-system/        ← Bloco 1
│   ├── utils/                ← Bloco 1
│   └── config/               ← Bloco 1
├── services/
│   ├── api/                  ← scaffolded no Bloco 1, completado no Bloco 3
│   └── ai-engine/            ← implementado no Bloco 3
├── infra/
│   ├── docker-compose.yml    ← Redis + Bull Board
│   └── .github/workflows/
├── docs/superpowers/specs/   ← este arquivo
├── turbo.json
├── pnpm-workspace.yaml
└── AGENTS.md                 ← documento de referência do projeto
```

---

## Scripts de Desenvolvimento

```bash
# Setup inicial
pnpm install
docker compose up -d
pnpm db:migrate        # Prisma → Supabase
pnpm db:seed           # 10 Skill Cards BNCC (roda uma vez no setup inicial)
pnpm db:embed          # gera embeddings RAG → pgvector (roda após db:seed e sempre que novos Skill Cards forem adicionados)

# Desenvolvimento
pnpm dev               # todos os serviços
pnpm dev:api           # só Fastify
pnpm dev:ai            # só FastAPI

# Qualidade
pnpm test              # todos os testes
pnpm typecheck         # TypeScript strict
pnpm lint              # ESLint + Prettier
```

---

## Estratégia de Testes

| Bloco | Unitário | Integração | E2E |
|---|---|---|---|
| 1 — Fundação | Vitest (types, utils) | Prisma migrations | — |
| 3 — AI Engine | pytest (agentes) | pipeline end-to-end | curl/Swagger |
| 2 — Perfil | Vitest + RTL | consent flow API | — |
| 4 — Mobile | Jest + RNTL | useTelemetry hook | Maestro |
| 5 — Desktop | Vitest + TL | relatórios API | Playwright |
| 6 — LGPD/MVP | — | audit log | Playwright + Maestro |

---

## Convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Branches:** `main` (produção) · `develop` · `feat/nome-da-feature`
- **Idioma do código:** inglês (variáveis, funções, comentários técnicos)
- **Idioma do produto:** português (conteúdo pedagógico, UI da criança)
- **TypeScript:** strict mode em todos os workspaces
- **Breaking changes:** sempre atualizar `packages/types/` e documentar no AGENTS.md changelog
- **Secrets:** nunca comitados — `.env` e `.superpowers/` no `.gitignore`

---

## Fora de Escopo (Pós-MVP v1.1)

- Pipeline do mascote: foto de brinquedo → Replicate API → avatar digital
- Unity WebGL embed para mini-jogos de maior qualidade
- Testes de usabilidade com crianças neurodivergentes reais
- Cloudflare R2 para assets de skin/mascote com CDN

---

## Changelog deste Spec

| Data | Versão | Mudança |
|---|---|---|
| 2026-04-07 | 1.0.0 | Criação inicial — brainstorming aprovado |
