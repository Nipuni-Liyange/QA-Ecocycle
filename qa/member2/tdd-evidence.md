# Member 2 — Phone Validation TDD

## Proposed validation rule
The phone number is optional. When provided, it must contain
at least one digit and satisfy the existing character and length limits.

## Red stage
- Function: profileInput() in server/src/validation.js
- Input: phone = "-------"
- Expected: HttpError with status 422 and a phone field error.
- Actual: the function accepts the value.
- Automated result: 3 tests, 2 passed, 1 failed.
- Failure: Missing expected exception.
- Evidence: evidence/tdd-red.txt

## Root cause
The existing regular expression permits digits, spaces, parentheses,
plus signs and hyphens, but does not require a digit.

## Green stage
- Added a digit requirement for provided phone numbers.
- Valid formatted numbers remain accepted.
- Empty and omitted optional phone numbers remain accepted.
- Regression result: 15 tests, 15 passed, 0 failed.
- Evidence: evidence/tdd-green.txt

## Refactor stage
Pending.