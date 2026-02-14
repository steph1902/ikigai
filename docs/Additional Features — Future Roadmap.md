

# Additional Features — Future Roadmap

**Project:** Japanese PropTech Platform
**Document Type:** Feature Proposals & Strategic Enhancements
**Status:** Proposed (No implementation yet)
**Last Updated:** February 13, 2026

---

## Overview

This document outlines proposed additional features that elevate the platform beyond a standard application into infrastructure-level thinking. These features are grouped into three tiers based on strategic impact.

---

## Tier 1 — Core Strategic Enhancements

### 1.1 Compliance-as-a-Service Middleware

**Concept:** Extract the platform's regulatory logic into a standalone, reusable microservice that any PropTech developer building for the Japanese market could plug into.

**Scope:**
- IT重説 (IT-based important matter explanation) workflow orchestration
- Foreign buyer reporting triggers
- AML/KYC checkpoint management
- Brokerage licensing boundary detection (i.e., detecting when platform behavior crosses into regulated 宅建業 activity)

**Strategic Value:** Shifts the project from "I built an app" to "I built infrastructure." Infrastructure-level projects signal senior engineering thinking and create ecosystem value beyond a single product.

**Dependencies:** Requires well-defined API contracts, clear separation of regulatory logic from application logic, and versioned rule definitions.

---

### 1.2 Regulatory Change Detection Layer

**Concept:** A lightweight monitoring system that maps specific platform features to specific statutory articles. When a statute is amended, the system flags which features need compliance review.

**Context & Motivation:**
- The January 2025 囲い込み (property hoarding) rules changed listing behavior requirements
- The 2024 registration reforms altered transaction workflows
- MLIT's evolving AI pilot programs may introduce new obligations at any time

**How It Works:**
- Maintain a structured mapping: `Feature → Statutory Article(s) → Current Compliance Status`
- When a regulatory update is logged, the system surfaces all affected features
- Outputs a review queue with priority ranking based on impact severity

**Strategic Value:** Demonstrates awareness that compliance is not a one-time build but an ongoing operational concern. This is the kind of thinking that distinguishes production-grade systems from portfolio demos.

---

### 1.3 Decision Audit Trail Architecture

**Concept:** A logging layer that captures the full reasoning chain for every AI-driven suggestion — property recommendations, valuation estimates, risk assessments.

**What Gets Captured:**
- Input data and its sources
- Model weights or ranking factors that influenced the output
- Confidence level of the recommendation
- Timestamp, user context, and session metadata

**Regulatory Framing:** Aligned with the Consumer Affairs Agency's (消費者庁) emerging guidance on AI transparency obligations. Designed to answer the question regulators and lawyers will inevitably ask: *"Why did the system recommend that?"*

**Strategic Value:** Demonstrates accountability architecture thinking — exactly the conversation happening at the policy level in Japan right now. Most developers ignore this entirely.

---

## Tier 2 — Product Differentiation Features

### 2.1 Regulatory Sandbox Simulator

**Concept:** An interactive mode where a developer or product manager proposes a new feature (e.g., "accept rent deposits via crypto") and the system walks through a decision tree of applicable Japanese regulations, required licenses, and legal gray zones.

**Behavior:**
- User describes a proposed feature in plain language
- System maps it against known regulatory domains (宅建業法, 犯罪収益移転防止法, 資金決済法, etc.)
- Outputs: applicable statutes, required licenses/registrations, open legal questions, and suggested next steps

**Important Boundary:** This does not constitute legal advice. It surfaces the right questions and maps them to statutory and agency guidance.

**Strategic Value:** Large PropTech firms pay legal teams significant sums to do this manually. Even an approximate structured version is a genuinely novel contribution.

---

### 2.2 Cross-Jurisdictional Friction Mapping

**Concept:** A visualization and query layer that surfaces where regulatory requirements differ by jurisdiction for a given transaction type.

**Example Use Case:** Short-term rental (民泊) rules vary dramatically between Tokyo's 23 wards. A property listing in Shinjuku-ku faces different constraints than one in Setagaya-ku. This feature flags those differences and alerts when a property or transaction crosses a jurisdictional boundary where different rules apply.

**Data Structure:**
- National law baseline → Prefectural overlay → Municipal-level ordinance layer
- Per-transaction-type mapping of which jurisdictional layers apply

**Strategic Value:** This kind of structured, queryable regulatory geography doesn't exist in an accessible format today. High potential as an open-source reference resource.

---

### 2.3 Plain Language Regulatory Translator

**Concept:** A structured layer on top of actual statutory text that maps each provision to three outputs: a plain-language explanation, a practical example, and the specific platform behavior it constrains.

**Audience Served:**
- **Developers** building features (what can and can't the code do?)
- **Compliance officers** reviewing implementations (is this feature within bounds?)
- **End users** encountering compliance steps (why do I have to do this?)

**Why This Matters:** Japanese legal writing (法律用語) is notoriously dense even for native speakers. A well-maintained plain-language layer, especially if open-sourced, could become a reference resource for the broader Japanese PropTech community.

---

### 2.4 Compliance Cost Calculator

**Concept:** For any given transaction type, model the time, documentation, and procedural overhead that regulation adds — then show how the platform's automation reduces that cost.

**Output Example:**
- Standard manual compliance for a foreign buyer transaction: ~X hours, Y documents, Z touchpoints
- Platform-assisted compliance: ~X′ hours, Y′ documents, Z′ touchpoints
- **Net reduction: concrete, quantifiable metric**

**Strategic Value:** Transforms the value proposition from "we handle compliance" to "we reduce compliance overhead by N hours per transaction." This is the metric investors and business stakeholders actually evaluate. It also provides a framework for ROI conversations with potential enterprise users.

---

## Tier 3 — Documentation & Thought Leadership

### 3.1 Regulatory Conflict Whitepaper

**Concept:** A short (2–3 page) whitepaper-style document included in the repository that walks through one specific regulatory conflict encountered during development and how it was resolved architecturally.

**Suggested Topic:** The exact boundary between automated property matching and regulated brokerage activity (宅建業) — where does a recommendation engine stop being a tool and start being an unlicensed broker?

**Format:**
- Problem statement with statutory citations
- Architectural decision and rationale
- Diagram showing the compliance boundary in the system design
- References to relevant MLIT guidance or case precedent

**Strategic Value:** This single artifact, sitting alongside the code in the repository, communicates more about senior-level thinking to a hiring manager or technical evaluator than any amount of polished UI. It proves the author understands *why* the architecture looks the way it does — not just *how* it was built.

---

## Unifying Principle

> The thread connecting all of these features is the same: this platform is not software that merely *follows* rules — it is software that *understands* rules as a domain. That distinction is the difference between an application and a system.

---

*End of document. Implementation planning to follow per feature.*