# EcoCycle – Security Testing Checklist

**Project:** EcoCycle  
**QA Responsibility:** Member 4 – Performance, Security, Usability and Defect Tracking  
**Environment:** Local development environment  
**Backend:** Express.js  
**Database:** MongoDB Atlas  
**Testing Date:** 23 November 2026

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

## 4. Summary of Results

| Metric | Count |
|---|---:|
| Total security tests | 9 |
| Passed | 9 |
| Failed | 0 |
| Not tested | Recorded separately below |

The nine checks performed during this test session passed their stated expected outcomes.

## 5. Evidence

The following evidence was captured during testing:

| Evidence ID | Description |
|---|---|
| SEC-E01 | Unauthenticated `/api/auth/me` response – HTTP 401 |
| SEC-E02 | Collector role modification rejected – HTTP 422 |
| SEC-E03 | Pickup API response showing private fields were omitted |
| SEC-E04 | Protected endpoint rejected access after logout – HTTP 401 |
| SEC-E05 | Negative quantity rejected – HTTP 422 |
| SEC-E06 | String quantity rejected – HTTP 422 |
| SEC-E07 | Unsupported photo upload rejected – HTTP 422 |
| SEC-E08 | Authenticated collector photo access – HTTP 200 |
| SEC-E09 | Unauthenticated photo access rejected – HTTP 401 |

Screenshots and response captures should be retained as supporting evidence alongside this report.

## 6. Limitations and Further Testing

The following security checks were not completed during this test session:

- Expired session behaviour.
- Cross-user access to another user's pickup through direct ID manipulation.
- Collector attempts to edit a general user's account or pickup.
- Injection and unsafe search input testing.
- CSRF protection testing with missing or invalid tokens.
- Upload size and image dimension limits.
- Attempts to reuse another pickup's photo ID.
- Rate-limiting behaviour under repeated authentication attempts.

These areas require additional testing before making broader conclusions about application security.

## 7. Conclusion

The tested EcoCycle security controls behaved as expected in the local development environment.

The backend rejected unauthenticated access, prevented collector role modification, protected private pickup information, invalidated access after logout, rejected invalid quantity values and blocked unsupported photo uploads.

Photo access was available to authenticated collectors viewing pending requests, while unauthenticated photo access was rejected.

Further testing is required to assess the remaining security areas listed above.

