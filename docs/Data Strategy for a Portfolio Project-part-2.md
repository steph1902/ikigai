

You're right — I've committed to this, so let me finish it properly. Let me continue from where I left off and complete all remaining sections.

---

```typescript
// Continuing packages/ui/src/components/compliance/disclaimers.tsx

export function AIGeneratedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
      <SparklesIcon className="w-3 h-3" />
      AI生成
    </span>
  );
}

export function LegalAdviceDisclaimer() {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
      <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p>
        本情報は一般的な参考情報であり、法的助言ではありません。
        具体的なお取引については、宅地建物取引士または弁護士にご相談ください。
      </p>
    </div>
  );
}

export function DataConsentBanner({ onAccept, onCustomize, onReject }: {
  onAccept: () => void;
  onCustomize: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-lg p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-sm font-bold mb-2">プライバシーについて</h3>
        <p className="text-xs text-neutral-600 mb-4">
          当サイトでは、サービス提供・改善のためにCookieおよび類似技術を使用しています。
          「同意する」をクリックすると、
          <a href="/privacy" className="underline">プライバシーポリシー</a>
          に基づくデータ利用に同意いただいたことになります。
        </p>
        <div className="flex gap-3">
          <button onClick={onAccept} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg">
            同意する
          </button>
          <button onClick={onCustomize} className="px-4 py-2 border border-neutral-300 text-sm rounded-lg">
            設定をカスタマイズ
          </button>
          <button onClick={onReject} className="px-4 py-2 text-sm text-neutral-500">
            必要最小限のみ
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

# Section 16: Performance Budget & Optimization

## 16.1 Performance Budgets

```typescript
// apps/web/performance.config.ts

/**
 * Performance budgets for the web application.
 * Enforced in CI via Lighthouse CI and bundlewatch.
 */

export const PERFORMANCE_BUDGETS = {
  // ─── Core Web Vitals Targets ─────────────────────────
  webVitals: {
    LCP: 2500,    // Largest Contentful Paint: < 2.5s
    FID: 100,     // First Input Delay: < 100ms
    CLS: 0.1,     // Cumulative Layout Shift: < 0.1
    INP: 200,     // Interaction to Next Paint: < 200ms
    TTFB: 800,    // Time to First Byte: < 800ms
  },

  // ─── Bundle Size Budgets ─────────────────────────────
  bundles: {
    // Initial JS loaded on every page
    'main-bundle': {
      maxSize: '120kb',  // gzipped
      warning: '100kb',
    },
    // Search page — most complex page
    'search-page': {
      maxSize: '80kb',
      warning: '60kb',
    },
    // Property detail page
    'property-detail': {
      maxSize: '70kb',
      warning: '55kb',
    },
    // AI chat panel — lazy loaded
    'ai-chat': {
      maxSize: '50kb',
      warning: '40kb',
    },
    // Map component — lazy loaded
    'map-view': {
      maxSize: '90kb',  // Map libraries are heavy
      warning: '75kb',
    },
  },

  // ─── API Response Times ──────────────────────────────
  api: {
    'property-search': { p50: 200, p95: 500, p99: 1000 },
    'property-detail': { p50: 100, p95: 300, p99: 500 },
    'ai-chat-response': { p50: 2000, p95: 5000, p99: 10000 },  // Streaming, so first token matters more
    'ai-first-token': { p50: 500, p95: 1500, p99: 3000 },
    'saved-properties': { p50: 150, p95: 400, p99: 800 },
    'price-estimation': { p50: 1000, p95: 3000, p99: 5000 },
  },

  // ─── Image Budgets ───────────────────────────────────
  images: {
    propertyThumbnail: { maxSize: '30kb', format: 'webp', dimensions: '400x300' },
    propertyGallery: { maxSize: '80kb', format: 'webp', dimensions: '800x600' },
    propertyHero: { maxSize: '120kb', format: 'webp', dimensions: '1200x800' },
    floorPlan: { maxSize: '50kb', format: 'webp', dimensions: '800x800' },
  },
} as const;
```

## 16.2 Optimization Strategies

```typescript
// apps/web/next.config.ts — relevant optimization config

import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ─── Image Optimization ─────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ─── Compression ────────────────────────────────────
  compress: true,

  // ─── Headers for caching ────────────────────────────
  async headers() {
    return [
      {
        source: '/api/properties/search',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' },
        ],
      },
      {
        source: '/api/properties/:id',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' },
        ],
      },
      // Static assets — aggressive caching
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ─── Experimental optimizations ─────────────────────
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      'recharts',
      'date-fns',
    ],
  },

  // ─── Webpack customization ──────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree-shake date-fns locales — only keep Japanese and English
      config.resolve.alias = {
        ...config.resolve.alias,
        'date-fns/locale': 'date-fns/locale/ja',
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
```

## 16.3 Critical Rendering Path

```typescript
// apps/web/src/app/(public)/properties/search/page.tsx

import { Suspense } from 'react';
import { SearchFilters } from '@/components/search/filters';
import { PropertyGrid } from '@/components/search/property-grid';
import { SearchResultsSkeleton } from '@/components/search/skeleton';
import { MapToggle } from '@/components/search/map-toggle';

/**
 * Search Results Page — Performance-Critical
 *
 * Rendering strategy:
 * 1. Server-render the shell (filters, layout) immediately
 * 2. Stream property results as they arrive from the API
 * 3. Lazy-load the map component (heavy) only when user toggles to map view
 * 4. Prefetch next page of results on scroll
 */

// This is a Server Component — renders on the server
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Filters render immediately — no data dependency */}
      <SearchFilters initialValues={params} />

      {/* Results stream in via Suspense */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <Suspense fallback={<div className="h-6 w-48 bg-neutral-100 rounded animate-pulse" />}>
            <SearchResultsCount params={params} />
          </Suspense>
          <MapToggle />
        </div>

        <Suspense fallback={<SearchResultsSkeleton count={12} />}>
          <PropertyGrid params={params} />
        </Suspense>
      </div>
    </div>
  );
}

// Separate async component for result count — streams independently
async function SearchResultsCount({ params }: { params: Record<string, string> }) {
  const { total } = await searchProperties(params);
  return (
    <p className="text-sm text-neutral-600">
      <span className="font-bold text-neutral-900">{total.toLocaleString('ja-JP')}</span>
      件の物件が見つかりました
    </p>
  );
}
```

```typescript
// apps/web/src/components/search/property-grid.tsx

import dynamic from 'next/dynamic';

// Lazy-load map — it's ~90kb and only needed when user toggles to map view
const PropertyMap = dynamic(
  () => import('./property-map').then(mod => mod.PropertyMap),
  {
    loading: () => (
      <div className="h-[600px] bg-neutral-100 rounded-xl flex items-center justify-center">
        <p className="text-neutral-400">地図を読み込み中...</p>
      </div>
    ),
    ssr: false, // Map requires browser APIs
  }
);

// Lazy-load AI chat panel
const AIChatPanel = dynamic(
  () => import('../ai/chat-panel').then(mod => mod.AIChatPanel),
  {
    loading: () => null, // Invisible until needed
    ssr: false,
  }
);
```

## 16.4 Database Query Optimization

```typescript
// services/api/src/queries/property-search.ts

import { db } from '@repo/database';
import { sql } from 'drizzle-orm';

/**
 * Property search query — optimized for common filter patterns.
 *
 * Indexes required (defined in migration):
 *   - properties(ward, status) — most searches filter by ward
 *   - properties(price) — range queries
 *   - properties(nearest_station, walk_minutes) — station proximity
 *   - properties(layout) — layout filter
 *   - properties(construction_date) — earthquake standard filter
 *   - properties(listed_at DESC) — sort by newest
 *   - properties(price_per_sqm) — sort by value
 *   - SPATIAL INDEX on properties(location) — for map bounding box queries
 */

export async function searchProperties(params: SearchParams) {
  // Build query dynamically based on provided filters
  const conditions: SQL[] = [
    sql`status = 'active'`, // Always filter to active listings
  ];

  if (params.ward) {
    conditions.push(sql`ward = ${params.ward}`);
  }

  if (params.priceMin) {
    conditions.push(sql`price >= ${params.priceMin}`);
  }

  if (params.priceMax) {
    conditions.push(sql`price <= ${params.priceMax}`);
  }

  if (params.layouts?.length) {
    conditions.push(sql`layout = ANY(${params.layouts})`);
  }

  if (params.walkMinutesMax) {
    conditions.push(sql`walk_minutes <= ${params.walkMinutesMax}`);
  }

  if (params.earthquakeStandard === '新耐震') {
    conditions.push(sql`construction_date >= '1981-06-01'`);
  }

  if (params.areaMin) {
    conditions.push(sql`exclusive_area >= ${params.areaMin}`);
  }

  if (params.boundingBox) {
    // Map view — spatial query
    conditions.push(sql`
      ST_Within(
        location,
        ST_MakeEnvelope(
          ${params.boundingBox.west},
          ${params.boundingBox.south},
          ${params.boundingBox.east},
          ${params.boundingBox.north},
          4326
        )
      )
    `);
  }

  const where = sql.join(conditions, sql` AND `);

  // Sort order
  const orderBy = {
    recommended: sql`score DESC, listed_at DESC`,
    priceAsc: sql`price ASC`,
    priceDesc: sql`price DESC`,
    newest: sql`listed_at DESC`,
    areaDesc: sql`exclusive_area DESC`,
    walkMinutes: sql`walk_minutes ASC`,
  }[params.sort ?? 'recommended'];

  // Use cursor-based pagination for consistent results
  const limit = params.limit ?? 20;

  const [results, countResult] = await Promise.all([
    db.execute(sql`
      SELECT *
      FROM properties
      WHERE ${where}
      ORDER BY ${orderBy}
      LIMIT ${limit}
      OFFSET ${(params.page ?? 0) * limit}
    `),
    db.execute(sql`
      SELECT COUNT(*)::int as total
      FROM properties
      WHERE ${where}
    `),
  ]);

  return {
    results: results.rows,
    total: countResult.rows[0].total,
    page: params.page ?? 0,
    limit,
    hasMore: (params.page ?? 0) * limit + results.rows.length < countResult.rows[0].total,
  };
}
```

---

# Section 17: Deployment & Infrastructure

## 17.1 Infrastructure Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                        Cloudflare (CDN / WAF)                      │
│                    DDoS protection, edge caching                   │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │       Vercel (Frontend)      │
            │                              │
            │  ┌────────────────────────┐  │
            │  │  Next.js App           │  │
            │  │  - SSR / ISR / Static  │  │
            │  │  - Edge Middleware     │  │
            │  │  - Image Optimization  │  │
            │  └────────────────────────┘  │
            └──────────────┬──────────────┘
                           │ API calls
            ┌──────────────┴──────────────────────────┐
            │          Railway / Fly.io (Backend)       │
            │                                           │
            │  ┌─────────────┐  ┌──────────────────┐  │
            │  │ API Service  │  │  AI Agent Service │  │
            │  │ (Hono)       │  │  (Mastra)         │  │
            │  └──────┬──────┘  └────────┬─────────┘  │
            │         │                   │             │
            │  ┌──────┴───────────────────┴──────────┐ │
            │  │          Shared Infrastructure       │ │
            │  │                                      │ │
            │  │  ┌──────────┐  ┌─────────────────┐  │ │
            │  │  │PostgreSQL│  │     Redis        │  │ │
            │  │  │ (Neon)   │  │  (Upstash)      │  │ │
            │  │  └──────────┘  └─────────────────┘  │ │
            │  │                                      │ │
            │  │  ┌──────────────────────────────┐   │ │
            │  │  │  Blob Storage (R2/S3)        │   │ │
            │  │  │  - Property images           │   │ │
            │  │  │  - Generated floor plans     │   │ │
            │  │  │  - Document storage          │   │ │
            │  │  └──────────────────────────────┘   │ │
            │  └──────────────────────────────────────┘ │
            └───────────────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │    External Services         │
            │                              │
            │  ┌───────────┐ ┌──────────┐ │
            │  │ Anthropic  │ │  LINE    │ │
            │  │ Claude API │ │  API     │ │
            │  └───────────┘ └──────────┘ │
            │                              │
            │  ┌───────────┐ ┌──────────┐ │
            │  │ PostHog    │ │ Resend   │ │
            │  │ Analytics  │ │ Email    │ │
            │  └───────────┘ └──────────┘ │
            └──────────────────────────────┘
```

## 17.2 Service Selection Rationale

```typescript
// docs/infrastructure-decisions.ts (documentation, not runtime code)

/**
 * Infrastructure Decisions & Rationale
 *
 * Guiding principle: Use managed services to minimize ops overhead.
 * This is a portfolio project — demonstrate architecture, not DevOps prowess.
 */

const INFRASTRUCTURE_DECISIONS = {
  frontend: {
    choice: 'Vercel',
    rationale: [
      'Native Next.js support with zero-config deployment',
      'Edge network with Tokyo PoP for low latency in Japan',
      'Built-in image optimization eliminates need for separate CDN',
      'Preview deployments per PR for easy review',
      'Free tier is generous enough for a portfolio project',
    ],
    alternatives_considered: ['Cloudflare Pages', 'AWS Amplify'],
    cost: 'Free tier (hobby) → ~$20/mo Pro if needed',
  },

  backend: {
    choice: 'Railway',
    rationale: [
      'Simple container deployment from GitHub',
      'Tokyo region available (ap-northeast-1)',
      'Built-in PostgreSQL and Redis add-ons',
      'Easy environment variable management',
      'Reasonable free tier / starter pricing',
    ],
    alternatives_considered: ['Fly.io', 'Render', 'AWS ECS'],
    cost: '~$5-15/mo starter',
  },

  database: {
    choice: 'Neon (Serverless PostgreSQL)',
    rationale: [
      'Serverless — scales to zero when idle (cost efficient for portfolio)',
      'Branching for preview environments',
      'PostgreSQL compatible — no vendor lock-in',
      'PostGIS extension available for spatial queries',
      'Connection pooling built-in (important for serverless)',
    ],
    alternatives_considered: ['Supabase', 'PlanetScale', 'Railway Postgres'],
    cost: 'Free tier → ~$19/mo Pro',
  },

  cache: {
    choice: 'Upstash Redis',
    rationale: [
      'Serverless — pay per request, scales to zero',
      'Global replication with Tokyo region',
      'REST API available (works from edge functions)',
      'Built-in rate limiting primitives',
    ],
    alternatives_considered: ['Railway Redis', 'Vercel KV'],
    cost: 'Free tier → ~$10/mo',
  },

  ai: {
    choice: 'Anthropic Claude API (via Mastra)',
    rationale: [
      'Claude excels at Japanese language understanding',
      'Strong structured output / tool use capabilities',
      'Mastra provides agent orchestration framework',
      'Good rate limits on standard tier',
    ],
    cost: '~$10-30/mo depending on usage',
  },

  email: {
    choice: 'Resend',
    rationale: [
      'Simple API, excellent developer experience',
      'React Email for template authoring',
      'Good deliverability',
    ],
    cost: 'Free tier (100 emails/day)',
  },

  analytics: {
    choice: 'PostHog (Cloud)',
    rationale: [
      'Self-hostable if data residency becomes a concern',
      'Feature flags, session replay, analytics in one tool',
      'Generous free tier (1M events/month)',
      'No sampling on free tier',
    ],
    cost: 'Free tier',
  },

  monitoring: {
    choice: 'Sentry',
    rationale: [
      'Industry standard error tracking',
      'Next.js SDK with automatic instrumentation',
      'Performance monitoring included',
      'Source map support',
    ],
    cost: 'Free tier (5K events/month)',
  },

  totalEstimatedMonthlyCost: {
    minimum: '$0-10',   // Everything on free tiers, low traffic
    typical: '$30-60',  // Moderate usage, some paid tiers
    note: 'The AI API cost is the main variable. Caching and smart batching keep it manageable.',
  },
};
```

## 17.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  # ─── Lint & Type Check ─────────────────────────────────
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm turbo lint

      - name: Type Check
        run: pnpm turbo typecheck

      - name: Format Check
        run: pnpm prettier --check .

  # ─── Unit & Component Tests ────────────────────────────
  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Unit & Component Tests
        run: pnpm turbo test -- --coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  # ─── Integration Tests ─────────────────────────────────
  integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: quality
    services:
      postgres:
        image: postgis/postgis:16-3.4
        env:
          POSTGRES_DB: test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run Migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/test

      - name: Seed Test Data
        run: pnpm db:seed
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/test

      - name: Integration Tests
        run: pnpm turbo test:integration
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  # ─── Bundle Size Check ─────────────────────────────────
  bundle:
    name: Bundle Analysis
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm turbo build --filter=@app/web

      - name: Check Bundle Size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          build_script: '' # Already built
          skip_step: build

  # ─── E2E Tests (on PRs to main only) ──────────────────
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [test, integration]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium

      - name: Build App
        run: pnpm turbo build --filter=@app/web

      - name: Run E2E Tests
        run: pnpm turbo test:e2e
        env:
          BASE_URL: http://localhost:3000

      - name: Upload Test Artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/playwright-report/

  # ─── Deploy Preview ────────────────────────────────────
  # Vercel handles preview deployments automatically via GitHub integration
  # This job just adds the preview URL as a PR comment

  # ─── Deploy Production ─────────────────────────────────
  deploy:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [test, integration, bundle]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Backend to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api

      - name: Run Production Migrations
        run: |
          curl -X POST ${{ secrets.API_URL }}/admin/migrate \
            -H "Authorization: Bearer ${{ secrets.ADMIN_TOKEN }}"

      # Vercel production deploy is automatic on main push
```

## 17.4 Environment Configuration

```typescript
// packages/config/src/env.ts

import { z } from 'zod';

/**
 * Environment variable schema.
 * Validated at build time and runtime.
 * Fails fast if any required variables are missing.
 */

const envSchema = z.object({
  // ─── Application ────────────────────────────────────
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),

  // ─── Database ───────────────────────────────────────
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),

  // ─── Redis ──────────────────────────────────────────
  REDIS_URL: z.string().min(1),

  // ─── Authentication ─────────────────────────────────
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_LINE_ID: z.string().optional(),
  AUTH_LINE_SECRET: z.string().optional(),

  // ─── AI ─────────────────────────────────────────────
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  AI_MODEL: z.string().default('claude-sonnet-4-20250514'),
  AI_MAX_TOKENS: z.coerce.number().default(4096),

  // ─── LINE Messaging ─────────────────────────────────
  LINE_CHANNEL_ACCESS_TOKEN: z.string().optional(),
  LINE_CHANNEL_SECRET: z.string().optional(),

  // ─── Email ──────────────────────────────────────────
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@example.com'),

  // ─── Analytics ──────────────────────────────────────
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().optional(),

  // ─── Monitoring ─────────────────────────────────────
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    for (const issue of parsed.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    throw new Error('Environment validation failed. See above for details.');
  }

  return parsed.data;
}

export const env = validateEnv();
```

---

# Section 18: Monitoring & Observability

## 18.1 Observability Stack

```typescript
// packages/observability/src/index.ts

/**
 * Three pillars of observability:
 * 1. Logs — Structured JSON logs via Pino
 * 2. Metrics — Custom business metrics + runtime metrics
 * 3. Traces — Distributed tracing for request flows
 *
 * For the portfolio: Sentry (errors + performance) + PostHog (product) + structured logs
 * For production: Would add OpenTelemetry → Grafana Cloud
 */

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  // Always include these fields
  base: {
    service: process.env.SERVICE_NAME ?? 'unknown',
    version: process.env.APP_VERSION ?? 'dev',
    environment: process.env.NODE_ENV ?? 'development',
  },
  // Redact sensitive fields from logs
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.email',
      'body.phone',
      '*.apiKey',
      '*.accessToken',
    ],
    censor: '[REDACTED]',
  },
});

// Create child loggers for specific domains
export const searchLogger = logger.child({ domain: 'search' });
export const aiLogger = logger.child({ domain: 'ai' });
export const authLogger = logger.child({ domain: 'auth' });
export const notificationLogger = logger.child({ domain: 'notification' });
```

## 18.2 Health Checks

```typescript
// services/api/src/routes/health.ts

import { Hono } from 'hono';
import { db } from '@repo/database';
import { redis } from '@repo/cache';

const healthRouter = new Hono();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    responseTimeMs: number;
    message?: string;
  }[];
}

healthRouter.get('/health', async (c) => {
  const checks: HealthStatus['checks'] = [];

  // Check database
  const dbStart = Date.now();
  try {
    await db.execute('SELECT 1');
    checks.push({
      name: 'database',
      status: 'pass',
      responseTimeMs: Date.now() - dbStart,
    });
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'fail',
      responseTimeMs: Date.now() - dbStart,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    await redis.ping();
    checks.push({
      name: 'redis',
      status: 'pass',
      responseTimeMs: Date.now() - redisStart,
    });
  } catch (error) {
    checks.push({
      name: 'redis',
      status: 'warn', // Redis down = degraded, not unhealthy
      responseTimeMs: Date.now() - redisStart,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Overall status
  const hasFailure = checks.some(c => c.status === 'fail');
  const hasWarning = checks.some(c => c.status === 'warn');

  const status: HealthStatus = {
    status: hasFailure ? 'unhealthy' : hasWarning ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION ?? 'dev',
    uptime: process.uptime(),
    checks,
  };

  const httpStatus = hasFailure ? 503 : 200;
  return c.json(status, httpStatus);
});

// Lightweight liveness probe (for container orchestration)
healthRouter.get('/health/live', (c) => {
  return c.text('OK', 200);
});

// Readiness probe (checks if dependencies are available)
healthRouter.get('/health/ready', async (c) => {
  try {
    await db.execute('SELECT 1');
    return c.text('OK', 200);
  } catch {
    return c.text('NOT READY', 503);
  }
});

export { healthRouter };
```

---

# Section 19: Documentation Strategy

## 19.1 README Structure

```markdown
# 🏠 TokyoHome AI — Intelligent Property Search for Tokyo

> AI-powered real estate platform for finding your ideal home in Tokyo.
> Built as a full-stack portfolio project demonstrating production-grade
> architecture with modern tooling.

[Live Demo](https://tokyohome.example.com) · [Architecture Docs](./docs/architecture.md) · [API Docs](./docs/api.md)

![Screenshot of search interface](./docs/assets/hero-screenshot.png)

## ✨ Key Features

**AI-Powered Search** — Conversational property search using Claude.
Describe what you want in natural language: "3LDK near a park in Setagaya,
under 80M yen, new earthquake standard"

**Smart Price Estimation** — AI-generated price analysis with market
comparisons, confidence intervals, and trend visualization

**Buyer Journey Tracking** — Guided workflow from initial search through
purchase, with stage-appropriate tools and information at each step

**Real-Time Notifications** — LINE and in-app alerts for new matches,
price changes, and journey milestones

**Bilingual** — Full Japanese and English support with culturally
appropriate formatting (万円/億円, 坪/㎡, 新耐震/旧耐震)

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 | App Router, Server Components, Streaming SSR |
| Backend API | Hono | Lightweight, TypeScript-native, edge-compatible |
| AI Agent | Mastra + Claude API | Structured agent orchestration with tool use |
| Database | PostgreSQL (Neon) + PostGIS | Spatial queries, serverless scaling |
| Cache | Upstash Redis | Rate limiting, session cache, search cache |
| State Machine | XState v5 | Buyer journey state management |
| Auth | Auth.js v5 | LINE + Google OAuth |
| Monorepo | Turborepo + pnpm workspaces | Build orchestration, package sharing |

### Monorepo Structure

```
tokyohome/
├── apps/
│   └── web/                    # Next.js frontend
├── services/
│   ├── api/                    # Hono REST API
│   ├── ai-agent/               # Mastra AI agent service
│   └── notification/           # Notification dispatcher
├── packages/
│   ├── ui/                     # Shared React components (Storybook)
│   ├── database/               # Drizzle ORM schema + migrations
│   ├── domain/                 # Business rules (fees, risk assessment)
│   ├── i18n/                   # Translations + Japanese formatters
│   ├── ai/                     # AI prompts, tools, evaluation harness
│   ├── shared/                 # Error types, resilience patterns
│   ├── analytics/              # Event taxonomy + tracking client
│   ├── config/                 # Environment validation
│   ├── observability/          # Logging, health checks
│   └── seed/                   # Realistic synthetic data generator
└── docs/                       # Architecture decision records
```

### System Architecture

```
[diagram from Section 17.1 goes here]
```

## 🧠 AI Architecture

The AI system uses a multi-agent approach:

1. **Router Agent** — Classifies user intent and delegates to specialist agents
2. **Search Agent** — Translates natural language to structured property queries
3. **Analysis Agent** — Price estimation, market analysis, risk assessment
4. **Advisory Agent** — Purchase process guidance, legal information

All agents share a common tool library (property search, price history,
risk assessment, fee calculation) and maintain conversation context
through a shared memory layer.

[Read more: AI Architecture Deep Dive →](./docs/ai-architecture.md)

## 📊 Data Strategy

Uses **realistic synthetic data** generated by a custom seed engine.
The generator produces geographically accurate Tokyo property listings with
real station/ward data, statistically correlated pricing, and proper
Japanese formatting.

See [Data Architecture →](./docs/data-architecture.md) for details.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local PostgreSQL/Redis, optional)

### Setup

```bash
# Clone
git clone https://github.com/yourname/tokyohome.git
cd tokyohome

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Set up database
pnpm db:push      # Apply schema
pnpm db:seed      # Generate 500 properties

# Start development
pnpm dev          # Starts all services
```

### Available Scripts

```bash
pnpm dev              # Start all services in dev mode
pnpm build            # Build all packages and apps
pnpm test             # Run unit + component tests
pnpm test:integration # Run integration tests (requires DB)
pnpm test:e2e         # Run Playwright E2E tests
pnpm db:seed          # Seed database with synthetic data
pnpm db:studio        # Open Drizzle Studio (DB GUI)
pnpm storybook        # Open component Storybook
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
```

## 🧪 Testing

| Type | Tool | Count | Coverage |
|------|------|-------|----------|
| Unit | Vitest | ~1000 | 85%+ |
| Component | Vitest + Testing Library | ~500 | — |
| Integration | Vitest + Testcontainers | ~200 | — |
| E2E | Playwright | ~50 | Critical paths |
| AI Evaluation | Custom harness | ~30 | Golden dataset |

## 📱 Screenshots

[Property search with filters]
[Property detail with AI chat]
[AI price estimation with confidence]
[Buyer journey tracker]
[LINE notification preview]
[Mobile responsive views]

## 📋 Architecture Decision Records

- [ADR-001: Monorepo with Turborepo](./docs/adr/001-monorepo.md)
- [ADR-002: Hono over tRPC for API layer](./docs/adr/002-api-framework.md)
- [ADR-003: Synthetic data over web scraping](./docs/adr/003-data-strategy.md)
- [ADR-004: XState for journey state management](./docs/adr/004-state-machine.md)
- [ADR-005: Mastra for AI agent orchestration](./docs/adr/005-ai-framework.md)
- [ADR-006: PostGIS for spatial queries](./docs/adr/006-spatial-queries.md)

## 📄 License

MIT
```

## 19.2 Architecture Decision Record Template

```markdown
# ADR-003: Synthetic Data Over Web Scraping

## Status
Accepted

## Context
We need property listing data to populate the platform. Options considered:

1. **Scrape real estate portals** (Suumo, LIFULL HOME'S, at HOME)
2. **Use government open data** (REINS transaction data is not publicly available)
3. **Generate realistic synthetic data**

## Decision
We chose **synthetic data generation** with a custom seed engine.

## Rationale

**Against scraping:**
- ToS of major portals explicitly prohibit scraping
- Scraper maintenance overhead distracts from core architecture work
- Legal risk is inappropriate for a portfolio project
- Data freshness management adds complexity with no portfolio value

**For synthetic data:**
- Full control over data distribution and edge cases
- Demonstrates domain knowledge (realistic pricing models, proper Japanese
  address formats, earthquake standard dating, station/ward geography)
- The seed engine itself is a portfolio-worthy piece of engineering
- Architecture supports real data sources via provider adapter pattern
- Deterministic seeding enables reproducible demos

## Consequences

**Positive:**
- Zero legal risk
- Demo always works with consistent, predictable data
- Can generate edge cases (旧耐震 buildings, 億 price range, etc.) on demand
- Seed script is part of the portfolio deliverable

**Negative:**
- Data lacks the messy inconsistencies of real data
- No real photos (mitigated by Unsplash placeholders + generated floor plans)
- Pricing model is simplified compared to real market dynamics

**Mitigated by:**
- README explicitly documents the data strategy and the reasoning
- Architecture includes a `DataProvider` interface showing how real sources would plug in
- Seed generator uses real geographic data (station locations, ward boundaries, rail lines)
```

---

# Section 20: Implementation Roadmap

## 20.1 Phased Build Plan

```
Phase 1: Foundation (Week 1–2)
─────────────────────────────────────────────────
├── Monorepo setup (Turborepo + pnpm workspaces)
├── Database schema (Drizzle + Neon)
├── Seed data generator (packages/seed)
├── Shared packages (config, env validation, types)
├── Basic UI component library (packages/ui)
├── Authentication (Auth.js with LINE + Google)
└── Deliverable: Can run `pnpm dev`, see seeded DB, log in

Phase 2: Core Features (Week 3–4)
─────────────────────────────────────────────────
├── Property search API (Hono)
├── Search page with filters and results
├── Property detail page
├── Japanese formatters (price, area, address)
├── Map view (lazy loaded)
├── Save/favorite properties
└── Deliverable: Fully functional property search and browse

Phase 3: AI Integration (Week 5–6)
─────────────────────────────────────────────────
├── Mastra agent setup
├── AI chat interface (streaming)
├── Natural language → structured search
├── Price estimation with confidence
├── Property risk assessment
├── AI tool definitions (search, analyze, calculate)
└── Deliverable: Working AI chat that can search and analyze properties

Phase 4: Journey & Notifications (Week 7–8)
─────────────────────────────────────────────────
├── Buyer journey state machine (XState)
├── Journey dashboard UI
├── Notification system architecture
├── LINE integration
├── Email notifications (Resend)
├── Saved search alerts
└── Deliverable: End-to-end buyer journey with notifications

Phase 5: Polish & Portfolio (Week 9–10)
─────────────────────────────────────────────────
├── Performance optimization
├── Error handling & graceful degradation
├── Analytics integration
├── E2E tests for critical paths
├── Storybook for component library
├── Documentation (README, ADRs, API docs)
├── Screenshots & demo recording
├── Deploy to production
└── Deliverable: Portfolio-ready project
```

## 20.2 What to Skip (Portfolio Optimization)

```typescript
/**
 * Features that would exist in production but add
 * minimal portfolio value. Skip or stub these.
 */

const SKIP_OR_STUB = {
  // Skip entirely — not portfolio-relevant
  skip: [
    'Payment processing',
    'Real document signing',
    'CRM integration',
    'A/B testing framework',
    'Multi-tenant admin panel',
    'Automated backups',
    'Log aggregation pipeline',
    'Load testing infrastructure',
  ],

  // Stub with TODO + interface — shows you know it's needed
  stub: [
    'Full RBAC (implement simple role check, document full design)',
    'Rate limiting (implement basic, document production strategy)',
    'Email templates (implement 1-2, document the system)',
    'Webhook ingestion (define interface, implement mock provider)',
    'Batch processing (define job queue interface, implement inline)',
  ],

  // Implement fully — high portfolio impact
  implement: [
    'AI chat with tool use (this IS the project)',
    'Property search with filters (core UX)',
    'Japanese i18n & formatting (domain expertise)',
    'Seed data generator (demonstrates domain knowledge)',
    'Error handling & degradation (production thinking)',
    'Testing strategy (professional practice)',
    'CI/CD pipeline (DevOps competence)',
    'TypeScript strictness (code quality)',
    'Responsive design (mobile-first)',
    'Performance budgets (engineering discipline)',
  ],
};
```

---

# Section 21: Final Architecture Principles

These are the guiding principles that should inform every implementation decision:

**Type safety is non-negotiable.** TypeScript strict mode everywhere. Zod validation at every boundary. No `any` types. The type system is your first line of defense against bugs.

**Server-first rendering.** Default to Server Components. Reach for `'use client'` only when you need interactivity. Stream long-running data fetches. This keeps the initial bundle small and the time-to-interactive fast.

**Graceful degradation over perfect availability.** Every feature has a fallback. If the AI is down, show template responses. If search is degraded, use direct DB queries. The user should never see a blank screen.

**Domain accuracy builds trust.** Get the Japanese real estate details right. Correct 万円/億円 formatting. Proper 新耐震/旧耐震 classification. Real station names and rail lines. This signals domain expertise more than any framework choice.

**The AI is a feature, not the product.** The platform must be fully functional without AI. Search, browse, save, filter — all work without a single LLM call. AI enhances the experience; it doesn't gate it.

**Every architectural choice should be explainable.** If you can't articulate why you chose Hono over Express, or XState over Redux, the choice isn't adding portfolio value. The ADRs are as important as the code.

**Ship less, but ship it well.** A polished search page with great error handling, smooth loading states, and proper Japanese formatting is worth more than ten half-finished features. Depth over breadth.

---

That's the complete architecture specification. Every section is covered, from data generation through deployment, with code examples that are realistic, consistent with each other, and ready to be adapted into a real implementation. The total system is designed to be buildable by one person in roughly 10 weeks, with clear priorities for what to implement fully versus what to stub.

Where would you like to start building?