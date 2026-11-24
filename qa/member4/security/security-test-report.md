# EcoCycle – Security Test Report

**Project:** EcoCycle  
**Module:** Security Testing  
**Testing period:** 23–24 November 2026  
**Environment:** Local React/Vite frontend and Express API using MongoDB Atlas

## 1. Objective and Scope

This report documents the security tests completed for EcoCycle. The scope covered authentication, logout/session handling, authorization, pickup privacy, CSRF protection, input and photo validation, search-input handling, session expiry, and rate-limiting configuration.

## 2. Runtime Test Summary

| Test | Result | Confirmed outcome |
|---|---|---|
| SEC-01 | PASS | Protected `/api/auth/me` access without login returns 401 |
| SEC-02 | PASS | Collector role change is rejected |
| SEC-03 | PASS | Unassigned collectors cannot view customer private information or exact address |
| SEC-04 | PASS | Protected access after logout returns 401 |
| SEC-05 | PASS | Negative quantity is rejected with 422 |
| SEC-06 | PASS | Non-numeric quantity is rejected with 422 |
| SEC-07 | PASS | Unsupported photo format is rejected with 422 |
| SEC-08 | PASS | Authenticated collector can access permitted pickup photos |
| SEC-09 | PASS | Unauthenticated photo access returns 401 |
| SEC-10 | PASS | Another user's pickup is not disclosed and returns 404 |
| SEC-11 | PASS | A session reused after logout does not remain authorised |
| SEC-12 | PASS | Write request without CSRF token returns 403 |
| SEC-13 | PASS | Write request with invalid CSRF token returns 403 |
| SEC-14 | PASS | Collector cannot perform user-only pickup modifications |
| SEC-15 | PASS | Injection-style search text is safely escaped and not executed |
| SEC-16 | PASS | Photos larger than 2 MB are rejected |
| SEC-17 | PASS | Images exceeding 24 megapixels are rejected |
| SEC-18 | PASS | A foreign photo ID is rejected with 422 |

## 3. Source-code Review Summary

| Control | Review result | Evidence |
|---|---|---|
| SEC-19 Session lifetime | PASS | [`auth.js`](../../../server/src/auth.js) sets a seven-day lifetime and matching cookie `maxAge` |
| SEC-20 Expired-session rejection | PASS | [`auth.js`](../../../server/src/auth.js) rejects sessions whose `expiresAt` is not in the future |
| SEC-21 Automatic session cleanup | PASS | [`models.js`](../../../server/src/models.js) defines `expiresAt` with `expires: 0` for MongoDB TTL cleanup |
| General API rate limit | CONFIGURED | [`app.js`](../../../server/src/app.js) configures 240 requests per minute |
| Authentication rate limit | CONFIGURED | [`authRoutes.js`](../../../server/src/routes/authRoutes.js) configures 30 login/registration attempts per 15 minutes |

## 4. Security Findings

### Authentication and sessions

- Session IDs are random 32-byte tokens and are stored in MongoDB only as SHA-256 hashes.
- Session cookies are HTTP-only, use `SameSite=Lax`, use the Secure flag in production, and expire after seven days.
- Logout deletes the server-side session and clears the cookie.
- Authentication rejects missing, invalid, and expired sessions with HTTP 401.

### Authorization and privacy

- Cross-user pickup reads return 404 instead of exposing whether another user's pickup exists.
- Unassigned collectors receive pickup details without customer identity or exact address.
- Collector-only and user-only operations are protected by role checks.
- Photo endpoints apply the same ownership and collector visibility rules as pickup endpoints.

### Input, upload, and request protection

- Quantity and photo upload data are validated by the backend.
- Photos are limited to three items, 2 MB each, and 24 megapixels.
- State-changing API requests require an authenticated session and a matching CSRF token.
- Search text is escaped before it is inserted into a regular expression.

## 5. Evidence

Supporting text evidence and screenshots are stored in [`evidence/`](./evidence/). The complete screenshot index is documented in [`evidence/screenshots/README.txt`](./evidence/screenshots/README.txt).

The previously prepared screenshot set contains 22 screenshots. A separate SEC-18 screenshot is also present as [`23-sec-18-cross-user-photo-ownership.png`](./evidence/screenshots/23-sec-18-cross-user-photo-ownership.png).

## 6. Limitations

- Session expiry rejection and TTL cleanup behavior were source-code reviews; the seven-day expiry was not allowed to elapse and TTL deletion was not observed at runtime.
- Rate-limit settings were confirmed in source code; runtime enforcement was not tested because repeated failed attempts could temporarily restrict the testing IP.
- The local API used MongoDB Atlas during testing rather than an isolated local database.
- The injection-style search check was limited to basic regular-expression metacharacter input; it was not a complete penetration test.
- The report distinguishes observed runtime results from controls confirmed only through source review.

## 7. Overall Conclusion

The 18 runtime security tests passed in the tested scenarios. The additional three controls passed source-code review. The documented rate-limit settings were also confirmed in source code, but runtime enforcement remains an outstanding test. Based on the completed evidence, the reviewed EcoCycle security controls performed as expected for the tested threats.
