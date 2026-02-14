

# Regulatory Compliance Architecture Document
## AI-Powered Real Estate Platform — Japan Market (2024–2027)

**Document ID:** COMPLIANCE-ARCH-2026-001
**Version:** 1.0
**Created:** February 13, 2026
**Last Verified:** February 13, 2026
**Status:** Living Document — Active Maintenance Required
**Classification:** Internal — Engineering & Legal Reference

---

## 1. Document Purpose & Governance

This document translates the findings of the Comprehensive Legal Audit (February 2026) into an actionable compliance architecture specification. It serves as the single source of truth connecting legal obligations to platform features, engineering constraints, and the additional features roadmap.

This is a living document. Each section carries a "Last Verified" date. When the Regulatory Change Detection Layer (Feature 1.2) is operational, verification will be automated. Until then, manual review is required on the cadence defined in Section 8.

### 1.1 Intended Audiences

This document is designed to be read differently by three audiences. Engineers should focus on Sections 3, 4, and 5, which define system boundaries, data models, and workflow logic. Legal and compliance personnel should focus on Sections 2 and 6, which map statutory obligations to platform behavior and define the audit trail requirements. Product and business leadership should focus on Sections 2, 7, and 8, which frame the licensing model, the feature-to-regulation mapping, and the maintenance cadence.

### 1.2 Relationship to Other Documents

This document sits between the Legal Audit and the Additional Features Specification. The Legal Audit provides the raw legal analysis — what the law says, what it prohibits, what it requires. This document translates those findings into architectural decisions. The Additional Features Specification describes the platform capabilities that implement those decisions. Where a feature directly addresses a compliance requirement, this document provides the explicit linkage.

---

## 2. Regulatory Obligation Registry

This section catalogs every binding obligation identified in the Legal Audit, assigns each a unique identifier, and maps it to the platform component it affects. This registry is the backbone of the Compliance-as-a-Service Middleware (Feature 1.1).

### 2.1 Brokerage Licensing Domain

**REG-BRK-001: Mediation Boundary Enforcement**
Obligation: The platform must not perform any act constituting "Mediation" (Baikai) under Article 2, Item 2 of the Takken Act unless operating under a valid Brokerage License.
Statutory Source: Takken Act Articles 2, 3, 79.
Trigger Condition: Any AI-generated communication that negotiates price, adjusts transaction conditions, or communicates counter-offers between parties.
Platform Impact: The AI conversation engine requires a real-time classification layer that detects when a user's query crosses from "information provision" into "negotiation." Upon detection, the system must halt autonomous response and route to a licensed Takuchi Tatemono Torihikishi.
Verification Date: February 13, 2026.

**REG-BRK-002: Fee Structure Compliance**
Obligation: If the platform operates without a Brokerage License, fees must not be structured as success-based commissions contingent on transaction closure.
Statutory Source: Takken Act Article 46; METI Gray Zone determinations.
Trigger Condition: Any billing event linked to a completed property transaction rather than a service usage metric (API calls, lead delivery, subscription period).
Platform Impact: The billing engine must enforce a strict separation between "service fees" and "transaction outcomes." No database join should exist between the payments table and the transaction-closure table in the unlicensed operating model.
Verification Date: February 13, 2026.

**REG-BRK-003: Anti-Enclosure (Kakoi-komi) Data Integrity**
Obligation: Property listing status displayed on the platform must accurately reflect RAINS registration status. Facilitating false "Available" status for properties marked otherwise on RAINS constitutes a violation of Article 32 of the Takken Act and the Act against Unjustifiable Premiums and Misleading Representations.
Statutory Source: Takken Act Enforcement Regulations (January 2025 amendment).
Trigger Condition: Any listing displayed as "Available" when the corresponding RAINS record indicates "Under Offer" or "Contract Concluded."
Platform Impact: The listing ingestion pipeline must include a RAINS status reconciliation step. Where direct RAINS API access is unavailable, the platform must implement a partner-agent attestation workflow requiring agents to confirm listing accuracy on a defined cadence. Stale listings exceeding the reconciliation window must be automatically flagged or suppressed.
Verification Date: February 13, 2026.

**REG-BRK-004: Decoy Listing Prohibition**
Obligation: The platform must not display properties that do not exist, are not actually for sale, or are materially different from the listing description.
Statutory Source: Fair Competition Code for Real Estate Representations; Takken Act Article 32.
Trigger Condition: Any listing where the underlying property has been sold, withdrawn, or where listing attributes (price, size, location) are materially inaccurate.
Platform Impact: Automated listing validation must run on ingestion and on a recurring schedule. Listings failing validation enter a quarantine state and are hidden from search results until an agent re-confirms accuracy.
Verification Date: February 13, 2026.

### 2.2 Digital Important Matter Explanation (IT Jusetsu) Domain

**REG-JTS-001: Human Specialist Presence**
Obligation: A licensed Takuchi Tatemono Torihikishi must conduct the Important Matter Explanation. An AI avatar or pre-recorded video cannot substitute for the human specialist.
Statutory Source: Takken Act Article 35; MLIT IT Jusetsu Manual (December 2024 Edition).
Trigger Condition: Any IT Jusetsu session initiated on the platform.
Platform Impact: The video conferencing module must enforce a "specialist gate" — the session cannot proceed past the introductory phase unless a verified specialist account is connected to the call. Specialist identity is confirmed via their Takken-shi registration number stored in the platform's agent management system.
Verification Date: February 13, 2026.

**REG-JTS-002: Pre-Session Document Delivery**
Obligation: The Article 35 Important Matter Explanation Document must be in the customer's possession (digitally or physically) before the explanation session begins.
Statutory Source: Takken Act Article 35; IT Jusetsu Manual.
Trigger Condition: Session start event.
Platform Impact: The session scheduling workflow must include a document delivery confirmation step. The system generates the document, delivers it to the customer's designated channel (in-app, email), and records a delivery timestamp. The video session "Start" button remains disabled until the system confirms delivery and the customer acknowledges receipt.
Verification Date: February 13, 2026.

**REG-JTS-003: Pre-Session Consent for Digital Delivery**
Obligation: The customer must give explicit, recorded consent to receive the explanation via digital means and to receive documents electronically, prior to the session.
Statutory Source: Digital Reform Laws amendments to Takken Act; IT Jusetsu Manual.
Trigger Condition: Scheduling of any IT Jusetsu session.
Platform Impact: A consent capture module must be embedded in the session booking flow. The consent record (timestamp, user ID, consent text displayed, affirmative action taken) must be stored immutably in the Decision Audit Trail (Feature 1.3).
Verification Date: February 13, 2026.

**REG-JTS-004: Connectivity Verification**
Obligation: The platform must verify that the customer's connection supports stable bi-directional video and audio before the session proceeds. Unstable sessions must be suspended.
Statutory Source: IT Jusetsu Manual (December 2024 Edition).
Trigger Condition: Pre-session technical check.
Platform Impact: A "Tech Check" module must run before every session, testing bandwidth, latency, and device compatibility. If metrics fall below defined thresholds, the session is blocked and the customer is prompted to resolve connectivity issues. During the session, real-time monitoring must detect degradation and trigger a pause state with an on-screen notification to both parties.
Verification Date: February 13, 2026.

**REG-JTS-005: Visual ID Verification**
Obligation: The specialist must display their physical Takken-shi identification card on camera during the session, and the customer must be able to read the name and registration number on their screen.
Statutory Source: Takken Act Article 35; IT Jusetsu Manual.
Trigger Condition: Session commencement.
Platform Impact: The session flow must include a dedicated "ID Display" step early in the call. The platform should prompt the specialist to hold up their card and may optionally use image recognition to confirm the card is visible and legible. The timestamp of this event is logged in the audit trail.
Verification Date: February 13, 2026.

### 2.3 Digital Contracts & Electronic Signatures Domain

**REG-SGN-001: Digital Consent for Contract Delivery**
Obligation: The customer must explicitly consent to receiving the Article 37 Contract document in digital form. Without documented consent, digital delivery is voidable.
Statutory Source: Takken Act (as amended May 2022); Digital Reform Laws.
Trigger Condition: Any contract document generated for digital delivery.
Platform Impact: The contract generation workflow must include a consent capture gate identical in structure to REG-JTS-003. Consent records are archived for a minimum of 10 years (aligned with tax document retention requirements).
Verification Date: February 13, 2026.

**REG-SGN-002: Timestamping Requirement**
Obligation: All electronic contracts must be timestamped by a recognized Time Stamping Authority (TSA) to establish document integrity and temporal proof.
Statutory Source: Electronic Signature Act; Electronic Book Preservation Act.
Trigger Condition: Any electronic contract finalization event.
Platform Impact: The e-signature workflow must include a TSA integration step as a mandatory post-signature process. The timestamp token is stored alongside the signed document.
Verification Date: February 13, 2026.

**REG-SGN-003: Notary Integration for Business Fixed-Term Land Leases**
Obligation: General Fixed-Term Leases for Business Purposes (Article 23, Act on Land and Building Leases) require notarization. Since October 1, 2025, electronic notarization is available but requires integration with the Notary's system, including a video call with the Notary.
Statutory Source: Notary Act (amended October 2025); Act on Land and Building Leases Article 23.
Trigger Condition: Any transaction classified as a Business Fixed-Term Land Lease.
Platform Impact: The transaction type classification engine must detect this lease category and route it to a dedicated "Notary Coordination" workflow. This workflow provides the user with instructions, schedules the notary video session, and blocks the standard e-signature flow for this document type. Using a standard e-signature for this lease type renders the fixed-term clause void, potentially converting it into a standard lease — a catastrophic liability event for the landlord.
Verification Date: February 13, 2026.

### 2.4 Foreigner-Specific Regulations Domain

**REG-FRN-001: Domestic Contact Person Registration**
Obligation: Non-resident foreign owners must register a Domestic Contact Person (a person residing in Japan) who can receive legal notices. Without this, the Legal Affairs Bureau will reject the ownership transfer registration.
Statutory Source: Real Estate Registration Act (amended April 1, 2024).
Trigger Condition: Any transaction where the buyer is identified as a non-resident foreign national.
Platform Impact: The user profile schema for foreign non-resident users must include mandatory fields for Domestic Contact Person (name, address in Japan, relationship to buyer). The transaction cannot proceed to the registration preparation phase until these fields are populated and validated.
Verification Date: February 13, 2026.

**REG-FRN-002: Romanji Name Registration**
Obligation: Foreign names must be registered in Roman characters in addition to Katakana in the real estate registry.
Statutory Source: Real Estate Registration Act (amended April 1, 2024).
Trigger Condition: Any registration document generated for a foreign national.
Platform Impact: The user profile schema must include both a Katakana name field and a Romanji name field. Document generation templates must populate both. Validation logic must ensure the Romanji field matches passport/Residence Card data captured during KYC.
Verification Date: February 13, 2026.

**REG-FRN-003: FEFTA Acquisition Reporting**
Obligation: Non-residents acquiring real estate in Japan must file a report with the Minister of Finance (via the Bank of Japan) within 20 days of acquisition.
Statutory Source: Foreign Exchange and Foreign Trade Act.
Trigger Condition: Transaction closure involving a non-resident buyer (investment properties; own-residence exemptions exist but should not be assumed by the platform).
Platform Impact: The post-transaction workflow for flagged non-resident users must include an automatic generation of the "Report on Acquisition of Real Estate" form, a notification to the buyer of the 20-day filing deadline, and optionally, integration with a Judicial Scrivener partner to handle filing.
Verification Date: February 13, 2026.

**REG-FRN-004: Important Land Survey Act Awareness**
Obligation: Properties located within designated zones under the 重要土地等調査法 (Important Land Survey Act, effective September 2022) near defense facilities and other sensitive sites may be subject to pre-acquisition review or usage restrictions for foreign buyers.
Statutory Source: Act on Review and Regulation of Use of Real Property Surrounding Important Facilities and on Remote Territorial Islands.
Trigger Condition: Any transaction where the property's geolocation falls within a designated zone and the buyer is a foreign national.
Platform Impact: The property database should incorporate designated zone boundary data. When a foreign buyer views or initiates a transaction on a property within a designated zone, the system should surface a notification explaining potential additional review requirements and recommending legal counsel. This is currently an awareness obligation rather than a blocking obligation for the platform, but the regulatory trajectory suggests it may tighten.
Verification Date: February 13, 2026. Note: This regulation was identified as a gap in the original Legal Audit and added based on supplementary analysis. Monitor for expansion of designated zones and procedural requirements.

### 2.5 AI Liability & Price Prediction Domain

**REG-AIL-001: Valuation Disclaimer Requirement**
Obligation: AI-generated property valuations must carry a prominent disclaimer clarifying that the output is a statistical estimate, not a formal Real Estate Appraisal (Fudosan Kantei) under the Real Estate Appraisal Act.
Statutory Source: Real Estate Appraisal Act; Consumer Contract Act.
Trigger Condition: Any display of an AI-generated price estimate to a user.
Platform Impact: The valuation display component must render a disclaimer that is visually prominent (not buried in fine print), appears on the same screen as the valuation, and uses the term 査定 (Satei/Assessment) or 推定価格 (Suitei Kakaku/Estimated Price), never 鑑定 (Kantei/Appraisal).
Verification Date: February 13, 2026.

**REG-AIL-002: Liability Limitation Clause Structure**
Obligation: The Terms of Service may limit liability to a reasonable amount (e.g., fees paid by the user) but may not totally exempt the platform from liability. Total exoneration clauses are void under Article 8 of the Consumer Contract Act. Even partial limitation is void for intentional misconduct or gross negligence.
Statutory Source: Consumer Contract Act Articles 8, 10.
Trigger Condition: ToS drafting and update.
Platform Impact: The ToS must include a liability limitation clause explicitly carving out intentional misconduct and gross negligence. Legal review of the ToS must verify this structure before every update. The clause text should follow the pattern: "Our liability shall be limited to [amount/formula], except in cases of intentional misconduct or gross negligence on our part."
Verification Date: February 13, 2026.

**REG-AIL-003: Known Limitation Disclosure**
Obligation: If the AI has known blind spots (e.g., inability to parse handwritten annotations in old property documents, incomplete coverage of psychological defect databases), failing to disclose these limitations to users could constitute gross negligence if a user suffers loss.
Statutory Source: Civil Code (Tort); Consumer Contract Act; MLIT Guidelines on Disclosure of Death in Properties.
Trigger Condition: Any AI-generated output that relies on data sources with known coverage gaps.
Platform Impact: The valuation and property analysis modules must include a "Data Sources & Limitations" disclosure accessible from the results screen. The AI model documentation must maintain a registry of known blind spots, and the disclosure text must be updated whenever a new limitation is identified. This registry feeds directly into the Decision Audit Trail (Feature 1.3).
Verification Date: February 13, 2026.

### 2.6 Data Privacy (APPI) Domain

**REG-PRI-001: Person-Related Information Consent**
Obligation: The platform cannot transfer Person-Related Information (cookies, browsing history, IP addresses) to a third party (e.g., a partner real estate agent) who is likely to link it with Personal Data (the user's name or email) without the user's consent.
Statutory Source: APPI (2022 amendments); PPC guidelines on Person-Related Information.
Trigger Condition: Any lead delivery event where behavioral data (browsing history, property views, search patterns) is appended to a lead containing personally identifiable information.
Platform Impact: A Consent Management Platform (CMP) must be implemented. The CMP must present a clear, affirmative consent request before any lead enrichment occurs. The consent record is stored in the audit trail. If the user declines, the lead is delivered with PII only (name, contact info, stated interest) and no behavioral data.
Verification Date: February 13, 2026.

**REG-PRI-002: Cross-Border Data Transfer Disclosure**
Obligation: If personal data is stored or processed outside Japan, the platform must either obtain user consent (after disclosing the destination country's data protection regime) or ensure the receiving entity has equivalent protective measures in place.
Statutory Source: APPI Article 28; PPC guidelines on foreign third parties.
Trigger Condition: Any personal data storage or processing event occurring on infrastructure located outside Japan.
Platform Impact: The Privacy Policy must name the hosting country, describe its data protection framework (or lack thereof), and explain the contractual or technical safeguards in place. If hosting in the US, reference the Japan-US Digital Trade Agreement and the Data Privacy Framework as the basis for adequacy, but note that a full PPC adequacy decision for the US does not exist.
Verification Date: February 13, 2026.

**REG-PRI-003: AI Training Data Opt-Out**
Obligation: Following PPC's 2024 guidance on Generative AI, users should have a mechanism to opt out of having their personal data used to train the platform's AI models.
Statutory Source: PPC 2024 guidance on Generative AI; APPI purpose limitation provisions.
Trigger Condition: Any use of user-generated data (search queries, interaction patterns, feedback) as training input for AI models.
Platform Impact: The user settings interface must include an AI Training Opt-Out toggle. When enabled, the platform must exclude that user's data from training pipelines. The technical implementation must ensure this exclusion is enforced at the data pipeline level, not merely at the consent record level.
Verification Date: February 13, 2026.

---

## 3. Mediation Boundary Detection System

This section specifies the core engineering requirement that prevents the platform from inadvertently performing unlicensed brokerage. It is the technical implementation of REG-BRK-001 and the architectural heart of the "Co-Pilot" model recommended in the Legal Audit.

### 3.1 Classification Taxonomy

Every user message processed by the AI conversation engine must be classified into one of three categories before a response is generated.

**Category A — Information Provision (Safe Zone).** These are queries about factual, publicly available property attributes or general real estate knowledge. Examples include questions about distance to the nearest station, the age of the building, average rent in a neighborhood, or how the Japanese lease renewal process generally works. The AI may respond autonomously.

**Category B — Scheduling & Logistics (Safe Zone with Constraints).** These are requests to arrange viewings or connect with an agent. The AI may respond autonomously only if it is coordinating logistics (calendar availability, location confirmation) without expressing any opinion on the property's suitability for the specific user's transaction goals. The moment the AI says something like "this property is a good fit for your budget" in the context of scheduling a viewing, it edges toward mediation.

**Category C — Negotiation & Condition Adjustment (Restricted Zone).** These are any queries or interactions where the user is seeking or the AI would be providing guidance on price, contract terms, negotiation strategy, or specific suitability assessments tied to a pending transaction. Examples include "Can I get a discount?", "Is this clause standard?", "Would the landlord accept monthly payments?", "Should I offer below asking price?" The AI must not respond autonomously. It must draft a response, flag it as Category C, and route it to a licensed specialist for review and manual dispatch.

### 3.2 Detection Methodology

The classification layer operates as a pre-response filter in the conversation pipeline. It should use a combination of keyword/pattern detection (as a fast, high-recall first pass) and a secondary LLM-based intent classifier (for nuanced cases where keyword matching is insufficient).

The system must err on the side of caution. If the classifier assigns a confidence score below a defined threshold for Category A or B, the message defaults to Category C and is routed to a human. False positives (safe messages incorrectly flagged as Category C) are acceptable and reduce over time through model refinement. False negatives (Category C messages incorrectly classified as safe) are compliance violations and must be treated as critical defects.

### 3.3 Handoff Protocol

When a Category C message is detected, the following sequence executes. The AI generates a draft response based on the user's query. The draft is tagged with the triggering classification metadata (input text, detected intent, confidence score). The draft is placed in a review queue visible to the on-duty licensed specialist. The user receives an immediate automated message: "Thank you for your question. I'm connecting you with a licensed specialist who can assist you with this. Please allow a moment." The specialist reviews the draft, edits if necessary, and clicks "Send." The platform logs the specialist's ID, the timestamp of their review, and the final text sent, in the Decision Audit Trail. Legally, the specialist is the actor. The AI is the tool.

### 3.4 Escalation Metrics

The platform must track the Category C escalation rate as a key operational metric. A sudden spike in escalations may indicate that the AI's training data or prompt engineering needs adjustment. A sustained low escalation rate should be audited to confirm the classifier is not under-detecting — not simply celebrated as efficiency.

---

## 4. IT Jusetsu Orchestration Module

This section specifies the workflow engine that ensures every digital Important Matter Explanation conducted on the platform satisfies the requirements of REG-JTS-001 through REG-JTS-005.

### 4.1 Session Lifecycle

The IT Jusetsu session follows a seven-phase lifecycle, each gated by a compliance check.

**Phase 1 — Scheduling.** The agent or system initiates a Jusetsu session. The platform verifies that a licensed specialist is assigned to the session (REG-JTS-001). If no specialist is assigned, scheduling is blocked.

**Phase 2 — Consent Capture.** The customer receives a consent request via the platform's notification system. The request explains that the explanation will be conducted digitally and that documents will be delivered electronically. The customer must affirmatively accept. The consent record (text displayed, timestamp, user action) is stored immutably (REG-JTS-003).

**Phase 3 — Document Delivery.** The Article 35 document is generated and delivered to the customer through the platform. The system records a delivery timestamp and requires the customer to confirm receipt (e.g., opening the document within the app or clicking a confirmation link). The session cannot advance until confirmation is recorded (REG-JTS-002).

**Phase 4 — Tech Check.** At a configurable interval before the session (e.g., 15 minutes), the customer is prompted to run a connectivity test. The module tests upload/download bandwidth, latency, video resolution capability, and audio clarity. Results are stored. If the customer's connection fails to meet thresholds, the session is flagged and the specialist is notified. The session may proceed at the specialist's discretion with a recorded acknowledgment of suboptimal conditions, or it may be rescheduled (REG-JTS-004).

**Phase 5 — Session Start & ID Verification.** The video call begins. The platform prompts the specialist to display their Takken-shi card. An optional image recognition module may verify card visibility. The timestamp of the ID display event is logged (REG-JTS-005). The session recording begins (with prior consent obtained in Phase 2).

**Phase 6 — Explanation Delivery.** The AI-assisted reading tool displays the document on the shared screen and reads each section aloud via text-to-speech. After each section, the system pauses and the specialist asks whether the customer has questions. The specialist addresses questions directly. Key events are timestamped: section start times, pause points, customer questions (flagged by the specialist or detected via audio analysis), and specialist responses.

**Phase 7 — Completion & Archival.** The specialist confirms that all sections have been explained and the customer confirms understanding. The session recording, all timestamped events, consent records, tech check results, and document delivery confirmations are bundled into a single compliance package and archived for the statutory retention period.

### 4.2 Failure Modes

If the video connection drops during the session, the platform enters a suspension state. A reconnection window (configurable, e.g., 5 minutes) allows the parties to rejoin. If reconnection fails, the session is marked incomplete and must be rescheduled. An incomplete session does not satisfy the Jusetsu requirement.

If the specialist's identity cannot be verified (e.g., their Takken-shi registration number does not match the platform's records), the session is terminated and an alert is sent to the compliance administrator.

---

## 5. Data Model Requirements

This section defines the minimum data structures required to satisfy the regulatory obligations cataloged in Section 2.

### 5.1 User Profile Schema (Foreign Non-Resident Extension)

In addition to standard user profile fields, the following fields are mandatory for users identified as foreign non-residents, in direct response to REG-FRN-001 and REG-FRN-002.

The profile must include a Romanji name field (alphabetic, matching passport), a Katakana name field, a nationality field, a residency status field (resident or non-resident), a domestic contact person block (containing the contact's full name, address in Japan, phone number, and relationship to the user), and a FEFTA reporting flag (boolean, auto-set to true for non-resident investment transactions).

### 5.2 Property Listing Schema (Compliance Extension)

Each property listing must include, beyond standard real estate attributes, a RAINS status field (synced or attested, with a last-updated timestamp), a listing validation status (active, quarantined, or expired), a designated zone flag (boolean, indicating whether the property falls within an Important Land Survey Act zone), and a psychological defect disclosure flag (with a free-text field for details, aligned with MLIT disclosure guidelines).

### 5.3 Transaction Record Schema

Each transaction must include the transaction type (residential sale, residential lease, business fixed-term land lease, etc.), the buyer residency classification (resident or non-resident), a consent record array (linking to all consent events captured during the transaction lifecycle), an e-signature metadata block (signature type used, TSA timestamp token, vendor reference), and a FEFTA report status field (not applicable, pending, filed, confirmed) for non-resident transactions.

---

## 6. Decision Audit Trail Specification

This section defines the requirements for the Decision Audit Trail (Feature 1.3) as it specifically serves regulatory compliance. The audit trail is not a general application log. It is a purpose-built, tamper-evident record of every decision point where the platform's behavior is shaped by a regulatory obligation.

### 6.1 Events to Capture

The audit trail must record, at minimum, the following event categories.

**Mediation boundary events:** Every Category C classification, including the input text, the classifier's output, the confidence score, the draft response generated, the specialist who reviewed it, any edits made, and the final response sent.

**Consent events:** Every consent capture, including the regulation it satisfies (by REG identifier), the exact text presented to the user, the user's action (accepted or declined), and the timestamp.

**IT Jusetsu lifecycle events:** Every phase transition in the Jusetsu session lifecycle, including the specialist's verified identity, document delivery confirmation, tech check results, ID display timestamp, section-by-section completion timestamps, and session recording reference.

**Valuation events:** Every AI-generated price estimate, including the input data used, the model version, the output value or range, the confidence score, and confirmation that the disclaimer was rendered on screen.

**KYC events:** Every identity verification event, including the method used (NFC, JPKI, or legacy photo upload while still permitted), the result, and the timestamp.

**Data transfer events:** Every instance of Person-Related Information being transferred to a third party, including the consent record that authorized it.

### 6.2 Storage Requirements

Audit trail records must be immutable once written. The storage system should use append-only structures or cryptographic chaining (each record includes a hash of the previous record) to ensure tamper evidence. Retention period is a minimum of 10 years for transaction-related records, aligned with tax document requirements and the longest applicable statutory limitation period. Access to audit trail records must be restricted and itself logged.

---

## 7. Feature-to-Regulation Mapping

This section provides the explicit linkage between the Additional Features Specification and the regulatory obligations defined in this document.

### 7.1 Compliance-as-a-Service Middleware (Feature 1.1)

This feature implements the enforcement layer for the entire Regulatory Obligation Registry (Section 2). Each REG entry becomes a rule in the middleware. The middleware intercepts platform actions (message sent, document generated, listing displayed, lead delivered, session started) and validates them against the applicable rules before allowing the action to proceed. When a rule is violated, the middleware blocks the action and returns a structured error identifying the obligation, the violation, and the required remediation.

### 7.2 Regulatory Change Detection Layer (Feature 1.2)

This feature automates the "Last Verified" maintenance process defined in Section 8. It monitors the statutory sources cited in each REG entry for amendments, new guidance, or enforcement actions. When a change is detected, it generates an alert identifying the affected REG entries and the nature of the change. Until this feature is operational, the manual review cadence in Section 8 applies.

The priority monitoring targets, based on the Legal Audit's timeline, are the April 2027 AML/KYC method abolition (REG-FRN-004 adjacent, affecting KYC architecture), any MLIT guidance on AI participation in Jusetsu sessions (REG-JTS-001, as the pilot programs referenced in the audit may produce new rules), and any expansion of designated zones under the Important Land Survey Act (REG-FRN-004).

### 7.3 Decision Audit Trail (Feature 1.3)

This feature implements the specification in Section 6. The Legal Audit's warning about "black box omission" constituting gross negligence (Section 5.2 of the audit, translated into REG-AIL-003 here) is the primary legal justification for this feature's existence. The audit trail is not a nice-to-have logging enhancement. It is the platform's primary defense against liability claims arising from AI errors.

### 7.4 Compliance Cost Calculator (Feature 2.4)

This feature can derive its cost model from the procedural steps documented in this architecture. Each compliance gate (consent capture, tech check, document delivery, specialist review, FEFTA form generation, notary coordination) represents a measurable unit of operational overhead. The calculator quantifies how much of that overhead is absorbed by automation versus manual effort, providing the business case for each platform capability.

---

## 8. Maintenance Cadence & Verification Protocol

This document requires active maintenance. Regulatory compliance is not a point-in-time achievement; it is a continuous state that must be verified.

### 8.1 Scheduled Reviews

**Monthly:** Review MLIT, PPC, and Financial Services Agency (FSA) announcement pages for new guidance, enforcement actions, or public comment periods relevant to any REG entry. Update "Last Verified" dates on reviewed entries.

**Quarterly:** Conduct a full read-through of all REG entries against current statutory text. Verify that no amendment has been enacted that changes the obligation. Review the Mediation Boundary Detection System's classification accuracy using a sample of escalated and non-escalated conversations.

**Annually:** Engage external legal counsel to perform an independent verification of the full Regulatory Obligation Registry against the current statutory landscape. This annual review should produce a formal opinion letter that can be retained as evidence of diligence.

### 8.2 Triggered Reviews

A triggered review must occur immediately upon any of the following events: enactment of a new law or amendment affecting real estate transactions, PropTech, AI regulation, or data privacy in Japan; issuance of new MLIT, PPC, or METI guidance or enforcement action in the PropTech or AI domain; a material change to the platform's business model (e.g., expanding from residential to commercial, adding a new fee structure, entering a new geographic market); or a compliance incident (any event where the platform's behavior may have violated a REG entry).

### 8.3 Version History

All changes to this document must be recorded in a version history log appended to the document. Each entry must include the date of change, the REG entries affected, a summary of the change, the reason for the change (scheduled review, triggered review, or initial creation), and the identity of the person who made and approved the change.

---

## Appendix A: KYC Method Transition Plan

The April 2027 abolition of the "Ho" method (photo upload eKYC) requires a phased technology transition. This appendix outlines the recommended approach.

**Phase 1 (Current through Q2 2026): Dual-Track Implementation.** Implement NFC-based IC chip reading and JPKI (My Number Card) authentication as the primary KYC methods for all new users. Retain the "Ho" method as a fallback for users whose devices lack NFC capability. All users verified via the "Ho" method during this phase are flagged for re-verification before April 2027.

**Phase 2 (Q3 2026 through Q1 2027): Migration.** Proactively contact all users whose most recent KYC was performed via the "Ho" method. Request re-verification via NFC or JPKI. Users who do not re-verify by a defined deadline are downgraded to a restricted account status (viewing only, no transaction initiation).

**Phase 3 (April 2027 onward): Ho Method Decommission.** Remove the "Ho" method from the KYC workflow entirely. Any remaining users who have not re-verified are placed in a suspended state with clear instructions on how to complete NFC or JPKI verification to restore full access.

For foreign non-residents without My Number Cards, the platform must support NFC reading of passport IC chips as the primary verification method. Partnership with a KYC vendor that supports passport NFC (e.g., Liquid, TrustDock) is required.

---

## Appendix B: E-Signature Routing Decision Tree

When a transaction reaches the contract execution phase, the platform must route to the correct e-signature workflow based on transaction type.

The routing logic proceeds as follows. First, the system checks whether the transaction is a General Fixed-Term Lease for Business Purposes (Article 23). If yes, the system routes to the Notary Coordination Workflow: the standard e-signature flow is blocked, the user is informed that notarization is required, the platform provides instructions for connecting with the electronic notary system, and optionally schedules the notary video session. If the transaction is not an Article 23 lease, the system checks whether the customer has consented to digital contract delivery (REG-SGN-001). If no consent has been recorded, the system initiates the consent capture workflow before proceeding. If consent is recorded, the system routes to the standard e-signature workflow via the integrated vendor (CloudSign, GMO Sign, or equivalent). After signature completion, the TSA timestamping step executes automatically (REG-SGN-002). The signed and timestamped document is archived with the transaction record.

---

## Appendix C: Source Verification Notes

The Legal Audit cites primarily industry blogs, professional association pages, and practitioner commentary. While these sources are generally reliable for describing the practical effect of regulations, the following obligations should be verified against primary statutory text or official MLIT/PPC publications before they drive irreversible architectural decisions.

**REG-BRK-003 (Anti-Enclosure):** The January 2025 enforcement regulation amendment should be verified against the 官報 (Official Gazette) text of the Takken Act Enforcement Regulations amendment. The cited sources (ielove-cloud, rita-hudousan) are practitioner interpretations.

**REG-JTS-001 (AI prohibition in Jusetsu):** Citation 8 links to a Cabinet Office regulatory reform meeting document from April 2025 discussing AI in Jusetsu. This suggests the boundary is under active policy discussion. The prohibition described in the audit may be the current state but could evolve. This is the highest-priority item for the Regulatory Change Detection Layer.

**REG-SGN-003 (Electronic Notary):** The October 2025 Notary Act amendment is confirmed by the Japan National Notaries Association (citation 25). However, operational details at the individual notary office level may vary. Integration testing with actual notary offices should supplement the architectural specification.

**REG-FRN-004 (Important Land Survey Act):** This entry was added based on supplementary analysis and is not covered in the original Legal Audit. Independent legal verification is required before building designated zone detection into the property database.

---

*End of Document*

*Next scheduled review: March 13, 2026*
*Responsible party: [To be assigned]*
*Approval authority: [To be assigned]*