# EcoCycle – Root Cause Analysis Report

**Module:** Software Testing and Quality Assurance  
**Date:** 2026-11-23

## 1. Introduction

Root Cause Analysis (RCA) is used to identify the underlying reasons for software defects. It helps the development team understand why a problem occurred and prevent similar problems in the future.

## 2. Analysis of Testing Results

Member 4 completed performance, security, and responsive usability testing.

Based on the recorded test results:

- Performance testing: No failed requests were observed in the recorded load tests.
- Security testing: The tested security validation checks passed.
- Usability testing: The tested mobile, tablet, and desktop layouts worked as expected.
- Defect tracking: No confirmed defects were identified.

Therefore, there are currently no confirmed defects requiring root cause analysis.

## 3. Observation Requiring Further Investigation

**Observation:** HTTP 401 Unauthorized responses appeared in the browser console during login-page testing.

**Possible explanation:** The application may return 401 when an authentication request is made without a valid logged-in session.

**Investigation status:** Not confirmed as a defect.

**Conclusion:** Further investigation is required before identifying a root cause or recommending a code change.

## 4. Root Cause Analysis Method

If a defect is identified in future testing, the following process will be followed:

1. Reproduce the defect using the recorded test steps.
2. Collect relevant screenshots, logs, and network responses.
3. Identify the affected application component.
4. Investigate the relevant frontend, backend, or database code.
5. Use the Five Whys technique to identify the underlying cause.
6. Recommend a corrective action.
7. Retest the application to verify the fix.

## 5. Conclusion

Based on the completed testing activities, no confirmed defects were identified that require root cause analysis. The available observations have been documented for future investigation where necessary.