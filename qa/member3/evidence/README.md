
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

These saved screenshots document run #3 on the automation branch. The latest
run on that branch is [#4](https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45191371663),
which succeeded on `qa/automation-cicd` head
`3ac773ad9a6c5db46c832becc15c2bc46468dfc3`. That head was integrated by merge
commit `af772857`. The latest integrated `develop` run is #5:

https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45181306599

Commit: e234a41
Branch: qa/automation-cicd
Run number: 3
Status: SUCCESS

Latest integrated run: [#5](https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45433160572)
on `develop`, commit `a50a1bb59229efd398647a7a2a7bf654ca2fc70e`, status SUCCESS.
Its logs and generated test screenshots are available in the Actions artifacts.

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
