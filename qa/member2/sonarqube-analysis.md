# SonarQube Findings and Improvement Proposals

## Analysis baseline

- Analyzed commit: a63ed6f
- Source scope: client/src and server/src
- Overall coverage: 16.9%
- Reliability: 9 open issues, rating C
- Maintainability: 3 open issues, rating A
- Security: 0 detected issues, rating A
- Duplication: 0.0%
- Estimated effort for the three maintainability findings: 12 minutes

MQR issue counts overlap. Each of the three maintainability findings
also affects reliability.

## Maintainability findings

| Location | Finding | Estimated effort |
|---|---|---|
| client/src/components/Navbar.jsx:20 | Non-native interactive element | 5 minutes |
| client/src/layouts/DashboardLayout.jsx:26 | Non-native interactive element | 5 minutes |
| server/src/routes/pickupRoutes.js:150 | Prefer Number.NaN over NaN | 2 minutes |

## Proposed improvements

### 1. Improve keyboard accessibility

Review the flagged elements in Navbar.jsx and DashboardLayout.jsx.
Use native buttons for actions or links for navigation where appropriate.
If a non-native element is necessary, provide suitable semantics,
keyboard operation, and focus support.

Verification planned: check Tab navigation, keyboard activation,
visible focus, and existing mouse behavior.

### 2. Improve numeric constant consistency

Replace the flagged global NaN reference with Number.NaN in
pickupRoutes.js after inspecting the surrounding code.

This is a consistency improvement; the two constants represent
the same numeric value.

Verification planned: check valid and invalid numeric inputs,
then repeat the SonarQube scan.

### 3. Extend automated test coverage

Add tests for uncovered validation functions and important application
flows beyond validation.js, prioritizing authentication and pickup handling.

Verification planned: run the added tests, regenerate coverage,
and compare results using the same analysis scope.

## Coverage interpretation

The c8 statement and line coverage of 91.66% applies only to validation.js.
SonarQube overall coverage of 16.9% applies to the broader analyzed source
and combines line and condition coverage.

## Evidence

- evidence/sonarqube-overview.png
- evidence/sonarqube-maintainability-issues.png
- evidence/sonarqube-scan.txt

## Status

The improvements above are proposals. Their implementation and
verification have not yet been recorded.

## Confirmed code size and technical debt

| Metric | Value |
|---|---:|
| Client lines of code | 1,819 |
| Server lines of code | 591 |
| Total lines of code | 2,410 |
| Total KLOC | 2.410 |
| Technical debt | 12 minutes |
| Maintainability rating | A |

The code-size denominator includes the analyzed JavaScript and CSS.

## Defect density

The reviewed member evidence records one unique confirmed defect (DEF-001).
Using the analyzed source size of 2.410 KLOC, the provisional confirmed-defect
density is `1 / 2.410 = 0.415 defects per KLOC`. Revisit the numerator if further
genuine team defects are confirmed. The 9 SonarQube reliability findings are
static-analysis findings and are not included in this defect count.

## Additional evidence

- evidence/sonarqube-maintainability-measures.png
- evidence/sonarqube-code-size.png
