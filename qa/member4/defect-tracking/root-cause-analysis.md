# EcoCycle – Root Cause Analysis Report

**Module:** Software Testing and Quality Assurance  
**Date:** 2026-11-25

## 1. Introduction

Root Cause Analysis (RCA) is used to identify the underlying reasons for software defects. It helps the development team understand why a problem occurred and prevent similar problems in the future.

## 2. Analysis of Testing Results

Performance, security, and responsive usability testing were completed.

Based on the recorded test results:

- Performance testing: No failed requests were observed in the recorded load tests.
- Security testing: The tested security validation checks passed.
- Usability testing: The tested mobile, tablet, and desktop layouts worked as expected.
- Defect tracking: One genuine fixed profile-validation defect was identified in member 2 evidence; no confirmed defects were found in member 4's performance, security, or usability scope.

The member 2 evidence is sufficient for a scoped RCA of DEF-001. It includes a failing test before the fix, a fix commit, and a passing regression suite.

## 3. Unconfirmed Observation Requiring Further Investigation

**Observation:** HTTP 401 Unauthorized responses appeared in the browser console during login-page testing.

**Possible explanation:** A request to a protected endpoint without a valid session may correctly return 401.

**Investigation status:** Not confirmed as a defect. There is no verified reproduction showing incorrect behavior, linked issue, or fix to analyze.

**Conclusion:** Do not assign a root cause or recommend a code change unless further investigation confirms a defect.

## RCA for DEF-001 – Punctuation-only profile phone

**Problem:** `profileInput({ name: 'Test User', phone: '-------', district: '' })` was accepted instead of returning a validation error.

**Fix:** The fix adds `/\d/.test(result.phone)` alongside the existing character/length-format check. Provided phones must now contain at least one digit.

**Evidence:**

- Red: commit `5451ba7`, missing expected exception.
- Green: commit `ee1fa6c`, digit requirement added.
- Refactor: commit `9a48832`, format and digit checks retained with named logic.
- Retest: 3 profile TDD tests passed, 0 failed; 15-test selected regression suite passed, 0 failed.

**Five Whys:**

1. Why was the punctuation-only phone accepted? The old format expression allowed hyphens.
2. Why did the expression allow only hyphens? It checked allowed characters and length but did not require a numeric digit.
3. Why did that validation permit this invalid value? The validation rule only encoded permitted characters, not the semantic requirement that a phone contain digits.
4. Why was this semantic requirement missing? The original implementation and tests did not cover punctuation-only input.
5. Why did this escape to a local defect? The validation test suite lacked a case for a provided value composed entirely of formatting characters.

**Root cause:** Insufficient validation: the format regex enforced character/length constraints but omitted the required semantic digit predicate.

**Corrective action:** Add the digit predicate and add a targeted TDD test that reproduces the punctuation-only input.

**Prevention:** Keep positive and negative profile-phone cases in the validation suite, including formatted valid phones and empty/omitted optional phones.

**Verification:** The fix passed the 3-case profile suite and the 15-test selected regression suite.

## 4. Root Cause Analysis Method

If a defect is identified in future testing, the following process will be followed:

1. Reproduce the defect using the recorded test steps.
2. Collect relevant screenshots, logs, and network responses.
3. Identify the affected application component.
4. Investigate the relevant frontend, backend, or database code.
5. Use the Five Whys technique to identify the underlying cause.
6. Recommend a corrective action.
7. Retest the application to verify the fix.

## 5. Requirement Status and Conclusion

DEF-001 provides one genuine RCA and a fixed-and-retested evidence chain. It is closed in the local QA defect register; no GitHub Issue was created. This report does not claim results beyond the documented member scopes.