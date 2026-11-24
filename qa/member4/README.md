# EcoCycle QA Handoff

This folder contains the performance, security, usability, and defect-tracking deliverables. Testing is limited to the scenarios and evidence recorded in the reports; it is not a full application audit or certification.

## Contents

| Area | Report and evidence |
|---|---|
| Performance | [`performance/performance-analysis.md`](./performance/performance-analysis.md), [`performance/EcoCycle Performance Testing.jmx`](./performance/EcoCycle%20Performance%20Testing.jmx), and [`performance/concurrency-5-users-p95.jtl`](./performance/concurrency-5-users-p95.jtl) |
| Security | [`security/security-checklist.md`](./security/security-checklist.md), [`security/security-test-report.md`](./security/security-test-report.md), and [`security/evidence/`](./security/evidence/) |
| Usability | [`usability/usability-report.md`](./usability/usability-report.md) |
| Defect tracking | [`defect-tracking/defect-register.md`](./defect-tracking/defect-register.md) and [`defect-tracking/root-cause-analysis.md`](./defect-tracking/root-cause-analysis.md) |

Security text evidence and screenshot mapping are in [`security/evidence/EVIDENCE-INDEX.md`](./security/evidence/EVIDENCE-INDEX.md). The screenshot folder contains 23 PNGs, including the separately saved SEC-18 image.

## Run the JMeter scenarios

### Prerequisites and safe test setup

- Use Apache JMeter 5.6.3 or compatible and a local test backend.
- From the repository root, in one PowerShell terminal, run `cd server` then `npm run dev:local`. In a second terminal, run `cd client` then `npm run dev` if you also need the browser UI. Open `http://127.0.0.1:4000` for the frontend.
- The local backend requires MongoDB Community as described in the root README. Confirm `GET http://127.0.0.1:<port>/api/health` returns HTTP 200 before starting a load test; use the actual API port configured by the project.
- Do not point load tests at production, a shared Atlas database, or a teammate's environment. The existing performance report records a local API at `127.0.0.1:5002` with MongoDB Atlas; that historical setup was not an isolated local database. This limitation is recorded below and in the performance analysis.
- Keep each run below EcoCycle's general API rate limit of 240 requests per minute per client IP. The configured 3-second timer provides pacing.

### Existing plan and scenarios

[`EcoCycle Performance Testing.jmx`](./performance/EcoCycle%20Performance%20Testing.jmx) is configured for the 3-user, 60-second scenario, a 3-second ramp-up, `GET /api/health`, and a 3000 ms Constant Timer. To create the other documented scenarios without changing the existing plan:

1. Launch the JMeter GUI (`jmeter` from a terminal or `jmeter.bat` from the JMeter `bin` folder) and open the existing `.jmx` file.
2. In the Thread Group, set **Number of Threads (users)** and **Duration (seconds)**:
   - Baseline: 1 user, 30 seconds.
   - Controlled concurrency: 3 users, 60 seconds (the saved plan's current settings).
   - Controlled concurrency: 5 users, 60 seconds.
3. Keep the 3000 ms Constant Timer. For baseline and 5 users, use **File → Save Test Plan As** to save separate JMX copies in this performance folder before running.
4. Run each plan and use **Save Table Data** in the Summary Report listener, or run the plan non-GUI to save a JTL result:

From the folder containing this README, run:

```powershell
jmeter -n -t ".\performance\EcoCycle Performance Testing.jmx" -l ".\performance\run-3-users.jtl"
```

Replace the plan and output names for the baseline and 5-user copies. Ensure each output file is new or empty before running. For command-not-found, use the full path to `jmeter.bat` in the JMeter `bin` folder or add that folder to `PATH`.

The currently archived raw JTL is for the 5-user run only. It contains 93 HTTP 200 samples and no failures; average is 2.69 ms, median 2 ms, P95 5 ms, maximum 25 ms, and throughput is 1.656 requests/second (reported rounded to 1.7). The analysis report also records baseline and 3-user summaries, but their raw result files are not currently present in this folder. No additional runs were performed while preparing this handoff.

## Security testing method

The security report records 18 runtime checks (SEC-01–SEC-18) and three source-code reviews (SEC-19–SEC-21). Runtime checks used test accounts and recorded API responses or UI results; code-review findings are labeled separately and are not represented as executed runtime tests.

For the two-account authorization demonstration, use only test accounts in a permitted local test environment:

1. Create a test pickup using User A and note its ID.
2. Authenticate as User B and request User A's pickup ID. The recorded expected/observed result for SEC-10 is HTTP 404 without pickup disclosure.
3. In a separate collector test, browse an unassigned pickup and verify customer contact data and the exact address are not returned (SEC-03).
4. Compare the observed status and sanitized response with the entries and evidence in the security checklist.

Do not copy session cookies, CSRF tokens, real addresses, or private account data into reports. Session expiry, MongoDB TTL cleanup, and rate-limit settings were source/configuration reviews; the seven-day expiry was not allowed to elapse and runtime rate-limit enforcement was not tested.

## Usability testing method

The usability report documents ten Chrome DevTools responsive-emulation checks: mobile at 360×800, tablet at 768×1024, and desktop at 1366×768; registration, pickup creation/editing/tracking; keyboard navigation; required-field feedback; and reduced-motion behavior. These are emulated viewport results, not physical-device or full accessibility-conformance tests. The usability report is the currently listed usability artifact; this folder does not contain a separate usability screenshot set.

## Defect tracking and outstanding confirmation

The recorded performance, security, and usability work found zero confirmed defects. The HTTP 401 observed on a login page was not confirmed as a defect and is recorded as an observation only. Do not invent an issue or root cause to meet the working-plan target.

The working plan asks the team to check the shared issue register and, if a genuine defect exists, retain issue-to-fix-to-retest lifecycle evidence and perform a real root-cause analysis. Team-wide issue confirmation has not been established by these files. Until a teammate confirms the shared status, report the lifecycle/RCA target as unmet rather than claiming that no other team member found a defect. See the defect register and RCA report for the current scoped status.

## Viva preparation

- **Performance:** Explain that the measured endpoint was only `GET /api/health`. The 1-user/30-second run recorded 9 requests, 3 ms average, 18 ms maximum, and 0% errors. The 3-user/60-second run recorded 57 requests, 3 ms average, 66 ms maximum, and 0% errors. The saved 5-user JTL was independently checked: 93 successful samples, 2.69 ms average, 5 ms P95, 25 ms maximum, and 0% errors. These results do not establish whole-application or production capacity. Historical execution used an API configured with Atlas, so do not repeat it against a shared database.
- **Security demonstration:** Use the two-account SEC-10 procedure above. Show User A's test pickup, request it while signed in as User B, and explain the expected/recorded 404. Keep credentials and session tokens private.
- **Defects:** Explain that no defect was confirmed in the documented test scope. The login-page 401 was an unconfirmed observation, not a bug. Team-wide status remains unconfirmed, so there is no genuine defect lifecycle or RCA to present; state that requirement as unmet rather than inventing one.
- **Suggested four-minute flow:** State the assigned scope and risk; show a saved JMeter result or permitted local test; compare expected and observed evidence; close with the Atlas limitation and honest defect/RCA status.

## Submission status

The reports and current evidence are organized under this folder. The 5-user JTL and SEC-18 screenshot are present; baseline/3-user JTL files and a usability screenshot set are not present in the current inventory. Git staging, committing, pushing, and pull-request creation are intentionally not part of this handoff.
