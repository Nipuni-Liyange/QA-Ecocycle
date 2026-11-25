# EcoCycle – Defect Register

**Module:** Software Testing and Quality Assurance  
**Date:** 2026-11-25

## 1. Purpose

The defect register records software defects identified during testing, including their severity, priority, status, reproduction steps, and resolution details.

## 2. Defect Summary

| Category | Count |
|---|---:|
| Critical defects | 0 |
| High-severity defects | 0 |
| Medium-severity defects | 0 |
| Low-severity defects | 1 |
| Confirmed defects across reviewed team evidence | 1 |
| Confirmed in member 4 test scope | 0 |

## 3. Identified Defects

### DEF-001 – Profile validation accepts a phone containing no digits

| Field | Evidence |
|---|---|
| Title | Profile validation accepted a provided phone containing no digits |
| Test scope | Member 2 profile-validation TDD |
| Reproduction | Call `profileInput({ name: 'Test User', phone: '-------', district: '' })` |
| Expected | HTTP 422; `phone` field error; no profile value returned |
| Actual before fix | Punctuation-only phone was accepted and returned by `profileInput()` |
| Severity | Low (QA assessment; optional profile field) |
| Priority | Low (QA assessment) |
| Status | Closed in the local QA defect register after successful retest |
| Red evidence | Commit `5451ba7`; `qa/member2/evidence/tdd-red.txt` |
| Fix evidence | Commit `ee1fa6c`; `server/src/validation.js` |
| Retest evidence | Commit `9a48832`; `qa/member2/evidence/tdd-refactor.txt` |
| Automated verification | 3 profile TDD tests passed, 0 failed; 15-test selected regression suite passed, 0 failed |
| Tracker | This defect register (local QA tracker); no GitHub issue exists |

This defect is genuine and reproducible from the recorded TDD evidence. It is in addition to the zero confirmed defects found in the member 4 performance, security, and usability scope.

## 4. Observations Requiring Further Investigation

The browser console displayed HTTP 401 Unauthorized responses on the login page during testing.

These responses were not confirmed as application defects because unauthenticated requests may be expected in this context. Further investigation would be required before classifying them as defects.

## 5. Team Confirmation and Lifecycle Status

The reviewed artifacts from all four members contain one confirmed defect: DEF-001. Member 1 and member 4 recorded no defects in their executed scope; member 3's automated suites passed. No GitHub issues currently exist for the repository, so the lifecycle below is recorded in this local QA defect register as the permitted alternative tracker.

| Lifecycle evidence required by the working plan | Current status |
|---|---|
| Genuine defect with reproducible failure | DEF-001; reproducible from the recorded red test |
| New → Assigned → Fixed → Verified → Closed example | Complete in this local register; see dated transitions below |
| Linked fix and verified retest | Red test, fix/refactor commits, and passing retest are linked above |

| Local tracker transition | Date / evidence |
|---|---|
| New | 2026-11-22; failing test added in `5451ba7` |
| Assigned | 2026-11-22; assigned retrospectively to Nipuni-Liyanage, the author of the fix commits |
| Fixed | 2026-11-22 19:00:09 +05:30; fix in `ee1fa6c` |
| Verified | 2026-11-25; 3 profile TDD tests and 43 backend tests passed |
| Closed | 2026-11-25; closed in this local tracker after verification |

This is a local QA-register lifecycle, not a GitHub Issue lifecycle. No commits or pushes were made to GitHub for this report.

## 6. Defect Tracking Process

If a defect is identified in future testing, record:

- Defect ID
- Defect title and description
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Priority
- Evidence
- Status
- Resolution

## 7. Conclusion

Member 4 found no confirmed defects in its recorded performance, security, and usability scope. The reviewed team evidence identifies DEF-001 as a genuine fixed and retested profile-validation defect. Its New → Assigned → Fixed → Verified → Closed lifecycle is complete in this local QA register; no GitHub Issue was created.
