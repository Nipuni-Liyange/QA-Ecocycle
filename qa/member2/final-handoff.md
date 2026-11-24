# White-box and quality: final handoff

## Recorded work

Branch: `qa/whitebox-quality`. Latest confirmed pushed evidence commit before this
handoff: `8e36e0d`. The SonarQube source baseline is `a63ed6f`; later evidence-only
commits do not mean that those commits were separately scanned.

| Deliverable | Recorded evidence |
|---|---|
| Two white-box functions | text(), complexity 4; dateOnly(), complexity 6 |
| New white-box tests | 10 tests in server/test/qa-validation.test.js |
| TDD tests | 3 tests in server/test/qa-profile-tdd.test.js |
| Selected validation run | 15 passed, 0 failed |
| TDD Red | 5451ba7; failing test before the production fix |
| TDD Green | ee1fa6c; require a digit in a provided phone |
| TDD Refactor | 9a48832; named format/digit checks, tests remain green |
| SonarQube scan | Successful submission and scanner exit 0 |
| Recommendations | Three documented proposals, not recorded as implemented |

## Measured quality metrics

| Metric | Scope | Result |
|---|---|---|
| Statements / lines | c8, validation.js only | 91.66% |
| Branches | c8, validation.js only | 77.27% |
| Functions | c8, validation.js only | 90% |
| Overall coverage | SonarQube, client/src and server/src | 16.9% |
| Reliability | SonarQube, overall | 9 open findings; C |
| Maintainability | SonarQube, overall | 3 open findings; A |
| Detected security findings | SonarQube, overall | 0; A |
| Duplication | SonarQube reported measure | 0.0% |
| Technical debt | SonarQube maintainability estimate | 12 minutes |
| Client code size | Analyzed code | 1,819 LOC |
| Server code size | Analyzed code | 591 LOC |
| Total code size | JavaScript and CSS | 2,410 LOC = 2.410 KLOC |

The c8 and SonarQube coverage percentages have different scopes and counting
methods. Each of the 3 observed maintainability findings also has a reliability
impact. Category counts therefore cannot be added to obtain a unique issue total.

For a separately defined static-analysis measure, the reported project reliability
finding density is `9 / 2.410 = 3.73 reliability findings per KLOC`.
This does not establish confirmed functional-defect density.

Confirmed defect density uses `D / 2.410 defects per KLOC`, where D is the team's
deduplicated confirmed defect count for the agreed QA period and source scope,
including fixed defects found in that period. The team count is still pending.
The defect-tracking coordinator should supply D, its issue IDs, and the reporting
period before that metric is finalized. Do not substitute the 9 unreviewed
static-analysis findings for a confirmed defect-log count.

## Historical phone-validation finding for the defect log

- Title: Profile validation accepts a provided phone containing no digits.
- Status in this contribution: fixed and verified by the selected TDD suite;
  GitHub issue ID / lifecycle record still needs confirmation with the coordinator.
- TDD rule adopted for this work: a provided optional phone must contain a digit
  as well as satisfying the existing permitted-character/length checks.
- Original reproduction, from server: call
  `profileInput({ name: 'Test User', phone: '-------', district: '' })`.
- Original actual result: returned the object, including the punctuation-only phone.
- Expected under the TDD rule: throw HttpError with status 422 and a phone field error.
- Red evidence: `evidence/tdd-red.txt`, commit `5451ba7`, missing expected exception.
- Green evidence: `evidence/tdd-green.txt`, commit `ee1fa6c`.
- Refactor evidence: `evidence/tdd-refactor.txt`, commit `9a48832`.
- Verified retained behavior: formatted valid phone accepted; optional empty/omitted
  phone accepted. This change does not establish a complete national phone-number policy.

Suggested root cause: the original allowed-character expression admitted hyphens
and other formatting characters without requiring any digit. The fix adds a digit
predicate, then the refactor names the two checks to make the intent easier to read.
Have the coordinator reuse an existing issue if this defect is already logged.

## Three improvement proposals

1. Review the non-native interactive elements flagged at Navbar.jsx:20 and
   DashboardLayout.jsx:26. Use native controls appropriate to the action and
   provide accessible names, keyboard activation, and visible focus. Verify with
   Tab and keyboard activation as well as mouse operation. Estimate: 5 + 5 minutes.
2. Review the flagged global NaN reference in pickupRoutes.js:150 and use
   Number.NaN for consistency. The two constants represent the same numeric value;
   this proposal is not itself evidence of a corrected numeric-validation bug.
   Verify valid and invalid input behavior and repeat static analysis. Estimate: 2 minutes.
3. Add meaningful tests beyond the validation module, prioritizing authentication
   and pickup handling, and compare coverage using the same scope. This follows
   from the 16.9% overall coverage and is a future improvement, not an executed result.

## Agile / DevOps reflection

Working on a separate branch allowed me to add tests and evidence while other
members worked on their assigned areas. Small commits made it possible to trace
the failing test, minimal correction, and refactoring separately. The passing
validation tests provided fast feedback, while the coverage report showed which
paths still lacked evidence. The SonarQube findings added another view of quality,
especially accessibility, consistency, and the limited coverage of the wider app.

The main improvement to our process is to keep one agreed defect log, link each
confirmed defect to its test and fix, and review contributions through pull
requests. The shared pipeline should run the agreed checks before integration.
This contribution has local selected-test and scan evidence; it does not claim
that shared CI or all application testing has already passed.

## Remaining shared handoff items

- Defect coordinator: confirm the unique defect count, issue IDs, period, and scope.
- Reviewer: review the pull request and the shared CI result before integration.
- Report coordinator: combine these results with the other members' testing work.
- Full database-backed integration, frontend lint/build, and shared CI do not have
  a verified successful result in this handoff. Earlier setup encountered an
  interrupted MongoDB binary download; preserve that distinction in the group report.

## Short viva demonstration

1. Show text() and one rejected versus accepted path in the control-flow graph.
2. Show the assertion in qa-validation.test.js and the saved 15-pass transcript,
   or run the selected tests using README.md.
3. Show commits 5451ba7, ee1fa6c, and 9a48832 alongside the Red/Green/Refactor logs.
4. Explain why 91.66% module line coverage and 16.9% overall SonarQube coverage
   measure different scopes. Show the actual issue and technical-debt screenshots.

## Evidence index

- [White-box analysis](whitebox-analysis.md)
- [Control-flow graphs](control-flow-graphs.md)
- [Coverage summary](coverage-summary.md)
- [TDD evidence](tdd-evidence.md)
- [SonarQube analysis](sonarqube-analysis.md)
- [Selected test run](evidence/sonarqube-test-run.txt)
- [Scanner log](evidence/sonarqube-scan.txt)
- [Analyzed revision](evidence/sonarqube-code-version.txt)
- [Overall dashboard](evidence/sonarqube-overview.png)
- [Maintainability findings](evidence/sonarqube-maintainability-issues.png)
- [Maintainability measures](evidence/sonarqube-maintainability-measures.png)
- [Code size](evidence/sonarqube-code-size.png)
