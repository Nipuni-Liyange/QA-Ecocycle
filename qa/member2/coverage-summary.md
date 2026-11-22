# Validation Coverage Summary

- Date: 2026-11-22
- Tool: c8
- Source file: server/src/validation.js
- Test files:
  - server/test/validation.test.js
  - server/test/qa-validation.test.js

## Measured coverage

| Metric | Coverage | Covered / total |
|---|---:|---:|
| Statements | 80.23% | 69/86 |
| Branches | 73.52% | 25/34 |
| Functions | 70% | 7/10 |
| Lines | 80.23% | 69/86 |

## Interpretation

The report identifies 17 uncovered statement entries,
9 uncovered branch outcomes and 3 unexecuted functions.

These percentages describe validation.js only.
They do not represent whole-application coverage.

The highlighted source report must be inspected to identify
the remaining uncovered areas and verify the selected functions.

## Evidence

- evidence/member2-coverage.txt
- evidence/validation-coverage-summary.png

## Source coverage observations

The text() function exercised its rejection and successful-return
paths. The report shows 10 executions of its validation error
and 5 executions of its successful return.

The dateOnly() function exercised invalid-date rejection,
past-date rejection and successful returns. Its successful
return executed 3 times.

The new tests map to the selected control-flow paths:

- M2-T01 to M2-T04 cover text().
- M2-T05 to M2-T10 cover dateOnly().

Uncovered areas remain in other functions, including email()
and choice(), and in portions of imageData() and pickupInput().

The measured file-level coverage remains:
- Statements: 80.23%
- Branches: 73.52%
- Functions: 70%
- Lines: 80.23%