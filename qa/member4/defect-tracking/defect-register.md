# EcoCycle – Defect Register

**Module:** Software Testing and Quality Assurance  
**Date:** 2026-11-23

## 1. Purpose

The defect register records software defects identified during testing, including their severity, priority, status, reproduction steps, and resolution details.

## 2. Defect Summary

| Category | Count |
|---|---:|
| Critical defects | 0 |
| High-severity defects | 0 |
| Medium-severity defects | 0 |
| Low-severity defects | 0 |
| Confirmed in documented test scope | 0 |

## 3. Identified Defects

No confirmed defects were identified during the documented performance, security, and responsive usability tests. This is limited to the recorded test scope; it does not confirm that teammates found no defects elsewhere in the project.

## 4. Observations Requiring Further Investigation

The browser console displayed HTTP 401 Unauthorized responses on the login page during testing.

These responses were not confirmed as application defects because unauthenticated requests may be expected in this context. Further investigation would be required before classifying them as defects.

## 5. Team Confirmation and Lifecycle Status

The shared team issue register and teammate findings have not been independently confirmed in this document. The team-wide defect count and any issue lifecycle remain pending that confirmation.

| Lifecycle evidence required by the working plan | Current status |
|---|---|
| Genuine defect with reproducible failure | None confirmed in the recorded test scope |
| New → Assigned → Fixed → Verified → Closed example | Not available; requirement unmet |
| Linked issue, fix/PR and verified retest | Not available |

Do not invent a defect or claim a completed lifecycle. If the team confirms a genuine issue, add its issue ID, reproduction evidence, owner, fix reference, and retest result here.

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

Based on the completed tests, no confirmed defects were recorded in the documented testing scope. The assignment's real-defect lifecycle target is unmet, and team-wide confirmation remains outstanding. Any genuine defects later confirmed by the team should be tracked through verified closure.
