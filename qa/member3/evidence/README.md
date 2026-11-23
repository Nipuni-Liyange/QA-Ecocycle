
# Member 3 – QA Test Evidence

## Execution Summary

Verification date: 23 November 2026

| Test Type | Result |
|---|---|
| Selenium UI automation | 4/4 PASS |
| Cucumber BDD | 8/8 PASS |
| Cucumber steps | 42/42 PASS |
| GitHub Actions CI | SUCCESS |
| Backend tests | PASS |
| Frontend lint | PASS |
| Frontend build | PASS |

## Selenium Evidence

Files:
- M3-UI01-output.txt through M3-UI04-output.txt

The UI suite produces result logs.
Failure screenshots are generated when applicable.

Successful Selenium execution is also recorded
in the GitHub Actions CI logs.

## BDD Evidence

Files:
- M3-BDD01-output.txt through M3-BDD08-output.txt

Screenshots:
- artifacts/M3-BDD01-PASS.png
  through artifacts/M3-BDD08-PASS.png

All eight scenarios passed successfully.

## GitHub Actions Evidence

Screenshots:
- M3-CI01-Workflow-Success.png
- M3-CI02-All-Steps-Passed.png

Verified successful workflow:
https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45181306599

Commit: e234a41
Branch: qa/automation-cicd
Run number: 3
Status: SUCCESS

## Downloadable CI Artifact

Artifact name:
ecocycle-member3-ci-evidence

Contains:
- Selenium CI execution log
- Cucumber BDD CI execution log
- Generated BDD screenshot evidence

The downloaded ZIP is kept separately as a
submission backup and is not committed to Git.

## Evidence Safety

- Do not commit passwords or database credentials.
- Do not commit environment files containing secrets.
- Review logs and screenshots before sharing.
- Preserve genuine test results.
- Keep diagnostic raw logs and old runs separate
  from the final submitted evidence.
