# EP / BVA and Decision Table (Member 1)

Expected values below are derived from the backend source (`server/src/validation.js`, `server/src/routes/pickupRoutes.js`). **They are expectations, not results** — fill the *Actual* column from your own execution before marking anything Pass.

Run each row via the UI where possible, otherwise Postman (`POST /api/pickups`, valid body with only the tested field changed).

## 1. BVA — `quantity` (integer 1–999)
Rule: `Number.isInteger(q) && 1 <= q <= 999`, else 422 and `fields.quantity`.

| # | Value | Partition | Expected | Actual | Status |
|---|---|---|---|---|---|
| Q1 | 0 | invalid (below min) | 422 | | |
| Q2 | 1 | valid (min) | 201 | | |
| Q3 | 2 | valid (min+1) | 201 | | |
| Q4 | 998 | valid (max-1) | 201 | | |
| Q5 | 999 | valid (max) | 201 | | |
| Q6 | 1000 | invalid (above max) | 422 | | |
| Q7 | 2.5 | invalid (not integer) | 422 | | |
| Q8 | "2" (string, API only) | invalid (type) | 422 | | |
| Q9 | -1 | invalid | 422 | | |

## 2. BVA — `itemName` (2–120 characters after trim)
Rule: `text(value,'itemName',2,120)` trims first.

| # | Value | Expected | Actual | Status |
|---|---|---|---|---|
| N1 | length 1 (`a`) | 422 | | |
| N2 | length 2 (`ab`) | 201 | | |
| N3 | length 3 | 201 | | |
| N4 | length 119 | 201 | | |
| N5 | length 120 | 201 | | |
| N6 | length 121 | 422 | | |
| N7 | `"  a "` (1 char after trim) | 422 | | |
| N8 | `"  ab  "` (2 chars after trim) | 201; stored as `ab` | | |
| N9 | missing / non-string | 422 | | |

## 3. EP — `password` (registration/login)
Rule: `typeof string && value.length >= 8 && Buffer.byteLength(value,'utf8') <= 72`. Note `.length` counts UTF-16 code units, the limit is in bytes.

| Class | Representative | Expected | Actual | Status |
|---|---|---|---|---|
| P1 invalid: 0–7 chars | `Pass123` (7) | 422 | | |
| P2 invalid: empty | `` | 422 | | |
| P3 valid: 8 chars (boundary) | `Pass1234` | 201 | | |
| P4 valid: typical | `TestPassword123!` | 201 | | |
| P5 valid: exactly 72 bytes | 72 × `a` | 201 | | |
| P6 invalid: 73 bytes | 73 × `a` | 422 | | |
| P7 valid multibyte: 72 bytes | 36 × `é` (2 bytes each) | 201 | | |
| P8 invalid multibyte: 74 bytes | 37 × `é` | 422 | | |
| P9 invalid type | number / object | 422 | | |

Side-effect to note: because login also validates the password, a wrong password shorter than 8 chars returns **422**, not 401. Use ≥8-char wrong passwords for the 401 case.

## 4. EP — `preferredDate`
Rule: string `YYYY-MM-DD`, real calendar date, not earlier than today in **Asia/Colombo**.

| Class | Representative | Expected | Actual | Status |
|---|---|---|---|---|
| D1 valid: today | today (Colombo) | 201 | | |
| D2 valid: future | today + 7 days | 201 | | |
| D3 invalid: past | yesterday | 422 "cannot be in the past" | | |
| D4 invalid: malformed | `23/12/2026`, `2026-1-5`, `abc` | 422 "valid pickup date" | | |
| D5 invalid: impossible date | `2026-02-30`, `2026-13-01` | 422 | | |
| D6 invalid: type | number / null / missing | 422 | | |
| D7 boundary: day change | run near midnight Colombo | today per Colombo, not UTC | | |

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
| R1 | M1-F04, M1-F05 | D1, E1 | | |
| R2 | M1-F06 | – (needs collector accept first) | | |
| R3 | M1-F18 | – | | |
| R4 | M1-F17 | F6 | | |
| R5 | M1-F16 | F4 | | |
