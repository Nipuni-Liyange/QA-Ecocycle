# EcoCycle – Security Testing Checklist

**Project:** EcoCycle  
**QA Responsibility:** Performance, Security, Usability and Defect Tracking
**Environment:** Local development environment  
**Backend:** Express.js  
**Database:** MongoDB Atlas  
**Testing Date:** 23–24 November 2026

## 1. Objective

The purpose of this security testing was to evaluate selected authentication, authorization, input validation, pickup information privacy and photo upload protections in the EcoCycle application.

All tests were performed against the local development application using test accounts and test data.

## 2. Test Environment

| Component | Details |
|---|---|
| Frontend | React / Vite |
| Backend | Node.js / Express |
| Database | MongoDB Atlas |
| Frontend URL | http://127.0.0.1:4000 |
| Backend URL | http://127.0.0.1:5002 |
| Test accounts | QA Test User and QA Test Collector |
| Browser | Google Chrome |

## 3. Security Test Results

### SEC-01 – Unauthenticated Access Protection

**Objective:** Verify that protected account information cannot be accessed without authentication.

**Procedure:**
1. Log out of the application.
2. Send a GET request to `/api/auth/me`.
3. Observe the HTTP response.

**Expected Result:** The backend should reject the request with HTTP 401 Unauthorized.

**Actual Result:** HTTP 401 Unauthorized. The response message was `Please log in to continue.`

**Status:** PASS

### SEC-02 – Role Modification Protection

**Objective:** Verify that a collector cannot change their account role through the profile update endpoint.

**Procedure:**
1. Log in as QA Test Collector.
2. Send a PATCH request to `/api/auth/profile`.
3. Include `role: "user"` in the request body.

**Expected Result:** The backend should reject attempts to modify protected account fields.

**Actual Result:** HTTP 422 Unprocessable Entity. The response stated: `Only your name, phone and district can be updated here.`

**Status:** PASS

### SEC-03 – Pickup Information Privacy

**Objective:** Verify that an unassigned collector cannot retrieve the customer's private contact information and exact pickup address.

**Procedure:**
1. Create a test pickup as QA Test User.
2. Log in as QA Test Collector.
3. Open the pending pickup details.
4. Inspect the pickup details API response.

**Expected Result:** Private customer contact information and the exact pickup address should not be exposed to an unassigned collector.

**Actual Result:** The API returned item information, district, city, preferred date, photo references and status. It did not return the customer's name, email, phone number or exact pickup address.

**Status:** PASS

### SEC-04 – Logout Session Protection

**Objective:** Verify that a logged-out session cannot access protected endpoints.

**Procedure:**
1. Log in as QA Test Collector.
2. Log out through the application.
3. Send a GET request to `/api/auth/me`.

**Expected Result:** The backend should reject the request with HTTP 401 Unauthorized.

**Actual Result:** HTTP 401 Unauthorized. The response message was `Please log in to continue.`

**Status:** PASS

### SEC-05 – Negative Quantity Validation

**Objective:** Verify that the backend rejects negative pickup quantities.

**Procedure:**
1. Log in as QA Test User.
2. Submit a pickup request with quantity set to `-5`.
3. Observe the response.

**Expected Result:** The backend should reject the invalid quantity.

**Actual Result:** HTTP 422 Unprocessable Entity. The response stated: `Quantity must be a whole number from 1 to 999.`

**Status:** PASS

### SEC-06 – Invalid Quantity Data Type

**Objective:** Verify that the backend rejects an incorrect data type for the quantity field.

**Procedure:**
1. Submit a pickup request with quantity set to the string `"many"`.
2. Observe the response.

**Expected Result:** The backend should reject the invalid data type.

**Actual Result:** HTTP 422 Unprocessable Entity. The response stated: `Quantity must be a whole number from 1 to 999.`

**Status:** PASS

### SEC-07 – Invalid Photo Upload Validation

**Objective:** Verify that the backend rejects unsupported file types during photo uploads.

**Procedure:**
1. Submit a test pickup request with a text data URL instead of a supported image.
2. Observe the response.

**Expected Result:** The backend should reject unsupported file types.

**Actual Result:** HTTP 422 Unprocessable Entity. The response stated: `Use a JPEG, PNG or WebP image.`

**Status:** PASS

### SEC-08 – Authenticated Photo Access

**Objective:** Verify photo access for an authenticated collector viewing an available pickup.

**Procedure:**
1. Log in as QA Test Collector.
2. Open the pending pickup created by QA Test User.
3. Request the pickup photo endpoint.

**Expected Result:** An authenticated collector should be able to preview the item photo for an available pickup.

**Actual Result:** HTTP 200 OK. The response content type was `image/webp`.

**Status:** PASS – Expected application behaviour

### SEC-09 – Unauthenticated Photo Access

**Objective:** Verify that a visitor without an authenticated session cannot access a pickup photo.

**Procedure:**
1. Log out of the collector account.
2. Request the same pickup photo endpoint without authentication.
3. Observe the response.

**Expected Result:** The backend should reject unauthenticated photo access.

**Actual Result:** HTTP 401 Unauthorized.

**Status:** PASS

### SEC-10 – Cross-user Pickup Information Protection

**Objective:** Verify that an authenticated user cannot retrieve another user's pickup by requesting its pickup ID.

**Procedure:**
1. Log in as a test user.
2. Request a pickup ID belonging to another user.
3. Observe the API response.

**Expected Result:** The backend should not disclose the other user's pickup.

**Actual Result:** HTTP 404 Not Found. The response stated `Pickup request not found.` and did not disclose pickup details.

**Status:** PASS

### SEC-11 – Session Protection After Logout

**Objective:** Verify that a retained or reused session cannot access protected endpoints after logout.

**Procedure:**
1. Log in to a test account.
2. Log out and delete the application session.
3. Reuse the previous session/cookie to request `/api/auth/me`.

**Expected Result:** The backend should reject the old session with HTTP 401.

**Actual Result:** HTTP 401 Unauthorized. The response stated `Please log in to continue.`

**Status:** PASS

### SEC-12 – Missing CSRF Token

**Objective:** Verify that a state-changing request is rejected when the CSRF token is absent.

**Procedure:**
1. Log in to an authenticated account.
2. Send a pickup write request without the `X-CSRF-Token` header.
3. Observe the response.

**Expected Result:** The backend should reject the request with HTTP 403.

**Actual Result:** HTTP 403 Forbidden with the invalid security token response.

**Status:** PASS

### SEC-13 – Invalid CSRF Token

**Objective:** Verify that a state-changing request is rejected when an incorrect CSRF token is supplied.

**Procedure:**
1. Log in to an authenticated account.
2. Send a pickup write request using an invalid `X-CSRF-Token` value.
3. Observe the response.

**Expected Result:** The backend should reject the request with HTTP 403.

**Actual Result:** HTTP 403 Forbidden. The request was not processed.

**Status:** PASS

### SEC-14 – Unauthorized Collector Pickup Modification

**Objective:** Verify that a collector cannot use user-only pickup modification operations.

**Procedure:**
1. Log in as QA Test Collector.
2. Attempt to update or delete a pickup through a user-only endpoint.
3. Observe the response.

**Expected Result:** The backend should reject the collector's unauthorized modification with HTTP 403.

**Actual Result:** HTTP 403 Forbidden. Collector access was limited to collector-authorized operations.

**Status:** PASS

### SEC-15 – Injection-style Search Input

**Objective:** Verify that search input containing injection-style regular-expression characters is handled safely.

**Procedure:**
1. Log in to the application.
2. Enter basic injection-style text containing regular-expression special characters in the pickup search field.
3. Observe the search response.

**Expected Result:** The search should remain operational and not execute as unintended regular-expression logic.

**Actual Result:** The search input was treated as literal text and did not cause an injection or application error.

**Status:** PASS

**Source finding:** The backend escapes regular-expression metacharacters before constructing the MongoDB search expression.

### SEC-16 – Photo Size Limit

**Objective:** Verify that photo uploads larger than 2 MB are rejected.

**Procedure:**
1. Select a valid image larger than 2 MB.
2. Create or update a pickup using the photo.
3. Observe the upload result.

**Expected Result:** The application should reject the oversized photo.

**Actual Result:** The photo was rejected before pickup submission with the photo-size validation message.

**Status:** PASS

### SEC-17 – Photo Dimension Limit

**Objective:** Verify that images exceeding 24 megapixels are rejected.

**Procedure:**
1. Prepare a valid JPEG containing approximately 25 megapixels.
2. Upload it as a pickup photo.
3. Observe the response.

**Expected Result:** The backend should reject an image exceeding the configured 24-megapixel limit.

**Actual Result:** The image was rejected with `This photo could not be processed. Use an undamaged JPG, PNG or WebP image up to 2 MB and 24 megapixels.`

**Status:** PASS

**Evidence:** [`image-dimension-limit.txt`](./evidence/image-dimension-limit.txt)

### SEC-18 – Cross-user Photo ID Reuse Protection

**Objective:** Verify that one user cannot reuse a photo ID belonging to another user's pickup request.

**Procedure:**
1. Create a pickup with a photo as QA Test User (User A).
2. Log in as a different account, QA Test User B.
3. Obtain the existing photo ID belonging to User A's pickup.
4. Attempt to create or update a pickup using that foreign photo ID.
5. Observe the response.

**Expected Result:** The foreign photo ID should be rejected and the pickup should not be submitted.

**Actual Result:** HTTP 422 Unprocessable Entity. The submitted photo was not accepted because it did not belong to the current request.

**Status:** PASS

**Evidence:** [`23-sec-18-cross-user-photo-ownership.png`](./evidence/screenshots/23-sec-18-cross-user-photo-ownership.png)

### Additional Security Checks – Session Management and Rate Limiting

#### SEC-19 – Session Lifetime Configuration

**Status:** PASS – Source Code Review

The application configures a session lifetime of seven days. The cookie uses the same maximum age, and the session document stores an `expiresAt` timestamp.

**Relevant source:** [`auth.js`](../../../server/src/auth.js) and [`models.js`](../../../server/src/models.js)

#### SEC-20 – Expired Session Rejection

**Status:** PASS – Source Code Review

The authentication middleware checks whether the session expiry timestamp is later than the current time. Expired sessions are rejected with HTTP 401.

**Relevant source:** [`auth.js`](../../../server/src/auth.js)

#### SEC-21 – Automatic Session Cleanup

**Status:** PASS – Source Code Review

The MongoDB Session schema defines `expiresAt` with `expires: 0`, configuring a TTL index to automatically remove expired session records. MongoDB performs this cleanup in the background.

**Relevant source:** [`models.js`](../../../server/src/models.js)

### Rate-Limiting Configuration Review

The application configures:
- General API requests: 240 requests per minute.
- Login and registration: 30 attempts per 15 minutes.

The rate-limiting configuration and middleware placement were reviewed in the source code. Runtime enforcement was not tested because repeated failed authentication attempts could temporarily restrict access from the testing IP.

**Relevant source:** [`app.js`](../../../server/src/app.js)

## 4. Evidence Index

| Evidence | Coverage |
|---|---|
| [`unauthenticated-access.txt`](./evidence/unauthenticated-access.txt) | SEC-01 |
| [`collector-role-protection.txt`](./evidence/collector-role-protection.txt) | SEC-02 |
| [`pickup-privacy.txt`](./evidence/pickup-privacy.txt) | SEC-03 |
| [`logout-session-protection.txt`](./evidence/logout-session-protection.txt) | SEC-04 and SEC-11 |
| [`negative-quantity-validation.txt`](./evidence/negative-quantity-validation.txt) | SEC-05 |
| [`invalid-quantity-type.txt`](./evidence/invalid-quantity-type.txt) | SEC-06 |
| [`invalid-photo-upload.txt`](./evidence/invalid-photo-upload.txt) | SEC-07 |
| [`unauthenticated-photo-access.txt`](./evidence/unauthenticated-photo-access.txt) | SEC-09 |
| [`image-dimension-limit.txt`](./evidence/image-dimension-limit.txt) | SEC-17 |
| [`23-sec-18-cross-user-photo-ownership.png`](./evidence/screenshots/23-sec-18-cross-user-photo-ownership.png) | SEC-18 |
| [`screenshots/`](./evidence/screenshots/) | Additional supporting screenshots |

## 5. Testing Limitations

Session expiry rejection and TTL cleanup behavior were confirmed by source-code review; the seven-day expiry period was not allowed to elapse and TTL deletion was not observed at runtime. Rate-limit configuration was confirmed in source code, but runtime rate-limit enforcement was not tested.