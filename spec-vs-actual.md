# SynaClair: Specification vs Actual Implementation

**From:** Claude (Boss's dev session) · **To:** พี่ปาล์ม and the AI reviewing the handoff · **Date:** 2 Nov 2026
**Spec:** SynaClair_Claude_Handoff_v2_3 + Update v2_4 (SHA-256 of the 4 baseline files checked; they match)
**Code:** repo `home-pt-mvp`, branch `fix/rehearsal-profile-payment-ref`, commit `921e39a`

## 0. How to read this

There are two places to compare:

| Place | What it is | Status |
|---|---|---|
| **Real app** (`apps/api`, `apps/web`, `packages/contracts`) | NestJS + Next.js + Prisma; the system that will really run | **Not changed** this round. Checked by reading the code; no tests were run against v2.4. |
| **Simulator** (`docs/design/rehearsal-simulator`, link https://napphattua.github.io/synaclair-flow-demo/) | A clickable mock of the whole flow, sample data, no backend | **Changed to follow v2.4 on 2 Nov** (Boss: "ทำตามโฟลวพี่ปาม"). Tested by clicking through it automatically, plus a check that all 16 stages still work. |

Status codes: `DONE` · `PARTIAL` · `NOT_STARTED` · `BLOCKED` (needs a clinical or legal person) · `CONFLICT` (clashes with an older rule)

Everything here is a **Working Draft**. Nothing is clinically validated, and nothing is approved for production.

## 1. Summary

1. **Real app:**
   - The **safety core is already there**:
     - an emergency stops the booking and shows 1669
     - an unknown answer goes to a person to check
     - a clinical-review case does not get a payment request until a Clinical Lead clears it (R2.5)
     - payment comes before matching
     - a PT sees little before accepting a job
   - The **v2.3 data model is missing completely**: 6 services, 24 tasks, mapping, 26 cases, and PT task declarations.
2. **Simulator:** now has the 6 groups, the 24 tasks and the mapping, a PT task-declaration step, group-specific screening questions, a clinical-review screen that approves specific activities, a locked S06, and skill gates before matching. It does **not** have the 26 case rules as per-case logic.
3. **S06 Suction is never auto-matched anywhere:**
   - Real app: there is no auto-matching at all; an admin picks the PT, and a tracheostomy always goes to review.
   - Simulator: S06 is locked and cannot be approved or declared.

## 2. The 20 decisions (R1.1–R4.5)

| ID | Spec says | Real app | Evidence (real app) | Simulator |
|---|---|---|---|---|
| R1.1 | PT picks services first, then only related tasks (de-duplicated) | NOT_STARTED | `pt-recruitment.ts:78`: `specialties`, `excludedCases` are free text | DONE: sign-up step "งานที่รับ", 6 groups → tasks de-duplicated |
| R1.2 | can_do / cannot_do / request_review | NOT_STARTED | — | DONE: ทำได้ / ยังไม่ถนัด / ขอคุยก่อน |
| R1.3 | Verify licence; evidence review by risk; self-report ≠ approval | PARTIAL · BLOCKED | Licence review exists (`PtApplication.licenseReviewOutcome`, `PtProfile.licenseVerifiedAt`, `staff-admin.service.ts:170-220`) | PARTIAL: admin sees declarations; specialty tasks need an "evidence checked" tick. Evidence thresholds are BLOCKED. |
| R1.4 | Equipment and who owns it; helpers | NOT_STARTED | Only `MobilityLevel.USES_AID`, `SupportNeed.TRANSFER/CAREGIVER_PRESENT` | PARTIAL: PT equipment chips; patient helpers asked only in the bedridden group |
| R1.5 | Gates before a PT can get jobs | PARTIAL | `pt-offer.service.ts:209-226` checks zone, active, licence, role, slot, suspicion, hold. **Missing:** application APPROVED, terms accepted, LINE bound, published schedule only | PARTIAL: licence + schedule sent + clinical cleared + skills. Terms are accepted at the first job (older Boss rule). |
| R2.1 | Six-part screening, branches by service, red-flag interrupt | PARTIAL · CONFLICT | 9 steps in `redesigned-intake.tsx`; emergency → 1669 and server `EMERGENCY_SCREEN_POSITIVE`; no branches by service | PARTIAL: one question set per group (pain duration / weight-bearing / neuro condition / falls / transfer helpers / sputum-suction). Thai wording is not approved. |
| R2.2 | Keep Barthel; selective full scale after review | DONE (kept) · BLOCKED for the change | 10 items, encrypted, `sourceVersion: PKN_2019_20` | Kept unchanged |
| R2.3 | Several goals; unknown → review | PARTIAL | Goals 1–6; every question has `UNKNOWN`; UNKNOWN → review (`intake-policy.ts:7`). No primary/secondary split; goal list lacks endurance, breathing, sputum | Same plus a primary group; no secondary |
| R2.4 | Home readiness, helpers, equipment | PARTIAL | No 1 vs 2+ caregivers, no hoist | PARTIAL: bedridden group only |
| R2.5 | Review cases: feasibility before the first payment; routine pays before matching | **DONE** | `clinicalStatus=PENDING` → no invoice → CLEARED → invoice → PAID → MATCHING (`intake-journey.service.ts:52-58`, `pt-offer.service.ts:171`) | DONE |
| R3.1 | Required ≠ automatic hard filter | NOT_STARTED (nothing filters wrongly) | — | DONE: a missing group is a warning; only approved activities are checked |
| R3.2 | 4 new case labels | NOT_STARTED | No case-rule store | NOT_STARTED (no per-case rules) |
| R3.3 | Review holds matching; approve specific activities only | PARTIAL | Holds matching ✓; decision is all-or-nothing `CLEARED/DECLINED` | DONE: tick activities + limits, or "call first"; PT sees the approved list in the offer |
| R3.4 | Clinical Lead owns risky cases; S06 separate gate | PARTIAL · BLOCKED | Role `CLINICAL_LEAD` exists; reviewer, time and reason stored | PARTIAL: reviewer shown as a sample; S06 locked |
| R3.5 | 26-case regression + negative tests + clinician sign-off | NOT_STARTED · BLOCKED | — | NOT_STARTED |
| R4.1 | Versioned rules + provenance | PARTIAL | `AuditLog`, `CourseProductVersion`, Barthel `sourceVersion`; review rule hard-coded | Catalog in code with a source comment only |
| R4.2 | Audit repo first, no destructive rebuild | DONE | This report; no migrations run | — |
| R4.3 | Minimum disclosure by role | DONE (basic) · BLOCKED (PDPA) | Before accepting: time, district, reason, fee only; address after assignment (`pt-visit.service.ts:293-340`) | Same |
| R4.4 | T01–T34 | PARTIAL | See section 4 | Walk-through script `clin.mjs` |
| R4.5 | Flags, sandbox, routine pilot, rollback | PARTIAL | Env flags exist (`PT_MONTHLY_SCHEDULE_ENABLED`, `PAYMENT_COLLECTION_MODE` …) | n/a |

## 3. The 26 cases: what each place would do today

"Gate" means where the request goes after screening. Real app: by `requiresClinicalReview()` (any answer that isn't "no" goes to review). Simulator: health answers plus group questions.
The real-app column is **worked out by reading the code, not run with test data**.

| Case | Spec (key points) | Real app gate | Real app PT eligibility | Simulator |
|---|---|---|---|---|
| MSK-01…06 | Routine; C17 optional | Routine → pay → match (if all answers are "no") | Licence + zone + slot only | Routine; group MSK; no PT block |
| ORTHO-01 TKA WBAT | ROUTINE_IF_CONDITIONS_MET; S01 | **Review** (surgery YES / implant) | No S01 check | Review (surgery YES); weight-bearing asked |
| ORTHO-02 ORIF NWB | Routine if conditions met; NWB never broken; C15 optional | **Review** | No NWB awareness | Review; "ห้ามลงน้ำหนัก" recorded; reviewer can write the limit |
| ORTHO-03 THA, ORTHO-04 fusion | S01; surgeon precautions | Review | — | Review; unknown WB → review reason |
| NEURO-01…04 | S03 by disease; NEURO-03 C14 Conditional, C08 Conditional (v2.4); NEURO-04 C08 Conditional | Routine if condition STABLE; review if WORSE/UNKNOWN | No S03 / disease check | Group NEURO asks the disease; chronic disease YES → review (**stricter than the real app**) |
| GERI-01…04 | S04 only on a real respiratory reason, not fatigue | "Tired" symptom → review; no S04 concept | — | Group GERI asks falls; no S04 trigger from fatigue |
| BED-01, BED-03 | Severe dependence; BED-03 needs a Stroke sub-skill | Depends on answers | No transfer/helper data | Group BED asks helpers |
| **BED-02** | Needs 2 helpers or a hoist, has 1 → hold unsafe transfer | Not detected (no helper question); review only if other flags | — | **DONE**: "ต้องย้ายตัว 2 คน… ที่บ้านมีคนช่วยไม่พอ" → review before payment; tested |
| BED-04 | S05 required, S06 not indicated; review before first match | Review only if devices/discharge flagged | — | Sputum "ไอออกเองไม่ค่อยได้" is recorded but **does not trigger review yet** (gap) |
| RESP-01, CARDIO-01, RESP-02 | S04 / S08 / S04+S05; RESP-02 C07 Conditional (v2.4) | Depends on answers (O2 device → review) | — | Group CARDIO; review only on suction or unknown |
| **RESP-03** trach + suction | Mandatory review, no auto-match, S06 restricted; C07 Not indicated (v2.4) | **Review** (device TRACHEOSTOMY); manual matching only | No S06 concept | **Review**; S06 locked in the reviewer's list; never matched |

## 4. Acceptance tests T01–T34 (real app)

| Result now | Tests |
|---|---|
| Behaviour already there; a test with this ID still needs writing | T11, T12, T24, T27 (no auto-match), T13, T14, T32 (30/90 is only a label for the admin), T18, T31, T21, T22, T25 |
| Partly | T19, T29 (licence checked; LINE and application not), T20 (draft/published exists behind a flag; that matching reads only published is unconfirmed), T28 |
| Needs the task registry first | T01, T02, T03, T05, T06, T08, T10, T15, T16, T17, T23, T33 |
| Needs activity-level approval | T26, T30 |
| Needs new questions | T04 (NWB), T09 (helpers/hoist) |
| At implementation time | T34 |
| Fatigue | T07: there is no S04 to trigger wrongly, but fatigue sends the case to review, which is more cautious than the spec |

## 5. Conflicts and differences to rule on

1. **Red-flag rule.** The older requirement said "ไม่เพิ่มหน้า red-flag ที่ทำให้แพลตฟอร์มตัดสินแทน PT". Boss adopted v2.4 on 2 Nov and logged it as replaced: the system holds the request and a person decides.
2. **The real app's review trigger is broader than the spec.** Every surgery or implant goes to review, so ORTHO-01 and ORTHO-02 never run as `ROUTINE_IF_CONDITIONS_MET`. A rule is needed: which answers keep post-op routine (e.g. weight-bearing known plus surgery more than N weeks ago)?
3. **Service list mismatch.** The real app's `ServiceReason` has 5 values with no Bedridden and no Cardiopulmonary group. The plan is to add the 6 services as new fields and keep the old enum.
4. **Terms timing.** The handover says terms come before profile/availability. Boss's flow has the PT accept the terms at the first job (still before they can accept, so T19 holds). Confirm this is acceptable.
5. **Mapping question.** Service 05 contains S04 but not S05, so BED-04 uses S05 across services. Please confirm this is intended.

## 6. Questions back to พี่ปาล์ม (please answer by ID)

| ID | Question | Why it matters |
|---|---|---|
| Q-A | Who is the Clinical Lead, and can they delegate? | R3.4 and the review screen name a person |
| Q-B | Which screening answers count as Routine for post-op (ORTHO-01/02)? | Today every post-op case waits for review before payment |
| Q-C | Should "มีเสมหะ ไอออกเองไม่ค่อยได้" (BED-04, RESP-02) trigger review before payment, or only flag S05? | Gap in the simulator |
| Q-D | What evidence is needed for each specialty task (S01–S05, S08), and does it expire? | R1.3 |
| Q-E | Is a "ขอคุยก่อน" answer from a PT treated as can't-do until the team talks to them? (The simulator treats it so.) | Matching gate |
| Q-F | Is accepting the terms at the first job acceptable, or must it come before the schedule? | R1.5 |
| Q-G | Is the Thai wording of the new group questions acceptable? (See the simulator, stage 5) | R2.1 copy |
| Q-H | S06: who checks the Thai scope with สภากายภาพบำบัด, and by when? | Stays locked until then |

## 7. Proposed next steps (no production change without sign-off)

- **P0, real app, no money or state-machine change:**
  - Add the missing offer gates behind a flag: application APPROVED, LINE bound, published schedule.
  - Write tests with the T-IDs for the behaviour that already exists.
- **P1, additive only:**
  - Versioned tables for the 6 services, the 24 tasks, the mapping and the 26 case rules, with the statuses `APPROVED_PRODUCT_DRAFT`, `CLINICAL_VALIDATED`, `REGULATORY_SCOPE_VALIDATED` and `LIVE_ENABLED`.
  - PT task declarations.
  - Activity-level review approval (new fields; `CLEARED` keeps its meaning).
  - S06 hard-locked.
- **P2, after Q-B, Q-C and Q-G:** the group questions in the real intake, and Barthel made selective.
- **Rollback:** every change is additive and behind a flag; turn the flag off and drop the new tables.

Files: gap report `docs/product/clinical-matching-v2.4-gap-report.md`, decision log `docs/product/decision-log/2026-11-02.md`, simulator walk-through `docs/design/rehearsal-simulator/clin.mjs`.
