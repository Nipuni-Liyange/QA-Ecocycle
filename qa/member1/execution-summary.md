# Execution Summary (Member 1) — TEMPLATE: fill from your own runs

| Field | Value |
|---|---|
| Baseline commit | `<git rev-parse --short HEAD>` |
| Date(s) executed | |
| OS / Node / browser | |
| DB mode | local MongoDB (27018) / test Atlas |
| Tester | |

## Results
| Suite | Total | Pass | Fail | Blocked |
|---|---|---|---|---|
| Manual cases (M1-F01…F20) | 20 | | | |
| EP/BVA rows (sections 1–4) | 34 | | | |
| Newman requests | 22 | | | |
| Newman assertions | 41 | | | |

Newman command: `cd qa/member1/postman && npm test`  → evidence: `evidence/newman-report.json`, `evidence/newman-console.txt`

## Defects
| ID | Title | Severity | Case | Status |
|---|---|---|---|---|
| | | | | |

Observations worth checking during execution (not yet confirmed):
- Wrong password of <8 chars on login returns 422 (validation first), not 401.
- Stranger edit/delete returns 409, read returns 404 (ownership in query filter).
- Writes without a JSON body (e.g. DELETE with no body) are rejected; the UI works around it by sending `{}`.

## Verification vs validation
- Verification: <example from your run>
- Validation: <example from your run>

## Exit-criteria assessment
| Criterion | Met? | Evidence |
|---|---|---|
| All 20 manual cases executed | | |
| Newman assertions pass or have defect IDs | | |
| Every Fail has reproduction steps | | |

## Limitations / lessons learned
