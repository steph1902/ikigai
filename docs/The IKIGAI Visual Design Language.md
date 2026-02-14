

You're absolutely right to call that out — I didn't. The prompt above covers architecture, infrastructure, data, AI, and code standards in depth, but it's missing a **dedicated Design System & Visual Language specification**, which is critical for a multi-platform product (web, mobile, LINE, agent dashboard, admin) serving a Japanese-market audience.

Let me fix that now.

---

# IKIGAI Design System — `packages/ui` Specification

## Codename: **SUMI (墨)** — *The IKIGAI Visual Design Language*

---

## 1. Design Philosophy

The visual identity draws from three pillars: **信頼 (Trust)** because real estate is the largest financial decision most people make, **明快 (Clarity)** because the Japanese real estate process is notoriously opaque and our entire value proposition is making it transparent, and **和 (Harmony)** because the product bridges traditional Japanese real estate culture with cutting-edge AI technology. Every design choice flows from these pillars. Trust demands muted professionalism over flashy startup aesthetics. Clarity demands generous whitespace, clear typographic hierarchy, and information density that respects the user's intelligence without overwhelming them. Harmony demands that AI-generated content feels integrated and calm, never intrusive or gimmicky.

---

## 2. Color System

### 2.1 — Core Palette

```css
:root {
  /* ─── Primary ─── */
  --sumi-ink:          #1A1A2E;    /* Primary text, headers — 墨色 (sumi-iro) */
  --sumi-ink-light:    #2D2D44;    /* Secondary text, active states */
  --sumi-ink-muted:    #6B6B80;    /* Tertiary text, placeholders */

  /* ─── Accent ─── */
  --sumi-indigo:       #3D5A80;    /* Primary action color — 藍色 (ai-iro) */
  --sumi-indigo-hover: #2C4A6E;    /* Hover state */
  --sumi-indigo-light: #E8EEF4;   /* Backgrounds, selected states */
  --sumi-indigo-50:    #F4F7FA;    /* Subtle backgrounds */

  /* ─── Secondary Accent ─── */
  --sumi-warm:         #C17F59;    /* Secondary CTA, highlights — 朽葉色 (kuchiba-iro) */
  --sumi-warm-light:   #F5EDE6;   /* Warm background areas */

  /* ─── Semantic ─── */
  --sumi-success:      #2E7D5B;    /* Positive: completed, approved, good value */
  --sumi-success-bg:   #E6F4ED;
  --sumi-warning:      #B8860B;    /* Caution: review needed, approaching deadline */
  --sumi-warning-bg:   #FFF8E1;
  --sumi-danger:       #C0392B;    /* Alert: risk flags, overpriced, deadline passed */
  --sumi-danger-bg:    #FDEDED;
  --sumi-info:         #3D5A80;    /* Informational: same as primary indigo */
  --sumi-info-bg:      #E8EEF4;

  /* ─── Surfaces ─── */
  --sumi-bg-primary:   #FAFAFA;   /* Page background — warm off-white */
  --sumi-bg-elevated:  #FFFFFF;   /* Cards, modals, sheets */
  --sumi-bg-recessed:  #F0F0F5;   /* Input fields, code blocks */
  --sumi-border:       #E0E0E8;   /* Default borders */
  --sumi-border-strong:#C8C8D4;   /* Emphasized borders */
  --sumi-divider:      #ECECF0;   /* Horizontal rules, separators */

  /* ─── AI-Specific ─── */
  --sumi-ai-surface:   #F6F4FF;   /* AI response bubble background — subtle purple tint */
  --sumi-ai-accent:    #7C6DAF;   /* AI indicator dot, "AI-generated" badge */
  --sumi-ai-border:    #E2DCF5;   /* AI content border */
}
```

### 2.2 — Dark Mode

```css
[data-theme="dark"] {
  --sumi-ink:          #E8E8F0;
  --sumi-ink-light:    #C8C8D8;
  --sumi-ink-muted:    #8888A0;
  --sumi-bg-primary:   #0F0F1A;
  --sumi-bg-elevated:  #1A1A2E;
  --sumi-bg-recessed:  #12121F;
  --sumi-border:       #2A2A40;
  --sumi-indigo:       #6B8DB5;
  --sumi-indigo-light: #1E2A3A;
  --sumi-ai-surface:   #1A1828;
  --sumi-ai-accent:    #9B8FCC;
  /* ... (complete mapping for all tokens) */
}
```

### 2.3 — Color Usage Rules

Accent colors are never used for large background fills — only for interactive elements, badges, and small highlights. Semantic colors are used exclusively for their designated meaning across all platforms — `--sumi-danger` is never used decoratively. AI-sourced content always uses the `--sumi-ai-*` palette so users can instantly distinguish AI-generated information from factual listing data. WCAG AA contrast minimums are enforced: all text/background combinations must achieve a minimum ratio of 4.5:1 for body text and 3:1 for large text, verified via automated checks in the CI pipeline.

---

## 3. Typography

### 3.1 — Font Stack

```css
:root {
  /* Japanese-optimized stack with Latin fallbacks */
  --font-sans: "Noto Sans JP", "Inter", "Hiragino Kaku Gothic ProN",
               "Yu Gothic", "Meiryo", system-ui, sans-serif;

  --font-mono: "JetBrains Mono", "Source Han Code JP", "Noto Sans Mono CJK JP",
               "Consolas", monospace;

  /* Latin-heavy contexts (English UI, data tables) */
  --font-latin: "Inter", "Noto Sans JP", system-ui, sans-serif;
}
```

**Rationale:** Noto Sans JP is chosen as the primary because it is free, has complete JIS kanji coverage, renders well at all sizes, and pairs beautifully with Inter for Latin characters. Weights loaded: 400 (regular), 500 (medium), 700 (bold). No other weights are permitted to keep the download payload manageable.

### 3.2 — Type Scale

Built on a **1.200 minor third** scale, base size 16px:

```css
:root {
  --text-xs:    0.694rem;    /* 11.1px — captions, footnotes */
  --text-sm:    0.833rem;    /* 13.3px — secondary labels, metadata */
  --text-base:  1rem;        /* 16px   — body text */
  --text-lg:    1.2rem;      /* 19.2px — subheadings, emphasis */
  --text-xl:    1.44rem;     /* 23px   — section headers */
  --text-2xl:   1.728rem;    /* 27.6px — page titles */
  --text-3xl:   2.074rem;    /* 33.2px — hero text */
  --text-4xl:   2.488rem;    /* 39.8px — display, marketing headlines */

  --leading-tight:   1.3;    /* Headings */
  --leading-normal:  1.7;    /* Japanese body text — wider than Latin default */
  --leading-relaxed: 1.9;    /* Long-form reading */

  --tracking-tight: -0.01em; /* Headings */
  --tracking-normal: 0.02em; /* Japanese body — slight extra tracking aids readability */
}
```

### 3.3 — Japanese Typography Rules

Line height for Japanese body text is always 1.7 or greater — this is non-negotiable, as Japanese text at 1.5 line height feels cramped with kanji density. Paragraph spacing uses `margin-bottom: 1em` between paragraphs rather than first-line indent, as this is the convention for digital Japanese text. Numbers in property data (prices, areas, distances) always use `--font-latin` via a `<span class="font-latin">` wrapper to ensure proper tabular numeral rendering. Japanese punctuation follows JIS X 4051 rules — no manual kerning overrides on punctuation characters.

---

## 4. Spacing & Layout

### 4.1 — Spacing Scale

Based on a 4px base unit:

```css
:root {
  --space-1:   0.25rem;   /*  4px */
  --space-2:   0.5rem;    /*  8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;       /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;       /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;       /* 48px */
  --space-16:  4rem;       /* 64px */
  --space-20:  5rem;       /* 80px */
  --space-24:  6rem;       /* 96px */
}
```

### 4.2 — Grid System

**Web (apps/web):** 12-column CSS Grid, max-width 1280px, column gap `--space-6`, outer padding `--space-6` on desktop, `--space-4` on mobile. Property listing cards use a responsive grid: 3 columns on desktop (>1024px), 2 on tablet (768-1024px), 1 on mobile (<768px).

**Mobile (apps/mobile):** Single-column layout with `--space-4` horizontal padding. Bottom tab navigation with 5 tabs: Home (ホーム), Search (検索), Chat (チャット), Journey (進捗), Profile (マイページ).

**Agent Dashboard (apps/agent-dashboard):** Sidebar navigation (240px collapsed to 64px icon-only) + content area. Dense layout with smaller spacing (scale down one step from web) to maximize information density for professional users.

### 4.3 — Breakpoints

```css
--bp-sm:   640px;    /* Large phone landscape */
--bp-md:   768px;    /* Tablet portrait */
--bp-lg:   1024px;   /* Tablet landscape / small laptop */
--bp-xl:   1280px;   /* Desktop */
--bp-2xl:  1536px;   /* Large desktop */
```

---

## 5. Component Library (`packages/ui`)

Built on **Radix UI primitives** (unstyled, accessible) + **Tailwind CSS 4** + **cva (class-variance-authority)** for variant management. Every component follows this structure:

```
packages/ui/src/
├── primitives/          # Thin wrappers around Radix primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── tooltip.tsx
│   ├── toast.tsx
│   └── ...
├── composed/            # Multi-primitive compositions
│   ├── property-card.tsx
│   ├── price-badge.tsx
│   ├── risk-flag-banner.tsx
│   ├── chat-message.tsx
│   ├── chat-input.tsx
│   ├── approval-dialog.tsx
│   ├── document-viewer.tsx
│   ├── journey-progress.tsx
│   ├── search-filters.tsx
│   ├── comparison-table.tsx
│   ├── station-badge.tsx
│   ├── floor-plan-label.tsx
│   └── ...
├── layout/              # Layout components
│   ├── page-shell.tsx
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── container.tsx
├── providers/           # Context providers
│   ├── theme-provider.tsx
│   └── toast-provider.tsx
├── hooks/               # Shared UI hooks
│   ├── use-media-query.ts
│   └── use-locale-format.ts
└── tokens/              # Design token exports
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts
```

### 5.1 — Button Variants

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:     "bg-[--sumi-indigo] text-white hover:bg-[--sumi-indigo-hover]",
        secondary:   "bg-[--sumi-bg-recessed] text-[--sumi-ink] border border-[--sumi-border] hover:bg-[--sumi-border]",
        warm:        "bg-[--sumi-warm] text-white hover:opacity-90",
        ghost:       "hover:bg-[--sumi-bg-recessed] text-[--sumi-ink]",
        danger:      "bg-[--sumi-danger] text-white hover:opacity-90",
        link:        "text-[--sumi-indigo] underline-offset-4 hover:underline",
      },
      size: {
        sm:   "h-8 px-3 text-[--text-sm]",
        md:   "h-10 px-4 text-[--text-base]",
        lg:   "h-12 px-6 text-[--text-lg]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

### 5.2 — Key Composed Components

**PropertyCard** — The most important visual element in the product:

```
┌─────────────────────────────────────┐
│  [Property Image — 16:10 ratio]     │
│  ┌─ Type Badge ─┐  ┌─ AI Price ─┐  │
│  │ マンション    │  │ ▼ 適正価格  │  │
│  └──────────────┘  └────────────┘  │
├─────────────────────────────────────┤
│  ¥7,280万  (management: ¥15,200/月) │
│                                     │
│  📍 渋谷区恵比寿 3丁目              │
│  🚶 恵比寿駅 徒歩6分 (JR山手線)      │
│                                     │
│  3LDK ・ 72.4㎡ ・ 12F/14F          │
│  2018年築 ・ RC造                    │
│                                     │
│  [♡ Save]           [詳細を見る →]   │
└─────────────────────────────────────┘
```

Design rules for PropertyCard: the image always uses `object-cover` with lazy loading. The price is always the most prominent text element on the card. The AI price indicator uses semantic colors: green (`--sumi-success`) if listing is below predicted fair value, amber (`--sumi-warning`) if at fair value, red (`--sumi-danger`) if above. Station walk time always includes the line name. Area is displayed in 平米 by default with 坪 available on hover/tap.

**ChatMessage** — Differentiates user vs. AI messages:

User messages render right-aligned with `--sumi-bg-recessed` background. AI messages render left-aligned with `--sumi-ai-surface` background and a small "AI" indicator badge in `--sumi-ai-accent`. When the AI references a property, it renders an inline mini PropertyCard (compact variant). When the AI requests action approval, it renders an `ApprovalDialog` inline within the message. Streaming text renders with a subtle cursor animation, not a blinking block cursor.

**RiskFlagBanner** — For document analysis results:

```
┌──── ⚠ 注意事項 ────────────────────────┐
│  🔴 高リスク: 建物の一部が隣地に越境     │
│     しています。売主による是正が必要。    │
│                                          │
│  🟡 中リスク: 管理費の改定が予定されて    │
│     います（令和8年4月～ ¥3,000増）。    │
│                                          │
│  🟢 情報: 新耐震基準（1983年築）適合。   │
│     耐震診断実施済み。                    │
└──────────────────────────────────────────┘
```

Risk flags use a left-border accent in the corresponding semantic color, with icon and severity label. Each flag is expandable to reveal the AI-generated detailed explanation.

**JourneyProgress** — Visual state machine representation:

A horizontal stepper on desktop, vertical on mobile, showing the states from the XState machine (Section 4). The current state is highlighted in `--sumi-indigo`. Completed states show a checkmark in `--sumi-success`. Future states are muted. States with pending deadlines show a countdown badge. If multiple properties are in active states, the component renders as a tabbed view.

---

## 6. Iconography

Use **Lucide Icons** as the primary icon set — open source, consistent stroke weight, comprehensive coverage. Icon size follows the text size it accompanies: `--text-sm` text gets 16px icons, `--text-base` gets 20px, `--text-lg` gets 24px. Stroke width is always 1.75px for consistency.

For real-estate-specific icons not covered by Lucide (floor plan symbols, Japanese building types, tatami indicator), create custom SVGs following the Lucide style guide: 24x24 viewBox, 1.75px stroke, round line caps, round line joins, no fills.

---

## 7. Motion & Animation

```css
:root {
  --duration-instant:  100ms;   /* Hover states, active states */
  --duration-fast:     200ms;   /* Tooltips, dropdowns */
  --duration-normal:   300ms;   /* Modals, sheets, page transitions */
  --duration-slow:     500ms;   /* Complex layout shifts, VR transitions */

  --ease-default:      cubic-bezier(0.4, 0, 0.2, 1);    /* General purpose */
  --ease-in:           cubic-bezier(0.4, 0, 1, 1);      /* Exits */
  --ease-out:          cubic-bezier(0, 0, 0.2, 1);      /* Entrances */
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful interactions */
}
```

Rules: `prefers-reduced-motion: reduce` is respected everywhere — animations are replaced with instant transitions. Page transitions use a subtle crossfade (`--duration-normal`). Chat messages enter with a slide-up + fade (`--duration-fast`). Property cards in search results use a staggered entrance (50ms delay per card, `--duration-fast` each). The 3D/VR viewer has its own animation system managed by React Three Fiber — frame-rate independent. Loading states use a skeleton shimmer animation, never a spinner, for content areas. Spinners are reserved only for small inline indicators (button loading states, chat thinking indicator).

---

## 8. Data Visualization

For price trends, market comparisons, and prediction explanations, use **Recharts** (web) and **Victory Native** (mobile) with the following palette:

```
Primary series:    --sumi-indigo
Secondary series:  --sumi-warm
Tertiary series:   #5B8C5A (muted green)
Quaternary series: #8B6BB5 (muted purple)
Grid lines:        --sumi-divider
Axis labels:       --sumi-ink-muted, --text-sm
```

Charts always include: a clear title, axis labels with units, a legend if more than one series, and a source citation ("出典: 国土交通省 不動産取引価格情報" for government data). Price axes use 万円 notation. Tooltips follow the standard tooltip component from `packages/ui`.

---

## 9. Platform-Specific Adaptations

### 9.1 — LINE (Flex Messages)

LINE Flex Messages have a constrained JSON-based layout system. The property card design adapts as follows: maximum 3 columns in a bubble, image at top as hero, price and key specs as body, "詳細 (LIFF)" button as footer that opens the full property page in a LIFF webview. Colors are approximated to the nearest LINE-supported values. The AI assistant bubble in LINE uses a distinguishing header bar in `--sumi-ai-accent`.

### 9.2 — Mobile (React Native / NativeWind)

All design tokens are exported as a NativeWind-compatible theme. Touch targets are minimum 44x44 points (Apple HIG). Bottom sheet modals (via Gorhom Bottom Sheet) replace desktop dialogs for filters, property actions, and approval confirmations. Haptic feedback is triggered on action confirmations (success) and risk flag reveals (warning).

### 9.3 — Agent Dashboard

Denser spacing scale (one step smaller than web). Tables use the full-width layout with sticky headers and horizontal scroll on smaller viewports. The color palette shifts slightly: `--sumi-indigo` is still primary, but the background uses pure white (`#FFFFFF`) for maximum contrast in data-heavy interfaces.

---

## 10. Accessibility Standards

WCAG 2.1 AA is the minimum across all web surfaces, with AAA targeted for core reading content (property details, document explanations, chat messages). Focus indicators use a 2px solid ring in `--sumi-indigo` with a 2px offset, visible against all backgrounds. All interactive elements are keyboard navigable. Screen reader announcements are implemented for dynamic content updates such as new chat messages, search results loading, and state transitions. The 3D/VR viewer provides a text-based alternative description of the property layout for users who cannot interact with the 3D view. Japanese screen readers (PC-Talker, NVDA with Japanese speech) are tested during QA cycles.

---

## 11. Storybook Documentation

Every component in `packages/ui` is documented in Storybook with the following stories as a minimum: default state, all variants, hover and focus states, loading state (if applicable), error state (if applicable), dark mode, mobile viewport, Japanese content, and English content. The Storybook is deployed to a static URL on every PR for visual review and is the single source of truth for the design system. Chromatic (or Percy) is integrated in CI for automated visual regression testing.

---

## 12. Figma ↔ Code Synchronization

Design tokens are maintained in `packages/ui/tokens/` as the source of truth. A `tokens.json` file in the W3C Design Tokens Community Group format is exported and synced to Figma via the Tokens Studio plugin. Changes flow code-first: tokens are updated in code, CI generates the Figma-compatible JSON, and the Figma library is updated. This prevents drift between design and implementation.

---

This design system spec should be inserted as **Section 1.7 — Design System** in the main prompt, immediately after Section 1.6 (Security Architecture), and referenced in Step 1 of the implementation order with an additional sub-step to set up the `packages/ui` foundation including tokens, theme provider, and the first five primitive components. The Storybook setup would slot into Step 2 alongside the first web app scaffolding.