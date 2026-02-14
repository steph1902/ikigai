

# The Ultimate Implementation Prompt

> **Purpose:** This is a single, comprehensive prompt designed to be fed to an AI coding agent (such as Claude Code) or used as the canonical engineering blueprint for a development team. It references the PRD v1.0 and FSD v1.0 as companion documents and provides everything needed to go from zero to a production-grade, deployed system.

---

```markdown
You are a Principal Full-Stack AI Systems Engineer. Your task is to build the complete
"AI-Powered Full-Stack Real Estate Automation Platform for the Japanese Market" — codenamed
**IKIGAI** (Intelligent Knowledge-Integrated Guidance for Automated Investments).

You will build this system from scratch, following the PRD and FSD provided as companion
documents. Every architectural decision, technology choice, and implementation pattern below
is deliberate and mandatory. Do not deviate unless you encounter a hard technical
impossibility, in which case document the deviation and your reasoning.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: TECHNOLOGY STACK SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1.1 — Monorepo Structure

Use a Turborepo monorepo. The repository structure is:

ikigai/
├── apps/
│   ├── web/                          # Next.js 15 (App Router) — Buyer-facing web app
│   ├── mobile/                       # React Native (Expo SDK 52+) — iOS & Android
│   ├── agent-dashboard/              # Next.js 15 — Partner agent portal
│   ├── admin/                        # Next.js 15 — Internal admin & monitoring
│   └── line-bot/                     # Hono on Cloudflare Workers — LINE channel handler
├── packages/
│   ├── ui/                           # Shared React component library (Radix UI + Tailwind CSS 4)
│   ├── db/                           # Drizzle ORM schema, migrations, seed
│   ├── auth/                         # Authentication module (Better Auth)
│   ├── i18n/                         # Internationalization (next-intl for web, i18next for mobile)
│   ├── validators/                   # Zod schemas shared across frontend & backend
│   ├── types/                        # Shared TypeScript types generated from Zod schemas
│   ├── ai/                           # AI orchestration layer (Vercel AI SDK + LangGraph)
│   ├── actions/                      # LAM Action Engine primitives
│   ├── documents/                    # Document Intelligence Service
│   ├── pricing/                      # Price Prediction Model service client
│   ├── vr/                           # Visual Simulation Engine client & components
│   ├── workflow/                     # Workflow State Machine (XState v5)
│   ├── search/                       # Property search engine client
│   ├── notifications/                # Notification service (push, email, LINE)
│   └── logger/                       # Structured logging (Pino)
├── services/
│   ├── orchestrator/                 # Main AI orchestration service (Python — FastAPI)
│   ├── pricing-model/                # Price prediction ML service (Python — FastAPI)
│   ├── document-ocr/                 # Document OCR & parsing (Python — FastAPI)
│   ├── vr-engine/                    # 3D generation & rendering (Python + Three.js pipeline)
│   ├── scraper/                      # Property listing scraper (Python — Scrapy + Playwright)
│   └── embedding/                    # Vector embedding service for semantic search (Python — FastAPI)
├── infra/
│   ├── terraform/                    # All infrastructure as code (AWS)
│   ├── docker/                       # Dockerfiles for all services
│   ├── k8s/                          # Kubernetes manifests (Helm charts)
│   └── github-actions/              # CI/CD pipeline definitions
├── ml/
│   ├── notebooks/                    # Jupyter notebooks for EDA and model development
│   ├── training/                     # Model training pipelines (MLflow + SageMaker)
│   ├── evaluation/                   # Model evaluation scripts and benchmark datasets
│   └── data/                         # Data pipeline definitions (DVC tracked)
├── docs/
│   ├── prd.md
│   ├── fsd.md
│   ├── architecture.md
│   ├── api-reference/
│   └── runbooks/
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── biome.json                        # Linter + Formatter (Biome replaces ESLint + Prettier)
├── .env.example
└── .github/
    └── workflows/

Package manager: pnpm (strict mode, hoisted=false).
Node.js version: 22 LTS.
Python version: 3.12.
TypeScript: strict mode, no `any`, exactOptionalPropertyTypes enabled.


## 1.2 — Frontend Stack

### Web (apps/web)
- Framework: Next.js 15 (App Router, Server Components by default)
- Rendering: SSR for SEO pages (property listings), RSC for app pages, ISR for market data
- Styling: Tailwind CSS 4 + Radix UI primitives (unstyled) + custom design tokens
- State: Zustand for client state, TanStack Query v5 for server state
- Forms: React Hook Form + Zod resolvers (schemas from packages/validators)
- Chat UI: Vercel AI SDK's useChat hook with streaming support
- VR/3D: React Three Fiber (R3F) + drei helpers for non-VR 3D viewer, WebXR for VR
- Maps: MapLibre GL JS with GSI (Geospatial Information Authority of Japan) tile layers
         + custom property overlay layers
- i18n: next-intl with ICU message format, Japanese (default) + English
- Analytics: PostHog (self-hosted for PII compliance)
- Testing: Vitest (unit), Playwright (E2E), Storybook (component documentation)

### Mobile (apps/mobile)
- Framework: React Native via Expo SDK 52+
- Navigation: Expo Router (file-based routing mirroring Next.js patterns)
- Styling: NativeWind (Tailwind CSS for React Native)
- Chat: Vercel AI SDK React Native adapter with streaming
- 3D: expo-three for basic 3D viewing; deep link to web-based VR for full experience
- Maps: react-native-maplibre-gl
- Push Notifications: Expo Notifications → APNs + FCM
- Testing: Jest + React Native Testing Library (unit), Maestro (E2E)

### LINE Bot (apps/line-bot)
- Runtime: Cloudflare Workers (edge, low latency in Japan)
- Framework: Hono (lightweight, edge-native)
- LINE SDK: @line/bot-sdk
- Message types: Text, Flex Messages (for property cards), Rich Menus, LIFF (LINE Front-end
  Framework) for embedding the VR viewer and complex UIs within LINE
- Webhook signature verification: mandatory, implemented at the Hono middleware level
- Context bridging: LINE userId mapped to IKIGAI userId in the auth system; full journey
  context available regardless of channel


## 1.3 — Backend Stack

### API Layer (within apps/web — Next.js Route Handlers + tRPC)
- tRPC v11 with superjson transformer for type-safe API between frontend and backend
- Next.js Route Handlers for webhook endpoints (LINE, payment providers, partner callbacks)
- Rate limiting: Upstash Redis-based rate limiter (@upstash/ratelimit)
- API versioning: via tRPC router namespacing (v1Router, v2Router)

### AI Orchestration Service (services/orchestrator)
- Language: Python 3.12
- Framework: FastAPI with async support
- AI Framework: LangGraph (for stateful, multi-step agent workflows)
  - Graph nodes represent stages: intent classification, tool selection, action execution,
    response generation
  - Graph edges represent conditional transitions based on intent, permission level, and
    workflow state
  - Checkpointing: LangGraph's built-in checkpointer backed by PostgreSQL for conversation
    recovery and debugging
- LLM Provider: Anthropic Claude (claude-opus-4-20250514 for complex reasoning and document
  analysis; claude-sonnet-4-20250514 for high-throughput tasks like search result summarization)
- Tool/Function Calling: Claude's native tool_use for structured action dispatch
- Embedding Model: Cohere embed-multilingual-v3.0 (superior Japanese language embedding)
- Prompt Management: Promptfoo for version-controlled prompt templates + evaluation
- Guardrails: Custom validation layer that enforces the permission model from FSD Section 3.2
  BEFORE any action primitive executes

### Price Prediction Service (services/pricing-model)
- Language: Python 3.12
- Framework: FastAPI
- ML Framework: LightGBM (gradient-boosted decision trees — initial model)
  - Chosen over XGBoost for faster training on categorical-heavy Japanese real estate data
  - SHAP (SHapley Additive exPlanations) for feature importance → feeds the natural language
    explanation
- Model Serving: MLflow model registry → served via FastAPI endpoint
- Feature Store: Feast (open-source feature store) backed by PostgreSQL offline store and
  Redis online store
- Training Pipeline: AWS SageMaker for training jobs, triggered quarterly via Step Functions
- Data Versioning: DVC (Data Version Control) tracking training datasets in S3

### Document Intelligence Service (services/document-ocr)
- Language: Python 3.12
- Framework: FastAPI
- OCR: Google Cloud Vision API (superior Japanese OCR accuracy, especially for mixed
  kanji/hiragana/katakana with tabular layouts)
  - Fallback: PaddleOCR (open-source, self-hosted) for cost optimization on high-volume
    simple documents
- Document Parsing: Custom rule-based extractors for each document type (registry transcript,
  important matter explanation, contract) using detected text positions and known document
  templates
- LLM Analysis: Claude claude-sonnet-4-20250514 for risk flagging and natural language explanation
  generation, with structured output schemas enforced via tool_use
- Document Generation: python-docx for Word output, WeasyPrint for PDF rendering from
  HTML/CSS templates designed to match standard Japanese real estate form layouts
- Storage: Documents stored in S3 with server-side encryption (SSE-KMS), pre-signed URLs
  for time-limited access

### VR/3D Engine (services/vr-engine)
- Floor Plan CV Pipeline: Python + OpenCV + custom CNN model (PyTorch) trained on Japanese
  間取り図 dataset for room segmentation and dimension extraction
- 3D Generation: Procedural geometry generation in Python (trimesh library) → export as
  glTF 2.0 → served to frontend R3F viewer
- Material Library: PBR (Physically Based Rendering) material textures stored in S3,
  tagged by Japanese construction material types (フローリング subtypes, 畳 types, クロス
  wall covering patterns)
- Renovation Simulation: Modification operations (wall removal, material swap, fixture
  replacement) implemented as geometry transforms on the base glTF model
- Cost Estimation: Rule-based calculator using a prefecture-segmented cost database
  (PostgreSQL table updated quarterly from construction industry publications)
- Rendering: Client-side rendering via R3F for interactive use; server-side rendering
  via headless Three.js (via Puppeteer) for generating static preview images for LINE/chat

### Property Scraper Service (services/scraper)
- Framework: Scrapy (for structured crawling) + Playwright (for JavaScript-rendered pages)
- Target sites: SUUMO, HOME'S, at-home, Yahoo! Real Estate, and others as added
- Scheduling: Celery Beat with Redis broker, configurable per-source crawl frequency
- Deduplication: Fuzzy matching on address + area + price + floor plan using recordlinkage
  library
- Respect: robots.txt compliance, configurable rate limiting per domain, rotating
  residential proxies (Japan-located) for scraper requests
- Output: Scraped data → validated via Pydantic models → upserted into PostgreSQL
  property table via the canonical schema

### Embedding Service (services/embedding)
- Generates vector embeddings for property descriptions, user queries, and document chunks
- Model: Cohere embed-multilingual-v3.0 (1024-dim, excellent Japanese performance)
- Vector Store: pgvector extension in PostgreSQL (co-located with relational data to
  enable hybrid search: vector similarity + structured SQL filters in a single query)
- Index: HNSW index on the embedding column for approximate nearest neighbor search


## 1.4 — Data Layer

### Primary Database: PostgreSQL 16 (AWS RDS Aurora Serverless v2)
- Why Aurora Serverless: automatic scaling for unpredictable early-stage load patterns,
  pay-per-use, multi-AZ high availability
- Extensions:
  - pgvector: vector similarity search for semantic property matching
  - PostGIS: geospatial queries (distance-to-station, area polygon search, hazard zone
    intersection)
  - pg_trgm: trigram-based fuzzy text search for Japanese address matching
  - pgcrypto: field-level encryption for PII
- ORM: Drizzle ORM (TypeScript side), SQLAlchemy 2.0 (Python side)
- Migrations: Drizzle Kit for schema migrations, version-controlled in packages/db
- Connection pooling: PgBouncer (sidecar in Kubernetes)

### Cache & Real-Time: Redis 7 (AWS ElastiCache)
- Session storage for authenticated users
- Rate limiting counters
- Feature store online serving (Feast)
- Pub/Sub for real-time chat message delivery
- Celery broker for scraper task queue
- Cache: property search results (TTL: 5 minutes), price predictions (TTL: 24 hours)

### Object Storage: AWS S3
- Property images (replicated from source listings for fast serving)
- User-uploaded documents (encrypted with SSE-KMS, separate bucket with strict IAM)
- 3D model assets (glTF files, PBR textures)
- ML model artifacts
- Scraper raw output archives
- Lifecycle policies: user documents retained for 7 years (legal requirement), scraper
  archives moved to Glacier after 90 days

### Search Index: Meilisearch (self-hosted on Kubernetes)
- Why Meilisearch over Elasticsearch: superior Japanese tokenization out of the box
  (uses Lindera with IPADIC dictionary), dramatically simpler operations, excellent
  typo tolerance for romaji input of Japanese addresses
- Indexes: properties (full-text + filterable attributes), documents (full-text search
  of analyzed document content)
- Sync: PostgreSQL → Meilisearch via Debezium CDC (Change Data Capture) → Kafka → 
  Meilisearch consumer

### Event Streaming: Apache Kafka (AWS MSK Serverless)
- Topics:
  - property.listings.updated — new/changed listings from scraper
  - user.actions.executed — action log events
  - user.journey.state-changed — workflow state transitions
  - documents.analyzed — completed document analysis results
  - pricing.predictions.completed — completed price predictions
- Consumers process events for: search index sync, analytics pipeline, notification
  triggers, audit log persistence


## 1.5 — Infrastructure & DevOps

### Cloud: AWS (Tokyo region ap-northeast-1, primary)
- Why AWS Tokyo: lowest latency for Japanese users, data residency compliance,
  broadest service availability in Japan

### Compute: Kubernetes (AWS EKS)
- Node groups:
  - general: m7i.xlarge (Next.js apps, API services) — autoscaling 2-10 nodes
  - ml: g5.xlarge (GPU nodes for OCR, embedding generation, 3D rendering) — autoscaling 0-4
  - workers: c7i.large (scraper workers, Celery tasks) — autoscaling 1-6
- Helm charts for all services in infra/k8s/
- Istio service mesh for mTLS between services, traffic management, and observability

### CDN: CloudFront
- Edge caching for static assets, property images, 3D textures
- Origin: S3 (static assets), ALB (dynamic content)
- Custom domain with ACM certificate

### DNS: Route 53
- Primary domain: ikigai.jp (example)
- Health check routing for multi-region failover (future)

### CI/CD: GitHub Actions
- Pipeline stages:
  1. Lint & Format (Biome) — fails fast
  2. Type Check (tsc --noEmit) — parallel for all TS packages
  3. Unit Tests (Vitest / pytest) — parallel per package/service
  4. Build (Turborepo — incremental, cached)
  5. Integration Tests (against ephemeral database + service containers)
  6. E2E Tests (Playwright / Maestro — against staging deployment)
  7. Container Build & Push (to ECR)
  8. Deploy to Staging (Helm upgrade)
  9. Smoke Tests on Staging
  10. Manual Approval Gate (for production)
  11. Deploy to Production (Helm upgrade, canary strategy)
  12. Post-deploy health checks and automatic rollback on failure

### Infrastructure as Code: Terraform
- All AWS resources defined in infra/terraform/
- State: S3 backend with DynamoDB locking
- Modules: networking (VPC, subnets, security groups), database (RDS, ElastiCache),
  compute (EKS cluster, node groups), storage (S3 buckets, lifecycle policies),
  monitoring (CloudWatch, alarms), security (IAM roles, KMS keys, Secrets Manager)
- Environment separation: dev / staging / production workspaces

### Secrets Management: AWS Secrets Manager
- All API keys, database credentials, LLM API keys stored in Secrets Manager
- Kubernetes External Secrets Operator syncs to K8s Secrets
- Rotation: automatic rotation for database credentials (90-day cycle)

### Observability
- Metrics: Prometheus (via Istio + application metrics) → Grafana dashboards
- Logging: Pino (structured JSON) → Fluent Bit (DaemonSet) → AWS OpenSearch
- Tracing: OpenTelemetry SDK in all services → Jaeger for distributed trace visualization
- Alerting: Grafana Alerting → PagerDuty (critical) / Slack (warning)
- Key dashboards:
  - System Health: request latency p50/p95/p99, error rates, pod health
  - AI Performance: LLM latency, token usage, tool call success rate, cost per conversation
  - Business Metrics: active users, searches, viewings scheduled, offers submitted,
    conversion funnel
  - ML Model: prediction accuracy, drift detection, feature distribution shifts


## 1.6 — Security Architecture

### Authentication: Better Auth
- Why Better Auth: modern, TypeScript-native, supports the auth flows needed (magic link,
  OAuth, MFA) without the vendor lock-in of Auth0/Clerk
- Providers: Email magic link, Google OAuth, Apple OAuth, LINE Login
- Session: JWT (short-lived, 15 min) + refresh token (long-lived, 30 days, stored in
  HTTP-only secure cookie)
- Step-up Auth: For high-stakes actions (FSD Section 3.2), require re-authentication
  via TOTP (authenticator app) or SMS OTP
- LINE channel: LINE Login OAuth → map LINE userId to IKIGAI account

### Authorization: RBAC + ABAC hybrid
- Roles: buyer, partner_agent, admin, system
- Attribute-based rules for fine-grained control:
  - A buyer can only view/modify their own journey and documents
  - A partner_agent can only view journeys/properties assigned to them
  - Action primitives check both role and journey state before execution
- Implementation: Cerbos (open-source, policy-as-code authorization engine) deployed as
  a sidecar in Kubernetes

### Data Protection
- Encryption at rest: AES-256 via AWS KMS (RDS encryption, S3 SSE-KMS, EBS encryption)
- Encryption in transit: TLS 1.3 everywhere (Istio mTLS for inter-service, CloudFront
  for client-facing)
- Field-level encryption: pgcrypto for PII columns (income, identity document numbers,
  bank account details) — application-level encrypt/decrypt with dedicated KMS key
- Data masking: Non-production environments use anonymized data (generated by snaplet
  or similar tool)

### Compliance
- 個人情報保護法: Cookie consent banner (prior to analytics), explicit consent collection
  for PII processing, data access/deletion API for user rights exercise
- 犯罪収益移転防止法 (AML): eKYC integration (TRUSTDOCK API — Japanese-market eKYC provider)
  for identity verification before transaction facilitation
- Audit log: Immutable ActionLog table (append-only, no UPDATE/DELETE permissions for any
  application role) — retained for 10 years


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: DATABASE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement the following schema using Drizzle ORM in packages/db. Use PostgreSQL-native
types wherever possible. All tables include created_at (timestamptz, default now()) and
updated_at (timestamptz, auto-updated via trigger).

### users
- id: uuid (PK, default gen_random_uuid())
- email: text (unique, not null)
- display_name: text
- phone: text (encrypted)
- language_preference: enum('ja', 'en') default 'ja'
- line_user_id: text (unique, nullable) — mapped from LINE Login
- financial_profile: jsonb (encrypted at application level) — income, employment, debts
- ekyc_status: enum('not_started', 'pending', 'verified', 'rejected') default 'not_started'
- ekyc_verified_at: timestamptz
- role: enum('buyer', 'partner_agent', 'admin') default 'buyer'
- communication_preference: enum('detailed', 'concise') default 'detailed'

### sessions (managed by Better Auth — schema per their specification)

### properties
- id: uuid (PK)
- source: enum('suumo', 'homes', 'athome', 'reins', 'partner_direct', 'yahoo_re')
- source_listing_id: text
- unique constraint on (source, source_listing_id)
- address: text (not null)
- prefecture: text
- municipality: text
- district: text (丁目 level)
- location: geography(Point, 4326) — PostGIS point (lat/lng)
- building_type: enum('mansion', 'apartment', 'kodate', 'land') — マンション, アパート, 戸建て, 土地
- structure: enum('rc', 'src', 'steel', 'wood', 'light_steel', 'other')
- total_area_sqm: numeric(10,2)
- land_area_sqm: numeric(10,2) (nullable, for kodate/land)
- floor_plan: text (e.g., '3LDK')
- num_rooms: integer
- floor_level: integer (nullable, for mansions)
- total_floors: integer
- total_units: integer (nullable, for mansions)
- year_built: integer
- year_renovated: integer (nullable)
- earthquake_standard: enum('old', 'new', 'grade1', 'grade2', 'grade3', 'unknown')
- listing_price: bigint (in yen)
- management_fee: integer (monthly, yen, nullable)
- repair_reserve_fee: integer (monthly, yen, nullable)
- ground_lease_fee: integer (monthly, yen, nullable)
- nearest_station_name: text
- nearest_station_line: text
- nearest_station_walk_minutes: integer
- zoning: text (用途地域)
- building_coverage_ratio: numeric(5,2) (建ぺい率, percentage)
- floor_area_ratio: numeric(5,2) (容積率, percentage)
- features: jsonb — array of feature strings (auto_lock, delivery_box, floor_heating, etc.)
- images: jsonb — array of {url, type, order}
- floor_plan_image_url: text
- listing_url: text
- description: text
- listing_date: date
- is_active: boolean default true
- last_scraped_at: timestamptz
- embedding: vector(1024) — pgvector, Cohere multilingual embedding of description + features

Index: GiST on location, HNSW on embedding, btree on (prefecture, municipality, listing_price),
       btree on (nearest_station_walk_minutes), btree on is_active

### property_price_predictions
- id: uuid (PK)
- property_id: uuid (FK → properties)
- model_version: text
- predicted_price: bigint
- confidence_lower: bigint
- confidence_upper: bigint
- mape_at_prediction_time: numeric(5,2) — model's MAPE when this prediction was made
- top_positive_factors: jsonb — [{feature, contribution, explanation}]
- top_negative_factors: jsonb — [{feature, contribution, explanation}]
- explanation_text_ja: text
- explanation_text_en: text
- predicted_at: timestamptz

### property_hazard_data
- id: uuid (PK)
- property_id: uuid (FK → properties)
- flood_risk: enum('none', 'low', 'moderate', 'high', 'very_high')
- landslide_risk: enum('none', 'low', 'moderate', 'high', 'very_high')
- tsunami_risk: enum('none', 'low', 'moderate', 'high', 'very_high')
- liquefaction_risk: enum('none', 'low', 'moderate', 'high', 'very_high')
- source_url: text
- fetched_at: timestamptz

### journeys
- id: uuid (PK)
- user_id: uuid (FK → users, unique) — one active journey per user
- search_criteria: jsonb — structured search parameters
- status: enum('active', 'completed', 'paused') default 'active'

### shortlisted_properties
- id: uuid (PK)
- journey_id: uuid (FK → journeys)
- property_id: uuid (FK → properties)
- user_notes: text
- user_rating: integer (1-5, nullable)
- state: enum('shortlisted', 'viewing_scheduled', 'viewed', 'offering', 'negotiating',
  'contract_prep', 'contract_signed', 'settlement_prep', 'settled', 'dropped', 'cancelled')
  default 'shortlisted'
- state_changed_at: timestamptz
- unique constraint on (journey_id, property_id)

### transactions
- id: uuid (PK)
- shortlisted_property_id: uuid (FK → shortlisted_properties, unique)
- journey_id: uuid (FK → journeys)
- property_id: uuid (FK → properties)
- offer_price: bigint (nullable)
- agreed_price: bigint (nullable)
- earnest_money: bigint (nullable)
- settlement_date: date (nullable)
- mortgage_status: enum('not_started', 'preapproval_submitted', 'preapproved',
  'formal_submitted', 'approved', 'declined', 'not_needed') default 'not_started'
- mortgage_institution: text (nullable)
- mortgage_amount: bigint (nullable)
- assigned_agent_id: uuid (FK → users, nullable) — partner agent
- assigned_scrivener: text (nullable)
- status: enum('active', 'completed', 'cancelled') default 'active'
- cancellation_reason: text (nullable)

### documents
- id: uuid (PK)
- transaction_id: uuid (FK → transactions, nullable) — null for pre-transaction docs
- user_id: uuid (FK → users)
- property_id: uuid (FK → properties, nullable)
- document_type: enum('registry_transcript', 'important_matter_explanation', 'sale_contract',
  'building_inspection', 'management_rules', 'mortgage_application', 'offer_letter',
  'identity_document', 'other')
- file_path: text — S3 key (never store actual file content in DB)
- file_name: text
- mime_type: text
- analysis_status: enum('pending', 'processing', 'completed', 'failed') default 'pending'
- analysis_result: jsonb (nullable) — structured extraction output
- risk_flags: jsonb (nullable) — [{severity, category, description_ja, description_en, action}]
- review_status: enum('draft', 'pending_review', 'reviewed', 'approved') default 'draft'
- reviewed_by: uuid (FK → users, nullable) — the professional who reviewed
- reviewed_at: timestamptz

### conversations
- id: uuid (PK)
- user_id: uuid (FK → users)
- channel: enum('web', 'mobile', 'line', 'voice')
- langgraph_thread_id: text — maps to LangGraph's checkpointed thread
- started_at: timestamptz
- last_message_at: timestamptz
- is_active: boolean default true

### messages
- id: uuid (PK)
- conversation_id: uuid (FK → conversations)
- role: enum('user', 'assistant', 'system', 'tool')
- content: text
- metadata: jsonb — {tokens_used, model, latency_ms, tool_calls, intent_classified}
- created_at: timestamptz
- Partitioned by month on created_at for query performance

### action_logs (APPEND-ONLY — no UPDATE/DELETE permissions)
- id: uuid (PK)
- user_id: uuid (FK → users)
- transaction_id: uuid (FK → transactions, nullable)
- action_name: text (maps to action primitive catalog)
- action_inputs: jsonb
- action_outputs: jsonb (nullable)
- permission_level: enum('autonomous', 'user_approval', 'professional_required')
- approval_record: jsonb (nullable) — {approved_by, approved_at, approval_message_id}
- execution_status: enum('pending_approval', 'executing', 'completed', 'failed', 'cancelled')
- error_detail: text (nullable)
- executed_at: timestamptz
- completed_at: timestamptz


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: AI ORCHESTRATION — LANGGRAPH AGENT ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build the AI orchestration in services/orchestrator using LangGraph. The agent graph is
the brain of the system.

## 3.1 — Graph Structure

```
START
  │
  ▼
[classify_intent] ── determines which subgraph to route to
  │
  ├──→ [search_subgraph] ── property search, filtering, comparison
  │       ├── search_listings (tool)
  │       ├── fetch_property_detail (tool)
  │       ├── predict_price (tool)
  │       ├── fetch_hazard_data (tool)
  │       └── generate_response
  │
  ├──→ [viewing_subgraph] ── viewing scheduling, VR tours
  │       ├── schedule_viewing (tool, user_approval)
  │       ├── generate_vr_tour (tool)
  │       ├── simulate_renovation (tool)
  │       └── generate_response
  │
  ├──→ [transaction_subgraph] ── offers, negotiation, contracts
  │       ├── generate_offer (tool, user_approval)
  │       ├── submit_offer (tool, user_approval)
  │       ├── generate_contract (tool, professional_required)
  │       ├── submit_mortgage_preapproval (tool, user_approval)
  │       └── generate_response
  │
  ├──→ [document_subgraph] ── document analysis, explanation
  │       ├── analyze_document (tool)
  │       ├── explain_document (tool)
  │       ├── generate_document (tool)
  │       └── generate_response
  │
  ├──→ [information_subgraph] ── answering questions, explanations
  │       ├── retrieve_context (RAG from knowledge base)
  │       └── generate_response
  │
  ├──→ [escalation_subgraph] ── handoff to human
  │       ├── prepare_handoff_context
  │       ├── notify_agent
  │       └── generate_response
  │
  └──→ [generate_response] ── direct response for simple cases
          │
          ▼
        END (response streamed to user)
```

## 3.2 — State Schema (LangGraph State)

```python
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    # Conversation
    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_id: str
    journey_id: str
    channel: str  # 'web' | 'mobile' | 'line' | 'voice'
    language: str  # 'ja' | 'en'

    # Intent
    classified_intent: str
    intent_confidence: float

    # Journey context (loaded from DB at start of each turn)
    search_criteria: dict
    shortlisted_properties: list[dict]
    active_transactions: list[dict]
    journey_state_summary: str  # natural language summary for LLM context

    # Current turn
    pending_action: dict | None  # action awaiting user approval
    action_result: dict | None
    tool_calls: list[dict]

    # Control
    should_escalate: bool
    escalation_reason: str | None
    turn_count: int
    total_tokens_this_turn: int
```

## 3.3 — System Prompt Template

```
You are IKIGAI, an expert AI real estate advisor for the Japanese market. You help users
find, evaluate, and purchase residential properties in Japan.

## Your Capabilities
You can search property listings across major Japanese portals, predict fair market
values using ML models trained on Japanese transaction data, generate VR walkthroughs
and renovation simulations, analyze Japanese real estate documents (登記簿謄本,
重要事項説明書, contracts), orchestrate the entire purchase workflow from search to
settlement, and communicate fluently in both Japanese and English.

## Current User Context
- User: {user_name} ({language} speaker)
- Journey Status: {journey_state_summary}
- Search Criteria: {search_criteria_summary}
- Shortlisted Properties: {shortlisted_summary}
- Active Transactions: {transaction_summary}

## Communication Rules
1. Match the user's language. If they write in Japanese, respond in Japanese. If English,
   respond in English. If mixed, follow their dominant language.
2. Match their communication preference: {"detailed explanations" | "concise responses"}.
3. For Japanese responses, use です/ます form unless the user uses casual language.
4. When explaining Japanese real estate concepts to English speakers, provide the Japanese
   term (kanji + reading) alongside the English explanation.
5. Always explain your reasoning when making recommendations.
6. When presenting price predictions, always show the confidence interval and key factors.
7. Never present AI predictions as guarantees or professional appraisals.

## Action Rules
1. For autonomous actions (searching, fetching data), execute immediately and report results.
2. For user-approval actions (scheduling, submitting), ALWAYS present the exact details
   of what you will do and ask for explicit confirmation before executing.
3. For professional-required actions (contract finalization, 重要事項説明), explain that
   a licensed professional is required and coordinate the handoff.
4. NEVER fabricate property data, prices, or legal information.
5. If uncertain about a legal or regulatory question, say so and recommend consulting
   a professional.

## Current Date: {current_date}
```

## 3.4 — Tool Definitions

Define each tool using Claude's tool_use format. Each tool must have:
- A clear name matching the action primitive catalog from FSD Section 3.1
- A detailed description in both English and Japanese
- A strict input_schema (JSON Schema) validated before execution
- An output_schema for structured response parsing

Example tool definition:

```python
SEARCH_LISTINGS_TOOL = {
    "name": "search_listings",
    "description": "Search for residential property listings in Japan based on specified "
                   "criteria. Returns a list of matching properties with key details. "
                   "日本の住宅物件をクリテリアに基づいて検索します。",
    "input_schema": {
        "type": "object",
        "properties": {
            "prefectures": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Target prefectures (e.g., ['東京都', '神奈川県'])"
            },
            "municipalities": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Target municipalities (e.g., ['渋谷区', '目黒区'])"
            },
            "price_min": {"type": "integer", "description": "Minimum price in yen"},
            "price_max": {"type": "integer", "description": "Maximum price in yen"},
            "area_min_sqm": {"type": "number", "description": "Minimum area in square meters"},
            "building_types": {
                "type": "array",
                "items": {"type": "string", "enum": ["mansion", "kodate", "land"]},
            },
            "min_walk_minutes": {"type": "integer"},
            "max_walk_minutes": {"type": "integer"},
            "year_built_after": {"type": "integer"},
            "floor_plan_types": {
                "type": "array",
                "items": {"type": "string"},
                "description": "e.g., ['2LDK', '3LDK']"
            },
            "features_required": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Required features (e.g., ['auto_lock', 'south_facing'])"
            },
            "sort_by": {
                "type": "string",
                "enum": ["relevance", "price_asc", "price_desc", "newest", "closest_station"],
                "default": "relevance"
            },
            "limit": {"type": "integer", "default": 10, "maximum": 50}
        },
        "required": []
    }
}
```

Define similar tool schemas for ALL action primitives listed in FSD Section 3.1.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: WORKFLOW STATE MACHINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement the purchase journey state machine in packages/workflow using XState v5.

```typescript
import { setup, assign, fromPromise } from 'xstate';

export const propertyStateMachine = setup({
  types: {
    context: {} as {
      propertyId: string;
      journeyId: string;
      userId: string;
      offerPrice: number | null;
      agreedPrice: number | null;
      mortgageStatus: string;
      assignedAgentId: string | null;
      documents: Array<{ id: string; type: string; status: string }>;
      deadlines: Array<{ type: string; date: Date; remindersSent: number }>;
    },
    events: {} as
      | { type: 'SHORTLIST' }
      | { type: 'SCHEDULE_VIEWING'; date: Date }
      | { type: 'COMPLETE_VIEWING'; feedback: string }
      | { type: 'SUBMIT_OFFER'; price: number; conditions: object }
      | { type: 'OFFER_ACCEPTED' }
      | { type: 'OFFER_REJECTED' }
      | { type: 'COUNTER_OFFER'; price: number }
      | { type: 'ACCEPT_COUNTER' }
      | { type: 'REJECT_COUNTER' }
      | { type: 'BEGIN_CONTRACT_PREP' }
      | { type: 'IMPORTANT_MATTER_EXPLAINED' }
      | { type: 'CONTRACT_SIGNED'; earnestMoney: number }
      | { type: 'MORTGAGE_APPROVED'; amount: number }
      | { type: 'MORTGAGE_DECLINED' }
      | { type: 'SETTLEMENT_COMPLETE' }
      | { type: 'CANCEL'; reason: string }
      | { type: 'DROP' }
  },
  actions: {
    persistState: ({ context, event }) => {
      // Persist state transition to DB (shortlisted_properties.state + action_logs)
    },
    scheduleDeadlineReminders: ({ context }) => {
      // Schedule reminder notifications for upcoming deadlines
    },
    notifyAgent: ({ context }) => {
      // Notify assigned partner agent of state change
    },
    emitStateChangeEvent: ({ context }) => {
      // Publish to Kafka topic: user.journey.state-changed
    },
  },
  guards: {
    hasViewedProperty: ({ context }) => {
      // Check that user has completed at least one viewing (physical or virtual)
      return true; // implementation checks DB
    },
    hasMortgagePreapproval: ({ context }) => {
      return ['preapproved', 'not_needed'].includes(context.mortgageStatus);
    },
    importantMatterExplained: ({ context }) => {
      return context.documents.some(
        d => d.type === 'important_matter_explanation' && d.status === 'approved'
      );
    },
  },
}).createMachine({
  id: 'propertyPurchase',
  initial: 'shortlisted',
  context: { /* initial context */ },
  states: {
    shortlisted: {
      on: {
        SCHEDULE_VIEWING: { target: 'viewing_scheduled' },
        DROP: { target: 'dropped' },
      },
    },
    viewing_scheduled: {
      on: {
        COMPLETE_VIEWING: { target: 'viewed' },
        CANCEL: { target: 'dropped' },
      },
    },
    viewed: {
      on: {
        SUBMIT_OFFER: {
          target: 'offer_submitted',
          guard: 'hasViewedProperty',
          actions: [assign({ offerPrice: ({ event }) => event.price })],
        },
        SCHEDULE_VIEWING: { target: 'viewing_scheduled' }, // additional viewings
        DROP: { target: 'dropped' },
      },
    },
    offer_submitted: {
      on: {
        OFFER_ACCEPTED: { target: 'contract_prep' },
        OFFER_REJECTED: { target: 'viewed' },
        COUNTER_OFFER: { target: 'negotiating' },
        CANCEL: { target: 'cancelled' },
      },
    },
    negotiating: {
      on: {
        ACCEPT_COUNTER: {
          target: 'contract_prep',
          actions: [assign({ agreedPrice: ({ event }) => event.price })],
        },
        REJECT_COUNTER: { target: 'viewed' },
        SUBMIT_OFFER: { target: 'offer_submitted' }, // counter-counter
        CANCEL: { target: 'cancelled' },
      },
    },
    contract_prep: {
      // Parallel sub-states for concurrent preparation tasks
      type: 'parallel',
      states: {
        important_matter: {
          initial: 'pending',
          states: {
            pending: { on: { IMPORTANT_MATTER_EXPLAINED: 'completed' } },
            completed: { type: 'final' },
          },
        },
        mortgage: {
          initial: 'pending',
          states: {
            pending: {
              on: {
                MORTGAGE_APPROVED: 'approved',
                MORTGAGE_DECLINED: 'declined',
              },
            },
            approved: { type: 'final' },
            declined: { /* handle — may cancel transaction */ },
          },
        },
      },
      on: {
        CONTRACT_SIGNED: {
          target: 'contract_signed',
          guard: 'importantMatterExplained',
        },
        CANCEL: { target: 'cancelled' },
      },
    },
    contract_signed: {
      on: {
        SETTLEMENT_COMPLETE: { target: 'settled' },
        CANCEL: { target: 'cancelled' },
      },
    },
    settled: { type: 'final' },
    dropped: { type: 'final' },
    cancelled: { type: 'final' },
  },
});
```

Every state transition MUST trigger:
1. Database update (shortlisted_properties.state)
2. Action log entry
3. Kafka event emission
4. Deadline recalculation if applicable
5. Notification to relevant parties (user, agent)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: API CONTRACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.1 — tRPC Router Structure (TypeScript API)

```typescript
// packages/api/src/root.ts
export const appRouter = createTRPCRouter({
  auth: authRouter,           // login, register, session, MFA
  user: userRouter,           // profile CRUD, preferences, eKYC status
  property: propertyRouter,   // search, detail, shortlist, compare
  pricing: pricingRouter,     // predict, explain, area trends
  journey: journeyRouter,     // status, state transitions, deadlines
  transaction: transactionRouter, // offers, negotiation, mortgage, settlement
  document: documentRouter,   // upload, analyze, generate, download
  vr: vrRouter,               // generate model, simulate renovation, get viewer URL
  conversation: conversationRouter, // history, context, channel bridging
  notification: notificationRouter, // preferences, history
  admin: adminRouter,         // monitoring, user management, model metrics (admin only)
});
```

## 5.2 — Orchestrator API (Python FastAPI)

```
POST /api/v1/chat
  Request: { user_id, message, channel, conversation_id? }
  Response: SSE stream of { type: 'text' | 'tool_call' | 'tool_result' | 'action_request', data }
  - 'text': streamed text response tokens
  - 'tool_call': notification that a tool is being invoked (for UI loading states)
  - 'tool_result': result of an autonomous tool execution (for UI updates)
  - 'action_request': request for user approval (UI renders approval dialog)

POST /api/v1/action/approve
  Request: { user_id, action_log_id, approved: boolean, message? }
  Response: { status, result? }

GET /api/v1/journey/{user_id}/context
  Response: Full journey context for LangGraph state initialization

POST /api/v1/document/analyze
  Request: multipart { user_id, property_id?, document_type, file }
  Response: { document_id, analysis_status: 'processing' }
  (Results delivered async via Kafka → notification)

POST /api/v1/pricing/predict
  Request: { property_id }
  Response: { predicted_price, confidence_lower, confidence_upper, factors, explanation }

POST /api/v1/vr/generate
  Request: { property_id, floor_plan_source: 'listing' | 'upload', file? }
  Response: { model_id, viewer_url, status }

POST /api/v1/vr/simulate
  Request: { model_id, modifications: [{ type, params }] }
  Response: { modified_model_url, cost_estimate, structural_warnings }
```


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: IMPLEMENTATION ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build in this exact order. Each step must be fully functional and tested before
proceeding to the next. Each step builds on the previous.

### STEP 1: Foundation
1. Initialize Turborepo monorepo with pnpm workspace
2. Configure Biome (linting + formatting) with strict rules
3. Configure TypeScript with strict mode across all packages
4. Set up packages/db with Drizzle ORM — implement FULL schema from Section 2
5. Set up packages/validators with ALL Zod schemas mirroring the DB schema
6. Set up packages/types — auto-generate TypeScript types from Zod schemas
7. Write database seed script with realistic Japanese test data (at least 500 properties
   across Tokyo 23 wards, 10 test users with various personas)
8. Set up packages/logger with Pino, structured JSON output
9. Docker Compose for local development: PostgreSQL 16 (with pgvector, PostGIS),
   Redis 7, Meilisearch, Kafka (Redpanda as lightweight alternative for local dev)

### STEP 2: Authentication & User Management
1. Set up packages/auth with Better Auth
2. Implement auth flows: email magic link, Google OAuth, LINE Login
3. Set up apps/web with Next.js 15 — App Router, basic layout, auth pages
4. Implement user profile CRUD via tRPC
5. Implement language preference switching (ja/en) with next-intl
6. Step-up authentication for high-stakes actions
7. Tests: auth flow E2E, session management, token refresh

### STEP 3: Property Data Pipeline
1. Build services/scraper — Scrapy spiders for SUUMO and HOME'S
2. Implement Pydantic models for scraped data validation
3. Deduplication pipeline with recordlinkage
4. PostgreSQL upsert logic with conflict resolution
5. Meilisearch sync via Debezium CDC pipeline (simplified: direct sync for MVP,
   CDC for production)
6. Build services/embedding — Cohere embedding generation for property descriptions
7. pgvector upsert for embeddings
8. Tests: scraper unit tests with recorded responses, dedup accuracy tests

### STEP 4: Property Search & Display
1. Implement property search in tRPC router — hybrid query:
   Meilisearch full-text + PostgreSQL structured filters + pgvector semantic similarity
2. Build property listing page (apps/web) — server-rendered, ISR
3. Build property detail page with all data fields, map (MapLibre + GSI tiles),
   image gallery, floor plan display
4. Build search interface with filters matching the search_criteria schema
5. Implement shortlisting (save/unsave properties)
6. Implement comparison view (side-by-side for 2-3 properties)
7. Mobile: implement same screens in apps/mobile with Expo Router
8. Tests: search relevance tests with curated queries, page rendering tests

### STEP 5: AI Chat — Core
1. Build services/orchestrator — FastAPI skeleton with health check
2. Implement LangGraph agent graph (Section 3.1) — start with classify_intent node
   and information_subgraph only
3. Implement system prompt template (Section 3.3)
4. Integrate Anthropic Claude API via LangChain's ChatAnthropic
5. Implement conversation persistence (PostgreSQL via LangGraph checkpointer)
6. Build chat UI in apps/web using Vercel AI SDK's useChat with streaming
7. Implement SSE streaming from orchestrator → Next.js → browser
8. Implement journey context loading (GET /journey/{user_id}/context → AgentState)
9. Add search_subgraph with search_listings tool — the AI can now search properties
   via conversation
10. Tests: intent classification accuracy (prepare 200+ test utterances in ja/en),
    conversation flow tests, streaming reliability tests

### STEP 6: Price Prediction
1. Set up ml/ directory — DVC for data tracking, MLflow for experiment tracking
2. Download and process MLIT transaction price data for Tokyo
3. Feature engineering pipeline (Section 4.3 of FSD)
4. Train LightGBM model, evaluate with temporal split
5. SHAP value computation for explainability
6. Build services/pricing-model — FastAPI serving endpoint
7. Integrate into LangGraph as predict_price tool
8. Build price prediction display in property detail page
9. Natural language explanation generation (SHAP values → Claude → explanation text)
10. Tests: model accuracy (MAPE < 8% target), API latency (< 3s), explanation quality

### STEP 7: Document Intelligence
1. Build services/document-ocr — FastAPI skeleton
2. Integrate Google Cloud Vision API for OCR
3. Implement registry transcript (登記簿謄本) parser — extract structured data from
   OCR output using rule-based extraction + Claude for ambiguous cases
4. Implement risk flag detection (Section 6.2 of FSD)
5. Implement document upload flow in apps/web (S3 presigned URL upload)
6. Integrate into LangGraph as analyze_document and explain_document tools
7. Build document viewer UI with highlighted risk flags and explanations
8. Tests: OCR accuracy on test documents, extraction accuracy, risk flag precision/recall

### STEP 8: VR & 3D Visualization
1. Build services/vr-engine — floor plan image → structured data pipeline
2. Train/fine-tune floor plan recognition CNN on Japanese 間取り図 dataset
3. Implement procedural 3D model generation (trimesh → glTF)
4. Build material library with Japanese construction materials
5. Build 3D viewer component in packages/vr using React Three Fiber
6. Integrate WebXR for VR headset support
7. Implement renovation simulation (wall removal, material swap)
8. Implement cost estimation for modifications
9. Integrate into LangGraph as generate_vr_tour and simulate_renovation tools
10. Tests: floor plan recognition accuracy, 3D model rendering correctness, FPS benchmarks

### STEP 9: LAM Action Engine — Full Implementation
1. Implement ALL remaining action primitives from FSD Section 3.1:
   - SCHEDULE_VIEWING (with mock agent communication for MVP)
   - GENERATE_OFFER (買付証明書 generation)
   - SUBMIT_MORTGAGE_PREAPPROVAL (with partner bank API or form generation)
   - GENERATE_CONTRACT (売買契約書 draft from template)
   - SEND_MESSAGE (email + LINE)
   - REQUEST_BUILDING_INSPECTION
   - FETCH_REGISTRY (登記情報提供サービス integration)
   - FETCH_HAZARD_MAP
2. Implement permission enforcement layer — check permission level before EVERY execution
3. Implement user approval flow: action_request → UI approval dialog → approve/reject →
   execute/cancel
4. Implement action logging (append-only action_logs table)
5. Pre-flight safety checks (Section 3.3 of FSD)
6. Tests: permission enforcement tests (attempt to bypass each level), approval flow E2E,
   action idempotency tests

### STEP 10: Workflow State Machine — Full Implementation
1. Implement XState v5 machine from Section 4 in packages/workflow
2. Connect to database persistence (state transitions → shortlisted_properties.state)
3. Implement parallel state tracking (multiple properties in different states)
4. Implement deadline management and reminder scheduling
5. Kafka event emission on every state transition
6. Connect LangGraph agent to workflow state — agent reads current state to determine
   available actions and guide the user
7. Build journey dashboard UI showing progress through the state machine
8. Tests: state machine transition tests (every valid and invalid transition),
   deadline reminder tests, concurrent property state tests

### STEP 11: LINE Channel Integration
1. Build apps/line-bot on Cloudflare Workers with Hono
2. Implement LINE webhook handler with signature verification
3. Implement message routing: LINE message → orchestrator /chat API → response → LINE reply
4. Build Flex Message templates for property cards, price predictions, action approvals
5. Implement LIFF (LINE Front-end Framework) pages for:
   - Property detail view
   - 3D/VR viewer
   - Document viewer
   - Action approval forms
6. Implement channel bridging: LINE userId ↔ IKIGAI userId via Better Auth
7. Context continuity: conversation started on LINE continues seamlessly on web and vice versa
8. Tests: webhook signature verification, message formatting, channel bridging E2E

### STEP 12: Partner Agent Dashboard
1. Build apps/agent-dashboard — Next.js 15
2. Implement agent authentication and role-based access
3. Lead management: view assigned journeys, property interest, user requirements
4. Communication: respond to user messages via the platform (routed through orchestrator)
5. Document review: review and approve AI-generated documents
6. Calendar: view and manage scheduled viewings
7. Analytics: conversion metrics, response time tracking
8. Tests: RBAC enforcement, document review workflow E2E

### STEP 13: Infrastructure & Deployment
1. Write all Terraform modules (Section 1.5)
2. Build Docker images for all services (multi-stage builds, distroless base images)
3. Write Helm charts for Kubernetes deployment
4. Configure Istio service mesh
5. Set up GitHub Actions CI/CD pipeline (all 12 stages from Section 1.5)
6. Deploy to staging environment
7. Run full E2E test suite against staging
8. Performance testing: k6 load tests simulating 100 concurrent chat sessions
9. Security audit: OWASP ZAP scan, dependency audit, secrets scan
10. Deploy to production with canary rollout
11. Configure monitoring dashboards (Grafana) and alerting (PagerDuty)
12. Write runbooks for common operational scenarios

### STEP 14: Testing & Quality — Comprehensive
1. Unit test coverage: minimum 80% across all packages and services
2. Integration tests: every tRPC route, every FastAPI endpoint, every tool execution
3. E2E tests: complete user journeys
   - Scenario A: Japanese buyer searches → shortlists → views → makes offer (happy path)
   - Scenario B: English-speaking buyer → search → price prediction → VR tour → questions
   - Scenario C: LINE user → search → channel switch to web → continue journey
   - Scenario D: Document upload → analysis → risk detection → explanation
4. AI evaluation: Promptfoo test suite with 500+ test cases covering:
   - Intent classification accuracy (target: 95%+)
   - Japanese language quality (fluency, formality matching)
   - English explanation quality (cultural context accuracy)
   - Tool selection accuracy (correct tool for the task)
   - Safety (never fabricates data, never executes without approval when required)
   - Edge cases (ambiguous requests, adversarial inputs, multi-language mixing)
5. Load testing: sustain 100 concurrent chat sessions with < 3s p95 response time
6. Accessibility: WCAG 2.1 AA compliance for all web UIs
7. Security: penetration testing on auth flows, API endpoints, file upload


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: CRITICAL IMPLEMENTATION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These rules are NON-NEGOTIABLE. Violating any of them is a blocking issue.

1. **Type Safety End-to-End**: No `any` types in TypeScript. Every API boundary has a
   Zod schema. Python services use Pydantic models for all inputs and outputs. tRPC
   ensures frontend-backend type safety. There is ONE source of truth for each data
   shape (Zod schema in packages/validators), and everything else derives from it.

2. **Never Trust Client Input**: Every input from every channel (web, mobile, LINE, voice)
   is validated server-side against Zod/Pydantic schemas BEFORE processing. This includes
   chat messages (length limits, sanitization), file uploads (type checking, size limits,
   malware scanning via ClamAV), and action approval responses.

3. **Immutable Audit Trail**: The action_logs table is append-only. No application code
   may issue UPDATE or DELETE on this table. The database role used by the application
   has only INSERT and SELECT permissions on this table. This is enforced at the
   PostgreSQL role level, not just application level.

4. **Graceful Degradation**: If any non-critical service is down (VR engine, price
   prediction, document OCR), the core chat and search functionality MUST continue
   working. The orchestrator must handle tool execution failures gracefully: inform the
   user, suggest alternatives, and log the failure for debugging.

5. **Japanese-First Design**: All UI text, error messages, legal documents, and AI
   responses default to Japanese. English is a supported secondary language, not an
   afterthought. Date formats use Japanese conventions (令和/西暦 toggle). Currency
   always displays as ¥ with man (万) notation option for large amounts (e.g.,
   ¥7,200万 instead of ¥72,000,000). Area displays in both 平米 and 坪.

6. **Privacy by Default**: User data is encrypted at rest (field-level for PII). Logs
   never contain PII (use user IDs, not names or emails). Non-production environments
   use anonymized data. Analytics (PostHog) is self-hosted and configured to anonymize
   IP addresses.

7. **AI Safety**: The LangGraph agent CANNOT execute high-stakes actions without passing
   through the permission enforcement layer. This layer is implemented as a separate
   module that wraps every tool execution — it is NOT implemented inside the LLM prompt
   (prompts can be circumvented). The enforcement layer checks: (a) the action's
   permission level, (b) the user's authentication level, (c) the workflow state
   validity, and (d) the pre-flight safety checks, BEFORE allowing execution.

8. **Idempotent Actions**: All action primitives that modify external state must be
   idempotent. If the same action is accidentally triggered twice (network retry,
   duplicate webhook), the second execution must detect the duplicate and no-op.
   Implementation: each action execution has a unique idempotency key stored in Redis
   with a TTL of 24 hours.

9. **Cost Awareness**: LLM API calls are expensive. Implement:
   - Token tracking per conversation, per user, per day
   - Model routing: use claude-sonnet-4-20250514 for simple tasks, claude-opus-4-20250514 only for
     complex reasoning (document analysis, negotiation strategy)
   - Response caching: identical queries within a session hit cache
   - Streaming: always stream responses to improve perceived latency
   - Budget alerts: if a single conversation exceeds $5 in API costs, alert ops

10. **Observability from Day One**: Every service emits structured logs (Pino/structlog),
    metrics (Prometheus), and traces (OpenTelemetry) from the FIRST line of code. Do not
    add observability retroactively. Every LLM call logs: model, prompt token count,
    completion token count, latency, tool calls made, and cost.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: FILE-BY-FILE GENERATION ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When generating code, produce files in this exact order for STEP 1. After STEP 1 is
complete and verified, I will instruct you to proceed to STEP 2, and so on.

### STEP 1 Files:

1.  /package.json (root — workspace config)
2.  /pnpm-workspace.yaml
3.  /turbo.json
4.  /biome.json
5.  /tsconfig.base.json (shared TS config)
6.  /.env.example
7.  /docker/docker-compose.yml (local dev: PostgreSQL, Redis, Meilisearch, Redpanda)
8.  /docker/postgres/init.sql (enable extensions: pgvector, postgis, pg_trgm, pgcrypto)
9.  /packages/db/package.json
10. /packages/db/tsconfig.json
11. /packages/db/drizzle.config.ts
12. /packages/db/src/index.ts (connection + export)
13. /packages/db/src/schema/users.ts
14. /packages/db/src/schema/properties.ts
15. /packages/db/src/schema/predictions.ts
16. /packages/db/src/schema/hazards.ts
17. /packages/db/src/schema/journeys.ts
18. /packages/db/src/schema/transactions.ts
19. /packages/db/src/schema/documents.ts
20. /packages/db/src/schema/conversations.ts
21. /packages/db/src/schema/action-logs.ts
22. /packages/db/src/schema/index.ts (barrel export)
23. /packages/db/src/seed.ts (500 properties + 10 users)
24. /packages/db/src/migrate.ts
25. /packages/validators/package.json
26. /packages/validators/src/user.ts
27. /packages/validators/src/property.ts
28. /packages/validators/src/journey.ts
29. /packages/validators/src/transaction.ts
30. /packages/validators/src/document.ts
31. /packages/validators/src/conversation.ts
32. /packages/validators/src/index.ts
33. /packages/types/package.json
34. /packages/types/src/index.ts (z.infer<> from validators)
35. /packages/logger/package.json
36. /packages/logger/src/index.ts (Pino config)

After generating all files for a step, provide a verification checklist:
- [ ] All files created
- [ ] TypeScript compiles with zero errors
- [ ] Docker Compose starts all services
- [ ] Database migrations run successfully
- [ ] Seed script populates test data
- [ ] All Zod schemas validate sample data correctly

Await my "PROCEED TO STEP N" instruction before generating the next step's files.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9: CODING STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### TypeScript
- Strict mode everywhere. No `any`. No `@ts-ignore` without a linked issue number.
- Prefer `const` over `let`. Never use `var`.
- Use named exports. No default exports (Next.js page/layout exceptions allowed).
- Functions: prefer arrow functions for callbacks, regular functions for top-level.
- Error handling: use Result types (neverthrow library) for business logic errors.
  Only throw for truly exceptional/unrecoverable situations.
- Naming: camelCase for variables/functions, PascalCase for types/classes/components,
  SCREAMING_SNAKE_CASE for constants, kebab-case for file names.
- Every exported function has a JSDoc comment.

### Python
- Type hints on ALL function signatures and return types.
- Pydantic v2 models for all data structures.
- async/await for all I/O operations.
- Error handling: custom exception classes inheriting from a base AppError.
  FastAPI exception handlers convert to structured error responses.
- Naming: snake_case for variables/functions, PascalCase for classes, SCREAMING_SNAKE
  for constants.
- Docstrings: Google style on all public functions.
- Formatting: Ruff (linter + formatter).

### SQL (Drizzle migrations)
- All tables have created_at and updated_at.
- All foreign keys have ON DELETE behavior explicitly specified.
- All indexes are explicitly named with the convention: idx_{table}_{columns}.
- Use enums via pgEnum for all enumerated types (not string columns).

### Git
- Conventional Commits: feat:, fix:, chore:, docs:, refactor:, test:, ci:
- Branch strategy: main (production), develop (staging), feature/* (development)
- PR template: requires description, testing steps, and screenshot/recording for UI changes
- Squash merge to develop, merge commit to main
```

---

This prompt is self-contained. Hand it to your engineering team or AI coding agent and execute step by step. Each section cross-references the PRD and FSD where appropriate. The implementation order ensures that foundational infrastructure is solid before building features on top of it, and that each feature is independently testable before integration.