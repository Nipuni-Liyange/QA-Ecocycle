# EcoCycle Security Evidence Index

This index separates confirmed runtime evidence from source-code review evidence.

## Text Evidence

| File | Test | Evidence type |
|---|---|---|
| [`unauthenticated-access.txt`](./unauthenticated-access.txt) | SEC-01 | Runtime API response |
| [`collector-role-protection.txt`](./collector-role-protection.txt) | SEC-02 | Runtime API response |
| [`pickup-privacy.txt`](./pickup-privacy.txt) | SEC-03 | Runtime API response |
| [`logout-session-protection.txt`](./logout-session-protection.txt) | SEC-04, SEC-11 | Runtime API response |
| [`negative-quantity-validation.txt`](./negative-quantity-validation.txt) | SEC-05 | Runtime API response |
| [`invalid-quantity-type.txt`](./invalid-quantity-type.txt) | SEC-06 | Runtime API response |
| [`invalid-photo-upload.txt`](./invalid-photo-upload.txt) | SEC-07 | Runtime API response |
| [`unauthenticated-photo-access.txt`](./unauthenticated-photo-access.txt) | SEC-09 | Runtime API response |
| [`image-dimension-limit.txt`](./image-dimension-limit.txt) | SEC-17 | Runtime/UI validation |

## Screenshots

The supporting screenshots are listed in [`screenshots/README.txt`](./screenshots/README.txt). There are 22 previously prepared screenshots numbered `01` through `22`, plus the separate SEC-18 evidence:

- [`23-sec-18-cross-user-photo-ownership.png`](./screenshots/23-sec-18-cross-user-photo-ownership.png)

## Source-code Review

SEC-19 to SEC-21 and rate-limiting configuration are documented as source-code reviews, not runtime tests:

- [`auth.js`](../../../../server/src/auth.js) – seven-day lifetime, cookie settings, SHA-256 session hashes, expiry rejection
- [`models.js`](../../../../server/src/models.js) – session TTL and photo limits
- [`app.js`](../../../../server/src/app.js) – general API rate-limit middleware
- [`authRoutes.js`](../../../../server/src/routes/authRoutes.js) – login and registration rate limits
