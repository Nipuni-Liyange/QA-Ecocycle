# EP / BVA and Decision Table (Member 1)

Expected values below are derived from the backend source (`server/src/validation.js`, `server/src/routes/pickupRoutes.js`). The *Actual* and *Status* columns were filled from executions on 2026-11-23/24 (screenshots in `evidence/`, Newman report isn `evidence/newman-report.json`). Rows marked **Not run** were not executed and are not claimed as passed. Run: 33 of 34, all Pass; not run: 1 (D7, which needs a run between 00:05 and 05:25 Asia/Colombo when the Colombo and UTC dates differ). Scripts A and B were run on 2026-11-24 (`evidence/M1-EP-A-pass.png`, `evidence/M1-EP-B-pass.png`).

Run each row via the UI where possible, otherwise Postman (`POST /api/pickups`, valid body with only the tested field changed).

## 1. BVA — `quantity` (integer 1–999)
Rule: `Number.isInteger(q) && 1 <= q <= 999`, else 422 and `fields.quantity`.

| # | Value | Partition | Expected | Actual | Status |
|---|---|---|---|---|---|
| Q1 | 0 | invalid (below min) | 422 | 422 (F03 console + Newman C1); quantity field error | Pass |
| Q2 | 1 | valid (min) | 201 | 201; page shows 1 item (F09) | Pass |
| Q3 | 2 | valid (min+1) | 201 | 201 (Script A, evidence/M1-EP-A-pass.png) | Pass |
| Q4 | 998 | valid (max-1) | 201 | 201 (Script A) | Pass |
| Q5 | 999 | valid (max) | 201 | 201; page shows Quantity 999 (F09) | Pass |
| Q6 | 1000 | invalid (above max) | 422 | 422 "Enter a whole number from 1 to 999." (F08 + Newman C2) | Pass |
| Q7 | 2.5 | invalid (not integer) | 422 | 422 (Script A) | Pass |
| Q8 | "2" (string, API only) | invalid (type) | 422 | 422 (Script A) | Pass |
| Q9 | -1 | invalid | 422 | 422 (Script A) | Pass |

## 2. BVA — `itemName` (2–120 characters after trim)
Rule: `text(value,'itemName',2,120)` trims first.

| # | Value | Expected | Actual | Status |
|---|---|---|---|---|
| N1 | length 1 (`a`) | 422 | 422 (F10) | Pass |
| N2 | length 2 (`ab`) | 201 | 201 (F10) | Pass |
| N3 | length 3 | 201 | 201 (Script A) | Pass |
| N4 | length 119 | 201 | 201 (Script A) | Pass |
| N5 | length 120 | 201 | 201 (F10) | Pass |
| N6 | length 121 | 422 | 422 (F10) | Pass |
| N7 | `"  a "` (1 char after trim) | 422 | 422 (F10) | Pass |
| N8 | `"  ab  "` (2 chars after trim) | 201; stored as `ab` | 201; stored as `ab` (Script A) | Pass |
| N9 | missing / non-string | 422 | 422 for missing and for number (Script A) | Pass |

## 3. EP — `password` (registration/login)
Rule: `typeof string && value.length >= 8 && Buffer.byteLength(value,'utf8') <= 72`. Note `.length` counts UTF-16 code units, the limit is in bytes.

| Class | Representative | Expected | Actual | Status |
|---|---|---|---|---|
| P1 invalid: 0–7 chars | `Pass123` (7) | 422 | 422 password message "Use at least 8 characters (maximum 72 UTF-8 bytes)." (F12) | Pass |
| P2 invalid: empty | `` | 422 | 422 (Script B, evidence/M1-EP-B-pass.png) | Pass |
| P3 valid: 8 chars (boundary) | `Pass1234` | 201 | 201 (Script B) | Pass |
| P4 valid: typical | `TestPassword123!` | 201 | 201 (F01 and Newman A1) | Pass |
| P5 valid: exactly 72 bytes | 72 × `a` | 201 | 201 (Script B) | Pass |
| P6 invalid: 73 bytes | 73 × `a` | 422 | 422 (Script B) | Pass |
| P7 valid multibyte: 72 bytes | 36 × `é` (2 bytes each) | 201 | 201 (Script B) | Pass |
| P8 invalid multibyte: 74 bytes | 37 × `é` | 422 | 422 (Script B) | Pass |
| P9 invalid type | number / object | 422 | 422 for number and object (Script B) | Pass |

Side-effect to note: because login also validates the password, a wrong password shorter than 8 chars returns **422**, not 401. Use ≥8-char wrong passwords for the 401 case.

## 4. EP — `preferredDate`
Rule: string `YYYY-MM-DD`, real calendar date, not earlier than today in **Asia/Colombo**.

| Class | Representative | Expected | Actual | Status |
|---|---|---|---|---|
| D1 valid: today | today (Colombo) | 201 | 201 (F14) | Pass |
| D2 valid: future | today + 7 days | 201 | 201 (Script A) | Pass |
| D3 invalid: past | yesterday | 422 "cannot be in the past" | 422 (F14 console table) | Pass |
| D4 invalid: malformed | `23/12/2026`, `2026-1-5`, `abc` | 422 "valid pickup date" | 422 for 23/12/2026, abc (F14) and 2026-1-5 (Script A) | Pass |
| D5 invalid: impossible date | `2026-02-30`, `2026-13-01` | 422 | 422 for 2026-02-30 (F14) and 2026-13-01 (Script A) | Pass |
| D6 invalid: type | number / null / missing | 422 | 422 for number, null and missing (Script A) | Pass |
| D7 boundary: day change | run near midnight Colombo | today per Colombo, not UTC | Not run | Not run |

## 5. Decision table — who can edit/delete a pickup
Rules from code: PATCH/DELETE require role `user` (403 otherwise), then match `{_id, user: me, status: 'pending', collector: null}` (409 if no match; PATCH also needs matching `__v`).

| Rule | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| **Caller is the owner (user role)** | Y | Y | N (other user) | – | – |
| **Caller role is collector** | N | N | N | Y | – |
| **Caller anonymous** | N | N | N | N | Y |
| **Pickup status is pending** | Y | N (accepted+) | Y/N | Y/N | Y/N |
| **Current version supplied (PATCH)** | Y | Y | Y | Y | – |
| **Expected PATCH** | **200**, `__v`+1 | **409**, unchanged | **409**, unchanged | **403** role error | **401** |
| **Expected DELETE** | **204**, removed | **409**, unchanged | **409**, unchanged | **403** | **401** |
| **Expected GET by id** | 200 | 200 | **404** (not visible) | 404 unless assigned/pending-available | 401 |

Note for the viva: "stranger → denied" is implemented as **409 on write, 404 on read**, not 403, because ownership is part of the query filter. Confirm this in your actual run and record it as expected-by-design (not a defect) unless the requirement says 403.

| Rule | Mapped cases | Newman | Actual | Status |
|---|---|---|---|---|
| R1 | M1-F04, M1-F05 | D1, E1 | PATCH 200 with __v 0 -> 1; DELETE 204 (Newman D1, E1 also pass) | Pass |
| R2 | M1-F06 | – (needs collector accept first) | PATCH on accepted pickup returned 409; request still Accepted. DELETE and GET not run. | Pass (PATCH) |
| R3 | M1-F18 | – | Stranger: GET 404, PATCH 409, DELETE 409; owner's pickup unchanged. Behaves as designed (not a defect). | Pass |
| R4 | M1-F17 | F6 | Collector POST /api/pickups 403 role message (also Newman F6); user GET scope=available 403. Collector PATCH/DELETE not run. | Partial |
| R5 | M1-F16 | F4 | After logout GET /api/auth/me 401 (also Newman F4 GET /api/pickups 401). Anonymous PATCH/DELETE not run. | Partial |
