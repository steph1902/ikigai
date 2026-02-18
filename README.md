<div align="center">

# 生き甲斐 IKIGAI

### AI-Powered Real Estate Automation Platform for the Japanese Market

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python_3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Terraform](https://img.shields.io/badge/Terraform-844FBA?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-0F0F0F?logo=turborepo&logoColor=white)](https://turbo.build/)

**A buyer in Japan opens a chat, describes what they want, and the system finds properties, predicts fair prices, simulates renovations, handles legal document analysis, and orchestrates the transaction — bridging the gap between complex regulation and seamless user experience.**

[Architecture](#-architecture) · [AI System](#-ai-orchestration) · [Getting Started](#-getting-started) · [Compliance](#%EF%B8%8F-regulatory-compliance) · [Documentation](#-documentation) · [Design System](#-sumi--design-system)

</div>

---

## The Problem

Japanese real estate is **fragmented, opaque, and paper-heavy**. Buyers navigate disconnected portals (SUUMO, HOME'S, at HOME), decipher unfamiliar terminology in an entirely different legal system, and face a process that demands interaction with multiple licensed intermediaries — all while critical information remains siloed.

For international residents (在日外国人), the barriers multiply: keigo-level Japanese, complex legal forms like 重要事項説明書 (Important Matter Explanations), and cultural negotiation norms that are nowhere documented.

**IKIGAI unifies this entire journey** — from property discovery through contract — into a single AI-driven interface that understands the domain, respects the regulation, and speaks both languages.

---

## 🧠 AI Orchestration

IKIGAI is built on a **Large Action Model (LAM) architecture** — it doesn't just retrieve information, it executes multi-step workflows with regulatory awareness.

The core is a **LangGraph StateGraph** with a mediation-first routing pattern:

```
User Message
    │
    ▼
┌──────────────────────┐
│   Mediation Agent     │  ← First gate: classifies intent into safety categories
│   (Category A/B/C)    │     Category C (negotiation/legal) → routes to human
└──────────┬───────────┘
           │
    ┌──────┴──────┬──────────┬──────────┬──────────┐
    ▼             ▼          ▼          ▼          ▼
 Search       Viewing   Transaction  Document  Renovation
  Agent        Agent      Agent       Agent      Agent
    │             │          │          │          │
    ▼             ▼          ▼          ▼          ▼
 pgvector     Calendar    Workflow     OCR +    Cost Est.
 + SQL         Coord.    Pipeline      LLM      + 3D Sim
```

### Six Specialized Agents

| Agent | File | Capability |
|:---|:---|:---|
| **Mediation** | `subgraphs/mediation.py` | Intent classification (Category A/B/C) using Claude with structured output. Category C requests → immediate escalation to licensed 宅建士 |
| **Search** | `subgraphs/search.py` | Natural language → structured query translation. "Find me a pet-friendly 2LDK in Setagaya under ¥80M, built after 2010" → SQL + vector search |
| **Viewing** | `subgraphs/viewing.py` | Scheduling coordination for property viewings |
| **Transaction** | `subgraphs/transaction.py` | Multi-step purchase workflow orchestration with compliance checkpoints |
| **Document** | `subgraphs/document.py` | OCR + LLM analysis of 登記簿謄本 (Registry) and 重要事項説明書 (Important Matters) |
| **Renovation** | `subgraphs/renovation.py` | Renovation cost estimation and modification planning |

### Why Mediation Boundary Detection Matters

Under Japan's 宅地建物取引業法 (Takken Act), providing negotiation advice or interpreting contract terms without a license is **illegal**. The mediation agent isn't a nice-to-have safety filter — it's a **legal requirement** that determines which user requests the AI can handle autonomously (Category A: information, Category B: logistics) versus which must be escalated to a licensed professional (Category C: negotiation, legal interpretation).

This is a first-principles approach to responsible AI in regulated industries.

---

## 🏛 Architecture

Turborepo monorepo with clear separation between frontend applications, backend AI services, shared packages, and infrastructure-as-code.

### Applications

| App | Stack | Description |
|:---|:---|:---|
| `apps/web` | Next.js 15 (App Router), Radix UI, Tailwind CSS 4 | Buyer-facing web application |
| `apps/mobile` | React Native, Expo SDK 52, NativeWind | iOS/Android cross-platform app |
| `apps/admin` | Next.js 15 | Internal agent/admin dashboard |
| `apps/line-bot` | Hono on Cloudflare Workers | LINE messaging integration (most popular messaging app in Japan) |

### AI & ML Services

| Service | Stack | Description |
|:---|:---|:---|
| `services/orchestrator` | Python 3.12, LangGraph, FastAPI, Claude 3.5 | Multi-agent orchestration engine — the "brain" |
| `services/pricing-model` | Python, FastAPI, LightGBM | ML price prediction using rosenka (路線価), transaction history, 50+ features |
| `services/vr-engine` | Python, FastAPI | 2D floor plan → 3D WebXR environment generation |
| `services/document-ocr` | Python, FastAPI | Japanese legal document OCR and analysis pipeline |
| `services/embedding` | Python, FastAPI | Vector embedding generation for semantic search |
| `services/scraper` | Python, FastAPI | Data ingestion adapter (provider pattern for future real-source integration) |

### Shared Packages

| Package | Description |
|:---|:---|
| `packages/db` | Drizzle ORM — 11 schema files + migrations (properties, users, journeys, transactions, conversations, documents, predictions, action-logs, hazards, auth) |
| `packages/ui` | SUMI (墨) design system — 7 primitives (Button, Dialog, Input, Select, Tabs, Toast, Dropdown) + 3 composed components (PropertyCard, ChatMessage, RiskFlagBanner) + layout system |
| `packages/i18n` | Japanese/English internationalization with domain-specific formatters (¥万/億 currency, ㎡/坪 area, 築年数 building age, 丁目番地号 addresses) |
| `packages/seed` | Synthetic data generator — geographically accurate Tokyo property listings across 8 wards with correlated pricing, real station/rail line data, and earthquake resistance classification (新耐震/旧耐震 based on 1981 building code) |
| `packages/validators` | Zod-based shared validation schemas |
| `packages/auth` | Authentication utilities |
| `packages/domain` | Domain logic and business rules |
| `packages/types` | Shared TypeScript type definitions |
| `packages/logger` | Structured logging |

### Infrastructure

| Component | Technology |
|:---|:---|
| **Compute** | AWS EKS (Kubernetes) |
| **Database** | AWS RDS Aurora (PostgreSQL 16 + pgvector) |
| **Cache** | AWS ElastiCache (Redis) |
| **Storage** | AWS S3 |
| **Network** | AWS VPC with private subnets |
| **IaC** | Terraform — 5 modules (EKS, RDS, ElastiCache, S3, VPC) |
| **Containers** | Docker + Docker Compose (local dev) |
| **Region** | `ap-northeast-1` (Tokyo) — data residency compliance |

### Repository Structure

```
ikigai/
├── apps/
│   ├── web/                 # Next.js 15 — Buyer-facing web app
│   ├── mobile/              # Expo SDK 52 — iOS/Android
│   ├── admin/               # Internal admin dashboard
│   └── line-bot/            # Hono on Cloudflare Workers
├── services/
│   ├── orchestrator/        # ★ LangGraph multi-agent engine (Python)
│   │   └── src/
│   │       ├── graph.py          # Main StateGraph definition
│   │       ├── subgraphs/        # 6 specialized agents
│   │       │   ├── mediation.py     # Category A/B/C classification
│   │       │   ├── search.py        # Property search (RAG + SQL)
│   │       │   ├── viewing.py       # Scheduling coordination
│   │       │   ├── transaction.py   # Purchase workflow
│   │       │   ├── document.py      # Legal document analysis
│   │       │   └── renovation.py    # Renovation estimation
│   │       ├── tools/            # 6 tool modules (API, search, pricing, etc.)
│   │       ├── prompts/          # Prompt templates
│   │       └── models/           # State definitions
│   ├── pricing-model/       # ML price prediction (LightGBM)
│   ├── vr-engine/           # 3D/WebXR generation
│   ├── document-ocr/        # Japanese document OCR
│   ├── embedding/           # Vector embedding service
│   └── scraper/             # Data ingestion adapter
├── packages/
│   ├── db/                  # Drizzle ORM — 11 schemas + migrations
│   ├── ui/                  # SUMI design system — 10+ components
│   ├── i18n/                # JP/EN messages + Japanese formatters
│   ├── seed/                # Synthetic Tokyo property data generator
│   ├── validators/          # Zod schemas
│   ├── auth/                # Authentication
│   ├── domain/              # Domain logic
│   ├── types/               # Shared types
│   └── logger/              # Structured logging
├── infrastructure/
│   └── terraform/           # AWS infra (EKS, RDS, S3, ElastiCache, VPC)
├── docker/                  # Docker Compose for local dev
└── docs/                    # 9 specification documents (~380KB)
```

---

## 🚀 Getting Started

**Prerequisites:** Docker, Node.js 22+, Python 3.12+, pnpm

### 1. Setup

```bash
# Clone and install
git clone https://github.com/steph1902/ikigai.git
cd ikigai
pnpm install

# Configure environment
cp .env.example .env
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL (pgvector), Redis via Docker Compose
pnpm db:up

# Run migrations and seed with synthetic Tokyo property data
pnpm db:seed
```

### 3. Launch

```bash
# Start all applications and services
pnpm dev
```

| Service | URL |
|:---|:---|
| Web App | [http://localhost:3000](http://localhost:3000) |
| Orchestrator API (Swagger) | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Admin Dashboard | [http://localhost:3002](http://localhost:3002) |

---

## ⚖️ Regulatory Compliance

IKIGAI is engineered with **compliance-by-design** for the Japanese real estate market. The [Regulatory Compliance Architecture](docs/Regulatory%20Compliance%20Architecture%20Document.md) maps **24 specific legal obligations** to platform components:

| Domain | Regulation | Platform Implementation |
|:---|:---|:---|
| **Brokerage Licensing** | 宅地建物取引業法 (Takken Act) | Mediation Boundary Detection — Category A/B/C intent classification prevents unlicensed brokerage activity |
| **AI Liability** | Price prediction disclaimers | All AI estimates labelled as 推定価格 (estimates), never 鑑定 (appraisal). Model limitations disclosed |
| **Digital Disclosure** | IT重説 (IT Jusetsu) | Architecture for digital delivery of Important Matter Explanations with licensed specialist presence |
| **Data Privacy** | 個人情報保護法 (APPI) | Consent management, AI training opt-out, cross-border transfer disclosure |
| **Audit Trail** | Transaction transparency | Immutable `action_logs` table — every AI action recorded with timestamp, input, output, and classification |
| **Human-in-the-Loop** | Licensed professional review | High-stakes actions (offers, contracts) require 宅建士 (Takken-shi) review before execution |

---

## 📚 Documentation

The `docs/` folder contains **nine specification documents** (~380KB total) covering the full system design:

| Document | Description |
|:---|:---|
| [Product Requirements Document](docs/AI-Powered%20Full-Stack%20Real%20Estate%20Automation%20Platform%20for%20the%20Japanese%20Market.md) | Vision, personas, capabilities, success criteria, phased roadmap |
| [Regulatory Compliance Architecture](docs/Regulatory%20Compliance%20Architecture%20Document.md) | 24 legal obligations mapped to platform components |
| [SUMI Design Language](docs/The%20IKIGAI%20Visual%20Design%20Language.md) | Complete design system specification — colors, typography, components, accessibility |
| [Data Strategy](docs/Data%20Strategy%20for%20a%20Portfolio%20Project.md) | Synthetic data rationale, seed generator architecture, i18n formatters |
| [MVP Strategy](docs/Portfolio%20MVP%20Strategy%20Building%20for%20Demonstration%20Not%20Production.md) | Portfolio scope philosophy — what to build vs. document |
| [Future Roadmap](docs/Additional%20Features%20%E2%80%94%20Future%20Roadmap.md) | Phase 2-4 capabilities and expansion plan |

---

## 🎨 SUMI (墨) Design System

The visual language is named after traditional Japanese ink wash painting. Three design pillars:

- **信頼 (Trust)** — AI-generated content uses a distinct `--sumi-ai-*` color palette so users always know what's AI-sourced vs. factual
- **明快 (Clarity)** — Japanese-optimized typography (Noto Sans JP + Inter, 1.7 line-height for Japanese body text)
- **和 (Harmony)** — Culturally appropriate aesthetics for the Japanese market

Built on **Radix UI** primitives + **Tailwind CSS 4** + **class-variance-authority**. Components in `packages/ui/`. Full specification in [docs/The IKIGAI Visual Design Language.md](docs/The%20IKIGAI%20Visual%20Design%20Language.md).

---

## Data Architecture

This project uses **realistic synthetic data** rather than scraped data (a deliberate decision — [rationale documented here](docs/Data%20Strategy%20for%20a%20Portfolio%20Project.md)). The seed generator in `packages/seed/` produces geographically accurate Tokyo property listings with:

- Real ward/station locations with correct rail line data across 8 Tokyo wards (渋谷区, 世田谷区, 港区, 目黒区, 新宿区, 文京区, 江東区, 中央区)
- Statistically correlated pricing: area × station proximity × building age × floor level
- Proper Japanese address formatting (丁目番地号)
- Earthquake resistance classification based on the real June 1981 building code cutoff (新耐震基準 vs 旧耐震基準)
- Building features with realistic probability distributions
- 5-year market trend simulation with seasonal patterns

The data ingestion layer is architected with a **provider-based adapter pattern** (`services/scraper/`) — designed to plug into real sources (REINS API, portal feeds, government registries) when licensed access is obtained.

---

## Tech Stack

| Layer | Technology | Why |
|:---|:---|:---|
| **Web Frontend** | Next.js 15, Radix UI, Tailwind CSS 4, Framer Motion | App Router for SSR/SSG; Radix for accessible primitives |
| **Mobile** | React Native, Expo SDK 52, NativeWind | Cross-platform with shared design tokens |
| **AI Orchestration** | Python 3.12, LangGraph, FastAPI, Claude 3.5 Sonnet | LangGraph for stateful multi-agent workflows |
| **Database** | PostgreSQL 16, pgvector, Drizzle ORM | Combined relational + vector search in one engine |
| **Infrastructure** | AWS (EKS, RDS Aurora, ElastiCache, S3), Terraform | Production-grade IaC; Tokyo region for data residency |
| **Monorepo** | Turborepo, pnpm workspaces | Incremental builds, shared configs, type-safe boundaries |
| **Code Quality** | Biome (lint + format), TypeScript strict mode | Single tool for lint + format; strict type safety |
| **Messaging** | LINE Bot (Hono + Cloudflare Workers) | LINE is used by 95M+ people in Japan |

---

## Portfolio Context

This project is built for **demonstration and architectural storytelling**, not production deployment. A detailed [MVP Strategy document](docs/Portfolio%20MVP%20Strategy%20Building%20for%20Demonstration%20Not%20Production.md) explains this philosophy. Key decisions:

- **Mocked vendor integrations** behind clean interfaces (e-signature, KYC) — demonstrates the abstraction, not the vendor SDK
- **Synthetic data** instead of scraped data — respects ToS, demonstrates engineering competence
- **Partner-brokerage model** assumption for licensing — documents the legal constraint without solving it
- **Focused depth over breadth** — the orchestrator, mediation boundary, and data pipeline are fully engineered; peripheral features are scaffolded

The architecture is designed so that replacing mocks with real implementations requires **changing adapter implementations**, not rewriting systems.

---

<div align="center">

**Built with 🏯 in Tokyo**

© 2026 IKIGAI Platform. All Rights Reserved.

</div>
