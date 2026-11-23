# EcoCycle — Test Plan and STLC Map (Member 1: Functional, Black-Box and API)

| Item | Value |
|---|---|
| Course | EC4206 Software Testing & Quality Assurance, University of Ruhuna |
| Author | Member 1 — branch `qa/functional-api` |
| Application | EcoCycle (React/Vite client `127.0.0.1:4000`, Express API `127.0.0.1:5000`, MongoDB/Mongoose) |
| Baseline commit | `<git rev-parse --short HEAD>` ← fill in |
| Plan date / version | 2026-11-23 / v1.0 |

## 1. Objective
Show, with executable evidence, that EcoCycle's account and pickup-request features behave as specified: accept valid input, reject invalid input with the right status code and message, enforce ownership/role rules, and keep data consistent after create/update/delete.

## 2. Scope
**In scope** — registration, login, logout; pickup create / read / update / delete; collector acceptance (as a permission and state-change check); search, status/district filters and pagination; field validation (quantity, itemName, category, email, password, date, photo count); CSRF and role enforcement on the API.

**Out of scope (not built or owned by others)** — real recycling verification, password reset, email alerts, load/performance (Member 3), coverage/unit-test work and security tooling (Members 2 and 4), visual/cross-browser/accessibility audits.

## 3. Roles and ownership
EcoCycle has exactly two roles: **General User** (`user`) creates and manages own pickups; **Recycling Collector** (`collector`) accepts, schedules and advances pickups. There is no admin.

## 4. Test approach
| Level / technique | What | Deliverable |
|---|---|---|
| Manual functional (black-box) | 20 cases through the browser UI, DevTools/Postman for status codes | `manual-test-cases.csv` |
| Equivalence partitioning / BVA | quantity, itemName, password, preferredDate | `ep-bva-decision-tables.md` |
| Decision table | owner/stranger/collector × pending/accepted | `ep-bva-decision-tables.md` |
| API automation | 6 Newman check groups (22 requests, 41 assertions) | `postman/EcoCycle-Functional.postman_collection.json` |

### ISO/IEC 25010 attributes covered
| Attribute | How it is tested here |
|---|---|
| Functional suitability | CRUD and lifecycle cases; correct status/state after each action |
| Security | CSRF header required, role checks, ownership checks, no password data in responses |
| Reliability | Repeatable runs with unique data; stale-version edit rejected (no lost update) |
| Usability | Error messages shown for invalid input (UI cases) |

### Verification vs validation examples
- **Verification** ("built the product right"): quantity 1000 returns 422 exactly as `validation.js` specifies; PATCH increments `__v`.
- **Validation** ("built the right product"): a real user can register, request a pickup, edit it while pending, and cannot edit it once a collector has accepted — matching the stated recycling workflow.

## 5. Test environment and data
- Node 20.19+, npm, Chrome/Edge, MongoDB Community (`npm run dev:local`, port 27018) or an approved separate test Atlas DB. **Never** run against a shared/live database without approval.
- Record: commit hash, Node version, OS, browser version, DB mode.
- Test data is synthetic: `m1.qa.<runId>@example.test` accounts, "QA test …" item names. Own data is cleaned up after destructive tests.
- Backend must allow the calling origin (`CLIENT_ORIGIN` in `server/.env`). Postman/Newman send no `Origin` header, so they work with the defaults.

## 6. Entry and exit criteria
**Entry:** baseline commit agreed; `npm ci` succeeded in `server` and `client`; backend reachable at `/api/health` returning `database: connected`; test accounts available.
**Exit:** all 20 manual cases executed with Pass/Fail/Blocked recorded and evidence saved; all Newman assertions pass or each failure has a defect ID; every Fail has reproduction steps; execution summary written.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| MongoDB not installed → backend will not start | Install MongoDB Community or use test Atlas; record Blocked, never fake a Pass |
| Rate limits (auth: 30 per 15 min, API: 240 per min) during repeated runs | Use unique data; wait or restart backend between heavy runs |
| Date-based tests depend on the server clock/timezone (Asia/Colombo) | Compute dates at run time (the collection does) |
| Shared Atlas data pollution | Use local mode; unique emails |

## 8. Schedule (≈ 23 h, adjust after logging real time)
| Session | Hours | Output |
|---|---|---|
| 1 Baseline | 4 | environment set up, this plan |
| 2 Test design | 5 | CSV cases, EP/BVA, decision table |
| 3 Functional execution | 5 | actual results, screenshots, defects |
| 4 API automation | 6 | Newman collection + run log |
| 5 Closure | 3 | execution summary, PR, viva rehearsal |

## 9. STLC map
| STLC phase | Activity in this project | Artifact |
|---|---|---|
| Requirement analysis | Read README, `docs/application.md`, `validation.js`, routes; list testable rules | Section 2 scope; rule list in EP/BVA doc |
| Test planning | Scope, risks, environment, criteria, schedule | this file |
| Test design | Cases, EP/BVA, decision table, Newman design | CSV, EP/BVA doc, collection |
| Environment setup | Clone, `npm ci`, local MongoDB, start servers | README run steps; baseline record |
| Test execution | Run manual cases and Newman; capture evidence; log defects | evidence/, CSV actual/status |
| Test closure | Counts, defects, exit-criteria check, lessons | `execution-summary.md` |

## 9a. Deliverable traceability
| Requirement area | Manual cases | Newman |
|---|---|---|
| Registration / login / logout | F01, F02, F12, F15, F16 | A1–A3, F3–F5, F7 |
| Pickup create / validation | F03, F08–F11, F13, F14, F20 | B1, C1–C3 |
| Pickup update / delete | F04, F05, F06 | D1–D3, E1–E3 |
| Authorization | F07, F17, F18 | F1, F2, F4, F6 |
| Search / filter / pagination | F19 | B2 (list) |
