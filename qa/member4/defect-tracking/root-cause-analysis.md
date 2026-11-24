# EcoCycle – Root Cause Analysis Report

**Module:** Software Testing and Quality Assurance  
**Date:** 2026-11-23

## 1. Introduction

Root Cause Analysis (RCA) is used to identify the underlying reasons for software defects. It helps the development team understand why a problem occurred and prevent similar problems in the future.

## 2. Analysis of Testing Results

Performance, security, and responsive usability testing were completed.

Based on the recorded test results:

- Performance testing: No failed requests were observed in the recorded load tests.
- Security testing: The tested security validation checks passed.
- Usability testing: The tested mobile, tablet, and desktop layouts worked as expected.
- Defect tracking: No confirmed defects were identified.

No confirmed defect was identified in the recorded testing scope, so a genuine defect root-cause analysis cannot be completed without inventing a failure. The shared team issue register and teammate findings have not been independently confirmed here.

## 3. Unconfirmed Observation Requiring Further Investigation

**Observation:** HTTP 401 Unauthorized responses appeared in the browser console during login-page testing.

**Possible explanation:** A request to a protected endpoint without a valid session may correctly return 401.

**Investigation status:** Not confirmed as a defect. There is no verified reproduction showing incorrect behavior, linked issue, or fix to analyze.

**Conclusion:** Do not assign a root cause or recommend a code change unless further investigation confirms a defect.

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

No confirmed defect from the recorded tests is available for root-cause analysis. The working-plan target of one or two real RCAs, and the full defect lifecycle demonstration, are unmet unless the team confirms a genuine defect and supplies evidence for its fix and retest. This report does not claim team-wide absence of defects.