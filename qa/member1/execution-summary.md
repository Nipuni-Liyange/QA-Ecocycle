# Execution Summary (Member 1)

| Field | Value |
|---|---|
| Baseline commit | `260b6a9` |
| Date(s) executed | 2026-11-23 to 2026-11-24 |
| OS / Node / browser | Windows / Node v24.14.1 / Chrome (DevTools device mode, 400 px and 941 px widths) |
| DB mode | local MongoDB |
| Tester | Tharani |

## Results
| Suite | Total | Pass | Fail | Blocked / not run |
|---|---|---|---|---|
| Manual cases (M1-F01…F20) | 20 | 20 | 0 | 0 |
| EP/BVA rows (sections 1–4) | 34 | 33 | 0 | 1 not run (D7) |
| Newman requests | 22 | 22 | 0 | 0 |
| Newman assertions | 41 | 41 | 0 | 0 |

Newman command: `cd qa/member1/postman && npm test`  → evidence: `evidence/newman-report.json`, `evidence/newman-console.txt` (run took 4.2 s).

## Defects
| ID | Title | Severity | Case | Status |
|---|---|---|---|---|
| – | No defects found in this run | – | – | – |

Observations from execution (all behave as the code intends; not defects):
- Wrong password of fewer than 8 characters on login returns 422 (validation first), not 401, so F02 used a password of 8+ characters.
- Stranger edit/delete returns 409 and read returns 404 (ownership is part of the query filter), not 403 (F18).
- Writes without a JSON body (e.g. DELETE with no body) are rejected; the UI works around it by sending `{}`.
- Only the first invalid field is reported when several are invalid (F13 returned "Check city." only).
- A stale CSRF token after the session changes returns 403 with a clear message.
- The browser's own form checks (min/max/type) block bad values before the server; the server-side 422 was proven by bypassing them (F03, F08).

## Verification vs validation
- Verification (built to the rules): Newman C1/C2 and F08 show quantity 0 and 1000 are rejected with 422 exactly as the validation rule (integer 1–999) specifies, and nothing is created.
- Validation (fit for the user): F04, F07 and F09 show a General User can create, edit and track a pickup, and a collector can accept it, with the accepted status and collector visible to the owner.

## Exit-criteria assessment
| Criterion | Met? | Evidence |
|---|---|---|
| All 20 manual cases executed | Yes | `manual-test-cases.csv`, `evidence/M1-TC*.png` |
| Newman assertions pass or have defect IDs | Yes (41/41 pass) | `evidence/newman-report.json` |
| Every Fail has reproduction steps | Yes (no failures) | – |

## Limitations / lessons learned
- 33 of the 34 EP/BVA rows were executed and passed. D7 (day change) is marked Not run: it can only be checked between 00:05 and 05:25 Asia/Colombo, when the Colombo and UTC dates differ; the check script ran outside that window and correctly reported it as not applicable.
- Decision-table rules R4 and R5 are Partial: the role and login checks were shown on create/read, not on collector or anonymous edit/delete.
- Run on one local environment and Chrome only; no performance, security or compatibility testing (other members' scope).
- The 4th-photo limit (F20) was proven through the API, not by blocking it in the UI.
- All roles share one browser cookie; use an Incognito window for the collector or stranger or the session is replaced (this caused false 401/403 results during F06 and F18 until fixed).
- Test data was cleaned up by deleting the pickups created for each case.
