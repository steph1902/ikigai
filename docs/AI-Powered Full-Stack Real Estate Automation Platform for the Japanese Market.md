

# Product Requirements Document (PRD)

## AI-Powered Full-Stack Real Estate Automation Platform for the Japanese Market

**Version:** 1.0
**Date:** February 13, 2026
**Author:** Stephanus
**Status:** Draft — Vision Stage
**Target Market:** Japan (domestic real estate purchase process)

---

## 1. Executive Summary

This document defines the product requirements for an end-to-end AI-powered platform that fully automates the Japanese real estate purchase process through a single conversational interface. The system goes beyond conventional LLM-based chatbots by integrating Large Action Models (LAMs) for autonomous task execution, machine-learning-driven property price prediction, and VR-based real-time architectural simulation — all unified into a single chat-driven experience.

The vision in one sentence: **A buyer in Japan opens a chat, describes what they want, and the system finds properties, predicts fair prices, simulates renovations in VR, negotiates, handles paperwork, and closes the purchase — with minimal human intervention.**

---

## 2. Problem Statement

The Japanese real estate purchase process is notoriously fragmented, opaque, and manual. A typical transaction involves a prospective buyer visiting multiple real estate agencies (不動産会社), manually searching portals like SUUMO, HOME'S, and at-home, scheduling physical property visits, receiving pricing information with no transparent basis for valuation, navigating complex paperwork including the 重要事項説明書 (important matter explanation document) and 売買契約書 (sales contract), coordinating with judicial scriveners (司法書士), banks for mortgage pre-approval, and managing a timeline that stretches weeks to months with significant idle time between steps.

Each step typically requires a different specialist, a different system, and a different communication channel. No existing product in the Japanese market unifies these steps into a single automated flow. Existing proptech solutions digitize individual steps (online property search, digital contracts) but do not orchestrate the entire journey autonomously.

The result is a process that is slow, expensive (high agency commissions driven partly by manual labor), intimidating to first-time buyers, and especially hostile to non-Japanese-speaking residents — a growing demographic with significant purchasing power.

---

## 3. Goals & Non-Goals

### 3.1 Goals

**G1 — Chat-First Complete Automation:** Enable a user to initiate and complete an entire property purchase through a conversational interface (text and voice), from initial search to key handover, with the AI orchestrating all intermediate steps autonomously.

**G2 — Actionable AI via LAM Integration:** Move beyond informational chatbots (LLMs that answer questions) to action-executing agents (LAMs that perform tasks). The system must autonomously execute multi-step workflows: searching listings across multiple sources, scheduling viewings, submitting mortgage pre-approval applications, generating and sending legal documents, and coordinating with third-party service providers.

**G3 — Transparent AI-Driven Price Prediction:** Provide buyers with a data-driven fair-market-value estimate for any property, built on a prediction model trained on Japanese-specific variables including 路線価 (rosenka / land value along roads), 公示地価 (official land price), building age and earthquake resistance grade (耐震等級), proximity to train stations measured in walking minutes, local hazard maps (ハザードマップ), school district quality, and historical transaction prices from the 不動産取引価格情報 (MLIT transaction price dataset).

**G4 — VR Architectural Simulation:** Allow buyers to experience properties remotely through VR walkthroughs that go beyond static 360° photos. The system generates real-time simulations showing how a property would look after specific renovations, furniture placement, or layout changes. A buyer can say in the chat "show me this 3LDK with the wall between the kitchen and living room removed" and see the result rendered in the VR environment.

**G5 — Japanese Regulatory Compliance:** Every automated action must comply with the Building Lots and Buildings Transaction Business Act (宅地建物取引業法), the Civil Code provisions governing real estate transactions, the Act on Prevention of Transfer of Criminal Proceeds (犯罪収益移転防止法, relevant for identity verification), and all applicable privacy regulations including Japan's Act on the Protection of Personal Information (個人情報保護法).

**G6 — Multilingual Accessibility:** Serve both Japanese-speaking and non-Japanese-speaking users natively. The system operates fluently in Japanese and English at minimum, with the ability to handle the complex real estate terminology, legal documents, and cultural context in both languages.

### 3.2 Non-Goals

**NG1 — Replacing Licensed Professionals Where Legally Required:** Japanese law requires certain acts to be performed by licensed individuals. The 重要事項説明 (important matter explanation) must be delivered by a 宅地建物取引士 (licensed real estate transaction specialist). Property registration must be handled by a 司法書士 (judicial scrivener). The system orchestrates and supports these professionals but does not replace them. Where IT重説 (online important matter explanation) is legally permitted, the system facilitates the digital delivery.

**NG2 — Becoming a Real Estate Agency:** The initial product is a technology platform, not a licensed 宅建業者 (real estate business operator). The system partners with licensed agencies or the operating company obtains the license as a separate business decision. The PRD does not assume either model.

**NG3 — Construction or Renovation Execution:** The VR simulation shows what renovations would look like and estimates costs, but the system does not directly manage or execute physical construction work.

**NG4 — Financial Advisory:** The system provides mortgage comparison tools and facilitates application submission, but does not provide personalized financial advice. It connects users to appropriate financial professionals where advice is needed.

---

## 4. Users & Personas

**Persona 1 — The First-Time Japanese Buyer (初めての住宅購入者):** Aged 28–40, currently renting, overwhelmed by the complexity of the purchase process, unsure how to evaluate whether a price is fair, unfamiliar with the legal workflow. Needs hand-holding through every step. Values transparency, simplicity, and being able to proceed at their own pace from their smartphone.

**Persona 2 — The Foreign Resident Buyer (在日外国人):** Working professional living in Japan, often with limited Japanese language ability, unaware of Japan-specific processes like the hanko system, the role of the 司法書士, or how to read a 登記簿謄本 (property registry document). Faces additional friction from agencies who may be reluctant to serve non-Japanese clients. Values multilingual support and clear explanations of Japan-specific concepts.

**Persona 3 — The Experienced Investor (不動産投資家):** Owns multiple properties, primarily interested in yield and appreciation potential. Values the price prediction model, rapid multi-property comparison, and portfolio-level analytics. Wants to move fast and needs the system to execute tasks autonomously with minimal conversational overhead.

**Persona 4 — The Partner Agent (提携不動産会社):** A licensed real estate professional or agency that partners with the platform. They handle legally-required in-person duties and benefit from the platform funneling qualified, pre-analyzed leads to them. Values receiving well-organized client requirements and property shortlists rather than raw, undirected inquiries.

---

## 5. Core Capabilities

### 5.1 Conversational Orchestration Engine (Chat-as-Interface)

The chat interface is not a feature of the product — it is the product. Every capability described in this document is accessed through natural conversation. The system maintains long-running conversational context across days and weeks, tracking where the user is in their purchase journey, what properties they have viewed, what they liked and disliked, what their budget and financing situation is, and what steps remain.

The orchestration engine decomposes a user's high-level intent ("I want to buy a 3LDK apartment near Shibuya for under ¥80 million") into a multi-step execution plan, executes each step through the appropriate subsystem or external integration, reports results back conversationally, and asks for decisions only when human judgment is genuinely required.

### 5.2 Large Action Model (LAM) Agent Layer

This is the architectural differentiator from conventional LLM chatbots. The LAM layer enables the system to take real actions in external systems, not merely generate text about those actions.

The LAM agent operates through defined action primitives: searching external listing databases (SUUMO, HOME'S, REINS where access is available), scheduling appointments via calendar integrations or automated communication with agents, filling and submitting structured forms (mortgage pre-approval applications, identity verification documents), generating legal documents from templates with case-specific data populated, sending communications (email, LINE messages) on behalf of the user with their approval, and retrieving and parsing public records (登記情報, hazard maps, 用途地域 zoning information).

Each action primitive has a defined permission model. Some actions execute autonomously (searching listings). Some require explicit user approval before execution (submitting a mortgage application). Some require licensed professional involvement (delivering the 重要事項説明). The permission level for each action primitive is defined in the Functional Specification Document.

### 5.3 Property Price Prediction Model

A machine learning model that estimates fair market value for any residential property in supported regions of Japan.

Training data sources include the MLIT Real Estate Transaction Price Information (国土交通省 不動産取引価格情報), the official land price publications (地価公示 and 都道府県地価調査), fixed asset tax valuations (固定資産税評価額) where obtainable, rosenka (路線価) data from the National Tax Agency, building age and structure type from registry data, earthquake resistance certification records, hazard map overlays (flood, landslide, tsunami, liquefaction), proximity metrics to train stations (walking minutes from the nearest station, which line, express stop or local-only), school district mapping and quality indicators, and historical listing-to-sale price ratios to model negotiation discounts.

The model outputs a point estimate, a confidence interval, and a natural-language explanation of the key factors driving the valuation up or down relative to comparable properties. The explanation is delivered conversationally in the chat. Example: "This property is listed at ¥72 million. My estimate of fair value is ¥65–69 million. The listing price appears ¥3–7 million above market because the building is 築28年 with no earthquake retrofit, while comparable recently-sold units in this area with 新耐震基準 compliance sold for ¥2,400万/坪."

### 5.4 VR Real-Time Architectural Simulation

A visual simulation system that allows users to experience properties remotely and explore hypothetical modifications.

The system ingests floor plan data (間取り図) — either structured data from listings or parsed from images — and generates a navigable 3D model. Users can request modifications through the chat interface. The system renders modifications in near-real-time: wall removal or addition, flooring and material changes, furniture placement from a standard catalog, lighting changes based on time of day and window orientation, and before/after comparisons for renovation scenarios.

The simulation includes a cost estimation overlay. When a user requests a modification, the system estimates the renovation cost based on per-unit costs for materials and labor in the property's prefecture. Example: "Removing this wall would open up the LDK to approximately 22畳. Estimated renovation cost: ¥1.8–2.4 million including structural assessment, since this appears to be a load-bearing wall in a 2x4 construction."

Output is delivered through WebXR for browser-based VR, with optional support for standalone VR headsets. A non-VR 3D viewer is available as a fallback for users without VR hardware.

### 5.5 Document Intelligence & Legal Workflow

The system reads, generates, analyzes, and explains Japanese real estate legal documents.

For document analysis, the system ingests 登記簿謄本 (property registry transcripts), 重要事項説明書 (important matter explanation documents), 売買契約書 (sale contracts), building inspection reports, and management association documents (管理規約 for condominiums). It extracts structured data, identifies risks and anomalies (encumbrances, liens, zoning violations, pending lawsuits), and explains findings to the user in plain language.

For document generation, the system produces draft contracts and applications populated with case-specific data, formatted according to standard Japanese real estate templates (全日本不動産協会 or 全国宅地建物取引業協会連合会 standard forms). All generated documents are flagged as drafts requiring review by a licensed professional before execution.

---

## 6. Success Criteria

**SC1 — End-to-End Completion Rate:** Within 12 months of launch, at least 10 users complete an entire property purchase from initial chat inquiry to key handover, with the platform orchestrating every step. This validates the full-pipeline concept.

**SC2 — Time-to-Close Reduction:** The average time from initial inquiry to contract signing is reduced by 40% compared to the traditional process (industry average of approximately 3–6 months for the search-to-contract phase).

**SC3 — Price Prediction Accuracy:** The property price prediction model achieves a median absolute percentage error (MAPE) of under 8% against actual transaction prices in supported regions, validated on a held-out test set of recent transactions.

**SC4 — User Satisfaction (NPS):** Net Promoter Score of 50+ among users who complete at least the search-and-shortlist phase, measured at 6 months post-launch.

**SC5 — Regulatory Zero-Incident:** Zero regulatory violations or legal challenges related to the platform's automated actions in the first 18 months of operation.

**SC6 — Foreign Resident Adoption:** At least 20% of active users are non-Japanese nationals, validating that the multilingual value proposition is effective.

---

## 7. Key Risks & Mitigations

**Risk 1 — Regulatory Ambiguity around AI in Real Estate Transactions.** The 宅建業法 was written for human agents. Automated execution of certain steps may fall into legal gray areas. **Mitigation:** Engage legal counsel specializing in Japanese real estate law and fintech regulation before development begins. Design the permission model so that all legally-sensitive actions route through licensed human professionals. Monitor the regulatory landscape actively, particularly the Digital Agency's (デジタル庁) ongoing regulatory reform initiatives.

**Risk 2 — Data Access Limitations.** REINS (レインズ), the primary interagency listing database in Japan, is restricted to licensed 宅建業者 members. Without REINS access, the platform cannot provide comprehensive listing coverage. **Mitigation:** Either the operating company or a partner agency holds a 宅建業 license providing REINS access. Supplement with public listing portals (SUUMO, HOME'S) and direct partnerships with agencies.

**Risk 3 — LAM Reliability for High-Stakes Actions.** An autonomous agent that submits a mortgage application with incorrect data, or sends an offer with wrong terms, could cause significant harm. **Mitigation:** The permission model enforces human-in-the-loop confirmation for all high-stakes actions. The system shows the user exactly what it intends to do (the completed form, the message it will send, the offer terms) and proceeds only after explicit approval. An undo/cancellation mechanism exists for every reversible action.

**Risk 4 — VR Content Generation Quality.** Generating architecturally realistic 3D environments from 2D floor plans is technically challenging. Low-quality output would undermine user trust. **Mitigation:** Phase the VR feature. Launch with pre-built 3D models for standardized floor plans (the most common 間取り types in target regions). Expand to on-the-fly generation as the technology matures. Always provide 2D visualization as a reliable fallback.

**Risk 5 — Price Prediction Model Bias and Error.** Real estate markets have local micro-dynamics that national models may miss. Outlier properties (unusual layouts, unique locations, distressed sales) may be poorly predicted. **Mitigation:** Display confidence intervals prominently alongside point estimates. Provide the natural-language explanation of key factors so users can apply judgment. Clearly label predictions as "AI estimates, not appraisals." Continuously retrain on new transaction data.

---

## 8. Phased Delivery Roadmap

### Phase 1 — Foundation (Months 1–6)
Conversational search and shortlisting across public listing portals. Property price prediction model for Tokyo 23 wards. Basic document analysis (registry transcript parsing and explanation). Japanese and English language support.

### Phase 2 — Action Layer (Months 7–12)
LAM agent integration for scheduling viewings and communicating with partner agents. Mortgage pre-approval comparison and application facilitation. VR walkthrough for properties with standard floor plans. Document generation for standard contracts.

### Phase 3 — Full Automation (Months 13–18)
End-to-end orchestration from search to contract signing. Real-time VR renovation simulation with cost estimation. Expansion to Osaka-Kobe and Nagoya metropolitan areas for price prediction. Integration with 司法書士 network for registration workflow.

### Phase 4 — Scale (Months 19–24)
Nationwide price prediction coverage. Investor portfolio management features. API platform for partner agencies to integrate the AI engine into their own workflows. Potential expansion to rental market automation.

---

---

# Functional Specification Document (FSD)

## AI-Powered Full-Stack Real Estate Automation Platform — Functional Specification

**Version:** 1.0
**Date:** February 13, 2026
**Author:** Stephanus
**Companion Document:** PRD v1.0

---

## 1. System Architecture Overview

The platform is composed of six primary subsystems that communicate through a central orchestration layer. All user interaction flows through the Conversational Interface, which delegates to the appropriate subsystem.

**Subsystem 1 — Conversational Interface (CI).** Handles all user-facing interaction: natural language understanding, dialog management, context tracking, and response generation.

**Subsystem 2 — LAM Action Engine (LAE).** Receives structured action requests from the Conversational Interface, executes them against external systems and internal modules, and returns results.

**Subsystem 3 — Property Intelligence Service (PIS).** Manages property data aggregation, search, filtering, and the price prediction model.

**Subsystem 4 — Visual Simulation Engine (VSE).** Generates 3D models, VR environments, and renovation simulations from property data.

**Subsystem 5 — Document Intelligence Service (DIS).** Handles document ingestion, parsing, analysis, generation, and explanation.

**Subsystem 6 — Workflow State Manager (WSM).** Maintains the persistent state of each user's purchase journey, tracking which steps are complete, which are in progress, which are blocked, and what the next recommended actions are.

---

## 2. Subsystem 1 — Conversational Interface (CI)

### 2.1 Channels

The CI is accessible through a web application (responsive for desktop and mobile browsers), a native mobile application (iOS and Android), a LINE Official Account integration (critical for Japanese market adoption), and a voice interface for hands-free interaction during property visits or while commuting.

All channels share the same underlying dialog engine and user context. A user can start a conversation on LINE, continue on the web app, and complete a task via the mobile app without repeating information.

### 2.2 Dialog Management

The CI maintains a hierarchical context model with three layers.

**Session Context** covers the current conversation turn and its immediate predecessors (sliding window of the last 20 exchanges). This is used for anaphora resolution ("show me the second one"), clarification handling, and short-term memory.

**Journey Context** is the persistent state of the user's property purchase process. This includes their search criteria (location preferences, budget, size, building type, must-haves and deal-breakers), shortlisted properties with notes and ratings, viewing history and feedback, mortgage status and pre-approval amounts, document status for each property under consideration, and timeline and deadlines. Journey context persists across sessions and across channels.

**User Profile Context** consists of relatively static user attributes: identity information, language preference, communication style preference (detailed explanations vs. concise responses), and risk tolerance (conservative buyer vs. aggressive negotiator).

### 2.3 Intent Classification

The CI recognizes the following primary intent categories, each of which routes to a specific subsystem and workflow.

**Search Intents** include broad search ("Find me apartments in Meguro"), refined search ("Only show me properties built after 2000 with a south-facing balcony"), comparison ("Compare these three properties side by side"), and saved search modification.

**Valuation Intents** include price check for a specific property, area trend analysis ("How have prices moved in Setagaya over the last 5 years"), and investment yield calculation.

**Viewing Intents** include scheduling a visit, virtual tour request, and renovation simulation request.

**Transaction Intents** include making an offer, mortgage exploration and application, contract review request, and progress status check.

**Information Intents** include explaining a Japanese real estate concept (e.g., "What is 修繕積立金?"), document explanation, and process explanation ("What happens after my offer is accepted?").

**Administrative Intents** include updating search criteria, changing language, and requesting human agent escalation.

### 2.4 Language Processing

For Japanese, the system handles polite (です/ます), casual, and keigo (honorific) registers, detecting the user's register and matching it. It processes real estate jargon (築年数, 専有面積, 管理費, 修繕積立金, 容積率, 建ぺい率, 用途地域, etc.) natively. It handles the three writing systems (漢字, ひらがな, カタカナ) and mixed romaji input from non-native speakers.

For English, the system explains Japan-specific concepts with cultural context rather than direct translation. For example, it does not simply translate 礼金 as "key money" but explains "礼金 (reikin) is a non-refundable payment to the landlord — this is a Japanese custom with no exact Western equivalent, typically one to two months' rent."

### 2.5 Escalation to Human

The CI supports graceful escalation to a human professional when the user explicitly requests it, when the system detects frustration or confusion it cannot resolve (sentiment analysis), when a legally-required human interaction is the next step in the workflow, or when the system's confidence in understanding the user's intent drops below threshold for three consecutive turns.

Escalation preserves the full journey context so the human agent receives a complete briefing without asking the user to repeat anything.

---

## 3. Subsystem 2 — LAM Action Engine (LAE)

### 3.1 Action Primitive Catalog

Each action primitive is defined by its name, description, required inputs, outputs, permission level, and reversibility.

**Action: SEARCH_LISTINGS.** Searches one or more external listing sources. Inputs: structured search criteria (location, price range, size, building type, age, features). Outputs: list of matching property records with metadata. Permission: autonomous. Reversibility: not applicable (read-only).

**Action: FETCH_PROPERTY_DETAIL.** Retrieves full detail for a specific listing. Inputs: listing ID and source. Outputs: complete property record including images, floor plan, building details, fees. Permission: autonomous. Reversibility: not applicable (read-only).

**Action: FETCH_REGISTRY.** Retrieves 登記情報 (property registry information) from the 登記情報提供サービス. Inputs: property address or parcel number (地番). Outputs: parsed registry data including ownership, encumbrances, area. Permission: autonomous (small fee charged to user account). Reversibility: not applicable (read-only, but fee is non-refundable).

**Action: FETCH_HAZARD_MAP.** Retrieves hazard map data for a property location from municipal and national hazard map services. Inputs: latitude/longitude or address. Outputs: flood risk, landslide risk, tsunami risk, liquefaction risk, each with severity level. Permission: autonomous. Reversibility: not applicable (read-only).

**Action: SCHEDULE_VIEWING.** Contacts the listing agent or partner agent to schedule a property viewing. Inputs: property ID, user's available time slots, preferred contact method. Outputs: confirmed appointment or alternative proposed times. Permission: requires user approval of the specific time slots to offer. Reversibility: cancellable up to 24 hours before the scheduled time.

**Action: GENERATE_OFFER.** Generates a written purchase offer (買付証明書 / 購入申込書). Inputs: property ID, offer price, conditions (financing contingency, inspection contingency, desired closing date), buyer identity information. Outputs: formatted offer document. Permission: requires explicit user approval of every field before submission. Reversibility: offers can be withdrawn before seller acceptance under standard practice, though this carries reputational risk with agents.

**Action: SUBMIT_MORTGAGE_PREAPPROVAL.** Submits a mortgage pre-approval application to one or more financial institutions. Inputs: user financial profile (income, employment, existing debts, desired loan amount and term), property information. Outputs: application confirmation and tracking number. Permission: requires explicit user approval of the complete application before submission. Reversibility: applications cannot be "un-submitted" but can be withdrawn before approval.

**Action: GENERATE_CONTRACT.** Generates a draft 売買契約書 from a standard template populated with transaction-specific data. Inputs: property details, buyer and seller information, agreed price, special conditions. Outputs: draft contract document. Permission: requires explicit user approval; draft is clearly marked as requiring licensed professional review. Reversibility: not applicable (document generation only; no external submission).

**Action: SEND_MESSAGE.** Sends a message to a third party (agent, seller's representative, 司法書士, mortgage officer) on behalf of the user. Inputs: recipient, channel (email or LINE), message content. Outputs: delivery confirmation. Permission: requires user approval of exact message content. Reversibility: messages cannot be unsent.

**Action: REQUEST_BUILDING_INSPECTION.** Contacts an inspection company to schedule a building inspection (建物状況調査 / インスペクション). Inputs: property address, property type, user's schedule constraints. Outputs: inspection appointment confirmation. Permission: requires user approval. Reversibility: cancellable per the inspection company's cancellation policy.

### 3.2 Permission Model

Permission levels are enforced by the Workflow State Manager and cannot be overridden by the Conversational Interface or the user.

**Autonomous actions** execute without asking the user. The user is informed of the result ("I found 34 properties matching your criteria" or "I checked the hazard map — this property is in a moderate flood risk zone").

**User-approval actions** present the user with the exact content of what will be executed and wait for explicit confirmation. The system uses unambiguous confirmation prompts: "I've prepared your offer for ¥68,000,000 with a financing contingency. Here is the complete document. Shall I send this to the seller's agent?" Confirmation requires an affirmative response that cannot be confused with casual agreement.

**Professional-required actions** cannot proceed without confirmation from a licensed professional registered in the system. The system coordinates the handoff, provides the professional with all relevant context, and tracks completion.

### 3.3 Action Execution Safety

Every action execution is logged with a timestamp, the action primitive name, the full input parameters, the user approval record (for non-autonomous actions), the execution result, and any error encountered.

Before executing any action that creates an external commitment (scheduling, submitting, sending), the system performs a pre-flight check: confirming the user's identity matches the identity in the documents, confirming the action is consistent with the current journey state (e.g., not submitting an offer on a property the user hasn't viewed or explicitly waived viewing for), and confirming no conflicting actions are in progress (e.g., not submitting two offers simultaneously unless the user has explicitly acknowledged this).

---

## 4. Subsystem 3 — Property Intelligence Service (PIS)

### 4.1 Data Aggregation

The PIS maintains a unified property database aggregating data from multiple sources. Source adapters handle the differences in data format, field naming, and update frequency across sources.

For each property, the PIS maintains a canonical record with the following field groups: identification (source, listing ID, address, parcel number if available), physical attributes (building type, structure, total area in 平米 and 坪, floor plan layout in LDK notation, number of floors, which floor the unit is on, year built, most recent renovation year), financial attributes (listing price, management fee 管理費, repair reserve fund 修繕積立金, ground lease fee 地代 if applicable, fixed asset tax estimate 固定資産税), location attributes (nearest station name and line and walking time, latitude/longitude, municipality, school district), condition attributes (earthquake resistance standard — 旧耐震 pre-1981 vs. 新耐震 post-1981, building inspection results if available, asbestos survey results if available), and media (photos, floor plan images, virtual tour links if available from source).

The PIS reconciles duplicate listings that appear on multiple portals by matching on address, area, price, and floor plan, maintaining the most complete composite record.

### 4.2 Search Engine

The search engine supports structured filtering on all field groups, natural language search queries parsed by the CI into structured filters, geo-spatial queries ("within 10 minutes walk of Nakameguro station," "in the Meguro River 目黒川 cherry blossom area"), relative and computed filters ("under ¥X per 坪," "management fee under ¥300/平米/month," "yield above 5% at current asking price"), and negative filters ("not on a major road," "not 旧耐震").

Search results are ranked by a relevance model that considers match quality against criteria, predicted price fairness (overpriced listings ranked lower), listing freshness, and learned user preferences from feedback on previously viewed properties.

### 4.3 Price Prediction Model — Functional Specification

**Model type:** Gradient-boosted decision tree ensemble (initial version), with planned evolution to a neural architecture incorporating geospatial embeddings.

**Feature engineering:** The model uses the following feature categories.

Location features include the distance-to-station in walking minutes (from the property listing and verified against mapping APIs), the specific station and line (encoded to capture the desirability premium of specific lines and stops, e.g., the Tokyu Toyoko line premium), the distance to the nearest convenience store, supermarket, hospital, and park, the municipal district (丁目 level), the zoning designation (用途地域), the floor area ratio (容積率) and building coverage ratio (建ぺい率) of the land, and the hazard risk scores.

Building features include the age in years, the structure type (RC, SRC, S, wood, light steel), the total floor area, the floor plan type, the floor level within the building (higher floors command a premium), the total number of units in the building (for condominiums), the presence of specific features (auto-lock entrance, delivery boxes, indoor laundry hookup, balcony orientation, double glazing, floor heating), and the earthquake resistance grade.

Financial features include the management fee per square meter, the repair reserve fund per square meter and its trajectory (whether it has been increasing, suggesting upcoming major repairs), and the land lease vs. ownership status.

Market features include the MLIT official land price for the nearest survey point and its year-over-year trend, the rosenka value for the property's road, the average transaction price per tsubo in the surrounding area over the last 12 months, the listing inventory volume in the area (market tightness), and the average days-on-market for comparable listings.

**Output specification:** For each property, the model produces a point estimate in yen, a 90% prediction interval (lower bound and upper bound), a list of the top 5 features contributing positively to value and the top 5 contributing negatively relative to the area median, and a natural-language summary generated by passing the feature contributions to the CI for user-facing explanation.

**Training and validation:** The initial model trains on the MLIT transaction price dataset for the Tokyo metropolitan area, filtered to residential transactions from the last 10 years. Validation uses a temporal split: training on transactions before the most recent 12 months, validation on the most recent 6–12 months, testing on the most recent 6 months. Retraining occurs quarterly as new transaction data becomes available.

**Monitoring:** The system tracks prediction accuracy on properties that eventually transact, comparing the predicted value to the actual transaction price. A dashboard reports MAPE, median absolute error, and accuracy within 5%/10%/15% bands, broken down by area and property type. Significant degradation triggers an alert for model review.

---

## 5. Subsystem 4 — Visual Simulation Engine (VSE)

### 5.1 Floor Plan Ingestion

The VSE accepts floor plan data in two forms: structured data (dimensions, room types, wall positions, door and window positions) provided directly from listing data or partner APIs, and floor plan images (間取り図), which are processed through a computer vision pipeline that detects room boundaries, identifies room types from Japanese labels (和室, 洋室, LDK, UB, WIC, etc.), estimates dimensions from scale indicators or known fixture sizes (standard Japanese bath unit sizes, standard door widths), and produces a structured floor plan model.

Recognition accuracy target: 90%+ room identification and 85%+ dimensional accuracy for standard Japanese residential floor plans. When accuracy is uncertain, the system presents its interpretation to the user for confirmation before generating the 3D model.

### 5.2 3D Model Generation

From the structured floor plan, the system generates a navigable 3D environment using a library of parameterized architectural components standard to Japanese residential construction: Japanese-standard wall thicknesses and ceiling heights (typically 2400mm for standard apartments), standard fixture models (system kitchens in common Japanese widths of 1800mm, 2100mm, 2400mm, 2550mm; unit baths in standard sizes of 1216, 1317, 1418, 1616, 1620; Japanese-style toilets with washlet), standard flooring types (フローリング, 畳 in standard 江戸間 or 京間 sizes), Japanese-style sliding doors (襖, 障子) and closet configurations, balcony with standard Japanese railing styles, and genkan (玄関) entry area with step-up.

Materials and lighting are rendered to approximate photographic realism at interactive frame rates. The initial target is 30fps on mid-range mobile devices for the non-VR viewer and 72fps for VR headset delivery.

### 5.3 Renovation Simulation

When a user requests a renovation simulation through the chat interface, the VSE processes the request through the following pipeline.

The CI parses the natural language request into a structured modification specification. For example, "remove the wall between the kitchen and the living room and replace the flooring with light oak" becomes two modification operations: a wall removal operation specifying the wall segment between Room ID 3 (kitchen) and Room ID 4 (living room), and a material change operation specifying flooring material "light oak" for Room ID 3 and Room ID 4.

The VSE evaluates structural feasibility. For wall removal, it assesses whether the wall is likely load-bearing based on the building structure type, the wall's position relative to the building footprint, and the floor plan layout. The system does not make definitive structural assessments (that requires an engineer), but it flags high-risk modifications: "This wall may be load-bearing in this RC construction. A structural engineer assessment would be required before proceeding. Shall I show the simulation anyway with this caveat?"

The VSE generates the modified 3D model and renders a side-by-side before/after view. The user can navigate both versions in the 3D viewer or VR environment.

The system estimates renovation cost based on a cost database segmented by prefecture and work type. Costs include material costs (per square meter for flooring, per linear meter for walls, per unit for fixtures), labor costs (per work type, adjusted for prefecture), and a contingency range (typically 10–20%) to produce a cost range rather than a false-precision point estimate.

### 5.4 Delivery Formats

The VSE delivers content in three formats: a WebXR-based VR experience accessible through compatible web browsers and VR headsets, an interactive 3D viewer (non-VR) accessible in any modern web browser with mouse/touch navigation, and static rendered images for embedding in chat messages and LINE conversations where interactive content is not supported.

---

## 6. Subsystem 5 — Document Intelligence Service (DIS)

### 6.1 Document Ingestion

The DIS accepts documents as PDF files (both text-layer PDFs and image-only scanned PDFs), photographed documents (camera capture from mobile devices), and structured data received directly from partner systems.

For image-based inputs, the DIS applies OCR optimized for Japanese real estate documents, handling the mix of printed text, handwritten annotations, stamps (印鑑), tabular layouts, and specialized legal formatting common in these documents.

### 6.2 Document Analysis: Registry Transcript (登記簿謄本)

The DIS extracts and structures the following data from a property registry transcript.

From the 表題部 (title section): property type (land or building), location (所在), parcel number (地番) or building number (家屋番号), area (地積 or 床面積), building structure and number of floors, and registration date.

From the 権利部甲区 (Section A — ownership): current owner name and address, acquisition date and cause (sale, inheritance, etc.), and any ownership disputes or provisional registrations (仮登記).

From the 権利部乙区 (Section B — other rights): mortgages (抵当権) with lender name, amount, and interest rate, liens and pledges, easements (地役権), leasehold rights (賃借権), and any pending legal actions (差押 seizure, 仮差押 provisional seizure).

The DIS flags the following risk patterns automatically: multiple mortgages from non-institutional lenders (potential distressed property), provisional registrations that could indicate disputed ownership, seizures or provisional seizures that make clear title transfer impossible until resolved, discrepancies between the registered area and the listing-stated area, and recent high-frequency ownership transfers (potential fraud indicator).

### 6.3 Document Analysis: Important Matter Explanation (重要事項説明書)

The DIS parses the 重要事項説明書 and flags items requiring buyer attention, including zoning restrictions that affect property use, urban planning road widening designations (都市計画道路) that could affect the property, building code violations or non-conforming status (既存不適格), flood zone or hazard area designations, defect warranty terms and limitations (契約不適合責任), management association financial health for condominiums (修繕積立金の積立状況 and 大規模修繕の実施履歴), and any special conditions or encumbrances.

Each flagged item includes a severity rating (informational, caution, or critical), a plain-language explanation of what it means for the buyer, and a recommended action (e.g., "request the management association's long-term repair plan" or "negotiate the defect warranty period from 3 months to 12 months").

### 6.4 Document Generation

The DIS generates documents using standard templates from the 全日本不動産協会 and 全国宅地建物取引業協会連合会 form libraries. Template fields are populated from the Workflow State Manager's transaction record.

All generated documents are watermarked "DRAFT — 要確認" until reviewed and approved by a licensed professional. The system tracks the review status of every generated document and blocks downstream actions that depend on an unreviewed document.

---

## 7. Subsystem 6 — Workflow State Manager (WSM)

### 7.1 Purchase Journey State Machine

The WSM models the Japanese property purchase process as a state machine with the following primary states.

**SEARCHING** — The user is actively searching for properties. Allowed transitions: to SHORTLISTING when the user saves their first property.

**SHORTLISTING** — The user has one or more properties saved and is evaluating them. Allowed transitions: to VIEWING for a specific property, back to SEARCHING if the shortlist is cleared.

**VIEWING** — The user has scheduled or completed viewings (physical or virtual). Allowed transitions: to OFFERING for a specific property, back to SHORTLISTING if the user decides against all viewed properties.

**OFFERING** — The user has submitted a purchase offer (買付証明書). Allowed transitions: to NEGOTIATING if the seller counters, to CONTRACT_PREP if the offer is accepted, back to SHORTLISTING if the offer is rejected and the user doesn't counteroffer.

**NEGOTIATING** — Active negotiation on price or terms. Allowed transitions: to CONTRACT_PREP on agreement, back to SHORTLISTING on negotiation breakdown.

**CONTRACT_PREP** — Preparing for contract signing. This state includes the 重要事項説明 delivery, mortgage formal application, and contract document preparation. Allowed transitions: to CONTRACT_SIGNED on successful signing, back to SHORTLISTING if the deal falls through during preparation.

**CONTRACT_SIGNED** — The 売買契約 is executed and earnest money (手付金) has been paid. Allowed transitions: to SETTLEMENT_PREP.

**SETTLEMENT_PREP** — Preparing for final settlement (決済). This includes mortgage final approval, 司法書士 preparation for ownership transfer registration, and final walkthrough. Allowed transitions: to SETTLED on successful settlement, to DISPUTE if issues arise.

**SETTLED** — Ownership has transferred, payment is complete, keys are delivered. This is a terminal successful state.

**CANCELLED** — The transaction has been terminated at any stage. This is a terminal unsuccessful state. The WSM records the cancellation reason and stage.

### 7.2 Parallel State Tracking

The WSM supports a user being in different states for different properties simultaneously. A user can be in SHORTLISTING for their overall search while in OFFERING for Property A and VIEWING for Property B. Each property has its own independent state progression.

### 7.3 Deadline and Reminder Management

The WSM tracks all time-sensitive elements of the purchase process and proactively reminds users through the CI. Key deadlines include mortgage pre-approval expiration dates (typically 3–6 months), offer response deadlines, contract signing date commitments, loan formal application deadlines relative to contract date, settlement date, and mortgage rate lock expiration.

Reminders are issued at configurable intervals before deadlines (default: 7 days, 3 days, 1 day, day-of).

---

## 8. Data Model — Key Entities

**User:** Stores identity, contact, language preference, financial profile (income, employment, existing debts — encrypted at rest with field-level encryption), communication preferences, and authentication credentials.

**Property:** The canonical property record as described in Section 4.1. Includes source provenance, last-updated timestamp, and aggregation status.

**Journey:** One per user. Contains the overall search criteria, the list of shortlisted properties with per-property state, and the active transaction records.

**Transaction:** One per property under active consideration (OFFERING state or beyond). Contains the offer history, negotiation log, document references, mortgage application status, professional involvement records, and all action execution logs related to this transaction.

**Document:** Stores ingested and generated documents with their analysis results, review status, and version history.

**ActionLog:** Immutable log of every action executed by the LAE, with full input/output records and user approval evidence.

---

## 9. Integration Points

**External listing portals** (SUUMO, HOME'S, at-home): read-only data aggregation via web scraping with rate limiting and terms-of-service compliance, or via official API where available.

**REINS (レインズ):** Integration contingent on 宅建業 license. If available, read-only search and listing detail retrieval.

**登記情報提供サービス (Registration Information Service):** API integration for retrieving property registry transcripts. Requires user account and per-query fee payment.

**Financial institutions:** Structured integration with partner banks for mortgage pre-approval and formal application submission. Initially manual (the system generates completed application forms for the user to submit); evolving to API integration with banks that offer it.

**Google Maps Platform / Yahoo Japan Maps:** Geocoding, walking-time calculation, and map display.

**国土交通省 APIs / データ:** MLIT open data for transaction prices, land prices, and hazard information.

**LINE Messaging API:** For the LINE channel of the Conversational Interface and for sending transactional notifications.

**Partner agent systems:** API or structured-message integration for scheduling, document exchange, and status updates with partner real estate agencies.

---

## 10. Security & Privacy

### 10.1 Data Classification

**Highly Sensitive:** Financial profile data (income, debts, mortgage information), identity documents (residence card, driver's license copies), banking information. Encrypted at rest with AES-256 field-level encryption. Access restricted to the specific subsystem processing it, with audit logging on every access.

**Sensitive:** Personal contact information, conversation history, property preferences, transaction details. Encrypted at rest at the storage level. Access logged.

**Internal:** Aggregated property data, anonymized usage analytics, model training data. Standard access controls.

**Public:** Published property listings, official land prices, hazard map data.

### 10.2 Compliance

The system complies with Japan's 個人情報保護法 (Act on the Protection of Personal Information) including obtaining explicit consent for collection and use of personal data, purpose limitation (data collected for the property purchase process is not used for unrelated purposes without separate consent), user rights to access, correct, and delete their personal data, and proper handling of data transfers to third parties (partner agents, financial institutions) with user consent.

The system implements 犯罪収益移転防止法 (Anti-Money Laundering) identity verification requirements when facilitating transactions above the applicable thresholds.

### 10.3 Authentication

Users authenticate via email-based magic link or OAuth (Google, Apple, LINE Login) for initial access. For high-stakes actions (submitting offers, mortgage applications, contract signing), the system requires step-up authentication via SMS OTP or authenticator app.

---

## 11. Performance Requirements

Conversational response latency must be under 3 seconds for text responses and under 5 seconds for responses that require a backend query (property search, price prediction). Property search results must return within 2 seconds for cached/indexed data and within 5 seconds for queries requiring real-time aggregation from external sources. Price prediction must complete within 3 seconds per property. VR model initial load must complete within 10 seconds on a 50 Mbps connection. Renovation simulation rendering must complete within 15 seconds for a single modification. Document OCR and analysis must complete within 30 seconds for a standard-length document (up to 20 pages).

---

## 12. Glossary of Japanese Real Estate Terms Used in This Document

This glossary is provided for non-Japanese-speaking team members and stakeholders.

宅地建物取引業法 (たくちたてものとりひきぎょうほう) — Building Lots and Buildings Transaction Business Act, the primary law governing real estate transactions in Japan. 宅地建物取引士 (たくちたてものとりひきし) — Licensed Real Estate Transaction Specialist, required for delivering the important matter explanation. 重要事項説明書 (じゅうようじこうせつめいしょ) — Important Matter Explanation Document, a legally required disclosure document delivered before contract signing. 売買契約書 (ばいばいけいやくしょ) — Sale and Purchase Agreement. 司法書士 (しほうしょし) — Judicial Scrivener, a licensed professional who handles property registration. 登記簿謄本 (とうきぼとうほん) — Property Registry Transcript, the official record of property ownership and encumbrances. 路線価 (ろせんか) — Rosenka, land values along roads used for inheritance tax assessment, published by the National Tax Agency. 公示地価 (こうじちか) — Official Land Price, published annually by MLIT. 修繕積立金 (しゅうぜんつみたてきん) — Repair Reserve Fund, monthly contribution by condominium owners for future building maintenance. 管理費 (かんりひ) — Management Fee, monthly fee for condominium common area maintenance. 耐震等級 (たいしんとうきゅう) — Earthquake Resistance Grade. 新耐震基準 (しんたいしんきじゅん) — New Earthquake Resistance Standard (post-June 1981). 手付金 (てつけきん) — Earnest Money, typically 5–10% of the purchase price paid at contract signing. 決済 (けっさい) — Final Settlement, the closing event where remaining payment is made and ownership transfers. レインズ (REINS) — Real Estate Information Network System, the interagency listing database restricted to licensed agents.

---

*End of Functional Specification Document*