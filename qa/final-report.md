# EcoCycle Software Testing and Quality Assurance – Consolidated Report

**Course:** EC4206 Software Testing and Quality Assurance  
**Project:** EcoCycle  
**Integrated branch:** `develop`  
**Integrated revision:** `a50a1bb59229efd398647a7a2a7bf654ca2fc70e`  
**Report prepared:** 2026-11-25

## Executive summary

The team's recorded QA contributions have been consolidated in this
report. One genuine profile-validation defect was found, fixed, and retested.
Its full lifecycle is recorded in the local defect register. The latest
integrated `develop` revision has a successful GitHub Actions run. Local backend
tests, frontend lint, and frontend production build also pass.

The SonarQube measurements are from the successful analysis of revision
`a63ed6f`, not a new scan of the current integrated revision. The local
SonarQube service was unavailable during consolidation, so those metrics are
reported with that baseline limitation.

## 3.1 Introduction and test planning

### Project scope and objectives

EcoCycle is a web application for e-waste collection and recycling coordination.
The QA scope includes registration and authentication, pickup-request creation
and lifecycle, ownership and role controls, input/photo validation, responsive
usability, backend performance observations, code-level quality, and automated
functional tests.

The test objective was to verify that the application enforces documented
validation and authorization rules and that users can complete the principal
pickup workflows successfully. Security, performance, and usability conclusions
are limited to the scenarios documented by each member; they are not a full
penetration, capacity, or accessibility certification.

### Quality attributes

| Attribute | Test evidence |
|---|---|
| Functional suitability | 20 manual functional cases, Newman API tests, Selenium and BDD workflows |
| Security | 18 runtime security checks, 3 source reviews, ownership/role/privacy checks |
| Reliability | Backend integration tests, persistent pickup lifecycle and stale-update checks |
| Usability/accessibility | Responsive emulation, keyboard and reduced-motion checks |
| Performance efficiency | JMeter health-endpoint scenarios at 1, 3, and 5 virtual users |
| Maintainability | SonarQube reliability/maintainability findings and code-quality recommendations |

### Verification versus validation

- **Verification:** checks that implementation matches specified rules, e.g.
  invalid quantities are rejected and a phone containing no digits returns a
  validation error.
- **Validation:** checks that the application supports the intended workflow,
  e.g. a user creates and tracks a pickup and a collector accepts it.

### Test plan

The test plan defines scope, roles, test approach, environment, synthetic data,
entry/exit criteria, risks, schedule, and requirement-to-test traceability. The
execution baseline is `260b6a9`. See [Member 1 test plan](member1/test-plan.md)
and [execution summary](member1/execution-summary.md).

## 3.2 STLC and test-case completeness

| STLC phase | Recorded activity/evidence |
|---|---|
| Requirement analysis | Testable behavior derived from README, application docs, validation, and routes |
| Test planning | Scope, roles, risks, environment, criteria, and schedule in the test plan |
| Test design | Manual cases, equivalence partitions/boundary values, decision tables, Newman collection, Selenium and BDD scenarios |
| Environment setup | Node/npm, local or approved test DB, browser and automation setup recorded in member plans |
| Test execution | Actual results, status, logs, screenshots, and test transcripts in member evidence |
| Test closure | Execution summaries, defect register/RCA, quality metrics, limitations, and this consolidated report |

The manual case CSV contains 20 cases and includes preconditions, steps, expected
and actual results, status, tester/date, and a feature field. The plan maps
requirement areas to manual case IDs and Newman groups. EP/BVA execution recorded
33 of 34 rows passing; D7 was not run because its date/time window was missed.
Some decision-table rules R4/R5 are partial; this limitation remains explicit.

### Test environment and configuration

| Test activity | Recorded environment |
|---|---|
| Member 1 functional/API | Windows, Node.js 24.14.1, Chrome, local MongoDB; client/API configured for ports 4000/5000 |
| Member 2 validation/TDD | Node.js 20.20.0 in the saved run; selected server tests, c8, SonarScanner 8.4.0.16527, SonarQube Community Build 26.11.0.134175 |
| Member 3 CI | Ubuntu 24.04, Node.js 24, headless Firefox/Geckodriver, isolated MongoDB Memory Server |
| Member 4 performance | Windows 11, Node.js 26.13.1, JMeter 5.6.3; local API on port 5002 configured to MongoDB Atlas (environment limitation) |
| Consolidation checks | Windows, Node.js 26.13.1; isolated backend test setup, client lint and production build |

## 3.3–3.7 Member results

### Member 1 – functional and black-box/API testing

- Manual functional cases: 20 passed, 0 failed.
- Newman: 22 requests passed; 41 assertions passed.
- EP/BVA: 33 passed, 0 failed, 1 not run.
- No confirmed defect in the executed member 1 cases.
- Evidence: [execution summary](member1/execution-summary.md),
  [case CSV](member1/manual-test-cases.csv),
  [EP/BVA and decision tables](member1/ep-bva-decision-tables.md).

### Member 2 – white-box, TDD, coverage, SonarQube

- Selected validation/TDD suite: 15 passed, 0 failed.
- `validation.js` coverage after TDD: statements/lines 91.66%, branches 77.27%,
  functions 90%.
- SonarQube findings and recommendations are summarized in Section 3.9.
- Evidence: [final handoff](member2/final-handoff.md),
  [TDD evidence](member2/tdd-evidence.md),
  [coverage summary](member2/coverage-summary.md).

### Member 3 – automation and CI

- Selenium UI: 4 passed, 0 failed.
- Cucumber BDD: 8 scenarios and 42 steps passed.
- Newman API tests passed in the integrated workflow.
- Passing pipeline screenshots: [workflow success](member3/evidence/M3-CI01-Workflow-Success.png)
  and [all steps passed](member3/evidence/M3-CI02-All-Steps-Passed.png). These
  saved screenshots are from the earlier successful run #3; run #5 on the
  integrated revision is verified through its Actions page and artifacts below.
- Evidence: [automation report](member3/automation/README.md) and
  [automation evidence](member3/evidence/README.md).

### Member 4 – performance, security, and usability

- Performance: no failures in the 1-, 3-, and 5-user `/api/health` scenarios.
  The archived 5-user run has 93 successful samples and 5 ms P95.
- Security: 18 runtime checks passed; 3 source-code reviews passed.
- Usability: 10 documented responsive/task/interaction checks passed.
- Performance used a local API configured with MongoDB Atlas; it does not measure
  database query performance or whole-application capacity.
- Evidence: [performance](member4/performance/performance-analysis.md),
  [security](member4/security/security-test-report.md),
  [usability](member4/usability/usability-report.md).

## 3.8 Defect tracking and root-cause analysis

### Confirmed defect

**DEF-001:** Profile validation previously accepted a supplied phone value made
only of hyphens. The failing input was
`profileInput({ name: 'Test User', phone: '-------', district: '' })`.
Expected behavior was HTTP 422 with a `phone` field error.

The defect was fixed by requiring at least one digit in a non-empty phone value.
The fix preserves acceptance of valid formatted phones and empty/omitted
optional values. The test evidence is Red commit `5451ba7`, fix commit `ee1fa6c`,
and refactor commit `9a48832`. The current local verification passed all 3
profile TDD cases and all 43 backend tests.

The Root Cause Analysis attributes the defect to validation that checked allowed
characters and length but omitted the semantic digit requirement. The regression
test now covers punctuation-only input. See [defect register](member4/defect-tracking/defect-register.md)
and [RCA](member4/defect-tracking/root-cause-analysis.md).

### Lifecycle and tracking system

The repository currently has no GitHub Issues. To avoid claiming a nonexistent
GitHub issue, the lifecycle is recorded in the local QA defect register:
**New → Assigned → Fixed → Verified → Closed**. The assigned owner is recorded
retrospectively from the author of the fix commits. No commits or pushes were
made to GitHub while preparing this report.

The reviewed member evidence records one unique confirmed defect. The defect
register should be revised if further genuine team findings are supplied.

## 3.9 Quality metrics and SonarQube

The successful SonarQube scan analyzed revision `a63ed6f` with source scope
`client/src` and `server/src`. These are the recorded results:

| Metric | Result |
|---|---:|
| SonarQube overall coverage | 16.9% |
| c8 coverage, `validation.js` only | 91.66% lines/statements, 77.27% branches, 90% functions |
| Reliability | 9 open findings, rating C |
| Maintainability | 3 open findings, rating A |
| Detected security findings | 0, rating A |
| Duplication | 0.0% |
| Technical debt | 12 minutes |
| Analyzed code size | 2,410 LOC = 2.410 KLOC |
| Confirmed defect density | 1 / 2.410 = 0.415 defects per KLOC (based on reviewed defect log) |

The three maintainability findings also affect reliability, so category counts
overlap. The 9 static-analysis findings are not counted as confirmed functional
defects. The c8 percentage applies only to `validation.js`; it is not overall
application coverage.

The recorded analysis evidence is available in
[SonarQube analysis](member2/sonarqube-analysis.md) and
[scan log](member2/evidence/sonarqube-scan.txt). The scanner log reports a
successful upload for `a63ed6f`. The current machine's local SonarQube service
was not running during consolidation; these numbers are therefore historical
baseline metrics, not a scan of the integrated `develop` revision.

### Recommended improvements

1. Replace or correctly implement non-native interactive controls in
   `Navbar.jsx` and `DashboardLayout.jsx`; verify focus, keyboard activation, and
   semantics.
2. Replace the flagged `NaN` reference in `pickupRoutes.js` with `Number.NaN`
   after confirming surrounding behavior; retest valid/invalid inputs.
3. Increase automated coverage beyond validation helpers, prioritizing
   authentication and pickup flows; compare coverage using a consistent scope.

These are recommendations, not claimed completed changes.

## 3.10 Agile and DevOps reflection

The team divided QA work into functional/API, white-box/quality, automation/CI,
and non-functional testing contributions. Members worked in separate QA
branches and integrated their work through the `develop` branch, visible in the
merge commits. Small Red/Green/Refactor commits provide traceability from a
failing test to the fix and regression result. Automated unit, integration, UI,
BDD, and API tests provide repeatable feedback. The GitHub Actions workflow runs
backend tests, frontend lint/build, Selenium, Cucumber, and Newman on `develop`
pushes and pull requests targeting `develop`.

The repository's current pull-request listing returned no PRs targeting
`develop`, so the available evidence does not establish that the integrations
used pull requests or that formal code reviews occurred. This is an evidence
gap, not a claim that no reviews took place. Preserve PR/review records for
future integration.

The process improvement is to keep one shared defect register, review the
assigned owner and issue lifecycle at team level, and rerun SonarQube on the
final integrated revision. See the [Member 2 reflection and handoff](member2/final-handoff.md).

## Final integration verification

The local `develop` HEAD is
`a50a1bb59229efd398647a7a2a7bf654ca2fc70e`. GitHub Actions run [#5](https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45433160572)
ran on that exact SHA on 2026-11-24 and completed successfully. Every workflow
step passed, including backend tests, frontend lint/build, Selenium UI,
Cucumber BDD, Newman API tests, and evidence uploads. The uploaded CI artifacts
include pipeline logs and generated screenshots.

Local checks run during consolidation on Windows with Node.js 26.13.1:

| Check | Result |
|---|---|
| `npm test` in `server` | 43 passed, 0 failed |
| `npm run lint` in `client` | Passed |
| `npm run build` in `client` | Passed |
| GitHub Actions on integrated `develop` SHA | Success; all steps passed |

Screenshots of a successful earlier workflow are saved under
`member3/evidence/`; they are from run #3, not run #5. The current integrated
run #5 was verified through GitHub Actions and its uploaded artifacts. No new
run was triggered and no GitHub commit/push was made for this consolidation.
The run #5 summary screenshot was also captured during this verification and is
attached with the report handoff.
