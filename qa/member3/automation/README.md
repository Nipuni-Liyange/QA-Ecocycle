
# EcoCycle QA – Member 3
## Selenium, Cucumber BDD and GitHub Actions CI

### 1. Overview

Member 3 is responsible for automated functional testing,
Behavior-Driven Development (BDD) testing, and Continuous
Integration (CI) for the EcoCycle application.

All automated test suites have been executed successfully
locally and through GitHub Actions.

### 2. Technologies Used

- Selenium WebDriver – browser automation
- Cucumber.js – BDD testing
- Gherkin – readable BDD scenarios
- JavaScript and Node.js 24
- Firefox and Geckodriver
- MongoDB Memory Server – isolated test database
- GitHub Actions – automated CI pipeline

### 3. Selenium UI Test Cases

| ID | Test Scenario | Result |
|---|---|---|
| M3-UI01 | Valid login displays dashboard | PASS |
| M3-UI02 | Invalid login shows an error | PASS |
| M3-UI03 | Create pending pickup and verify persistence | PASS |
| M3-UI04 | Collector accepts pending pickup | PASS |

Result: 4 tests passed, 0 failed.

### 4. Cucumber BDD Testing

Eight Gherkin scenarios were implemented in
`features/pickups.feature`.

The corresponding step definitions are implemented in
`features/step_definitions/pickups.mjs`.

Test IDs: M3-BDD01 through M3-BDD08.

Results:
- 8 scenarios passed
- 42 steps passed
- 0 scenarios failed

Each successful BDD scenario generates screenshot evidence.

### 5. Safe Test Environment

The isolated test runner is located at
`scripts/isolated-runner.mjs`.

It:
1. Starts a temporary MongoDB database.
2. Starts the Express backend on port 5000.
3. Starts the Vite frontend on port 4000.
4. Executes the selected automation suite.
5. Stops the application processes.
6. Destroys the temporary database.

Tests must not be executed against the shared
production or MongoDB Atlas database.

### 6. Installation

Run from the repository root:

    npm ci --prefix server
    npm ci --prefix client
    npm ci --prefix qa/member3/automation

Firefox must be installed locally.

### 7. Execute Selenium Tests

From the repository root:

    npm run ui --prefix qa/member3/automation

Expected result: 4 passed, 0 failed.

### 8. Execute Cucumber BDD Tests

From the repository root:

    npm run bdd --prefix qa/member3/automation

Expected result:
- 8 scenarios passed
- 42 steps passed

Run an individual tagged scenario, for example:

    node qa/member3/automation/scripts/isolated-runner.mjs bdd @M3-BDD01

### 9. GitHub Actions CI

Workflow file:

    .github/workflows/qa-tests.yml

The workflow automatically runs on:
- Pushes to main and qa/** branches
- Pull requests targeting main

It can also be triggered manually.

The pipeline executes:
1. Repository checkout
2. Node.js 24 setup
3. Backend dependency installation and tests
4. Frontend dependency installation
5. Frontend lint
6. Frontend production build
7. Automation dependency installation
8. Firefox and Geckodriver verification
9. Selenium UI tests
10. Cucumber BDD tests
11. Test evidence upload

The CI environment uses Ubuntu 24.04,
headless Firefox and isolated MongoDB.

### 10. Verified CI Execution

Date: 23 November 2026

Branch: qa/automation-cicd
Commit: e234a41
Workflow run: #3
Status: SUCCESS
Total duration: 2 minutes 9 seconds

Successful workflow:
https://github.com/Nipuni-Liyange/QA-Ecocycle/actions/runs/45181306599

### 11. Test Evidence

Evidence directory:

    qa/member3/evidence/

Evidence includes:
- Selenium test result logs
- BDD scenario result logs
- BDD PASS screenshots
- GitHub Actions success screenshots

GitHub Actions also uploads a downloadable artifact
named `ecocycle-member3-ci-evidence`, containing
CI execution logs and generated screenshots.

### 12. Troubleshooting

- Port occupied: stop existing servers on 4000/5000.
- Firefox issue: verify Firefox and Geckodriver.
- MongoDB issue: verify MongoDB binary availability.
- Failed assertion: investigate the application or test
  instead of weakening the assertions.
- CI hang: verify frontend/backend process cleanup.

### 13. Conclusion

Member 3 successfully implemented four Selenium
UI tests, eight Cucumber BDD scenarios and an
automated GitHub Actions CI workflow.

The tests passed locally, and the CI workflow
completed successfully on GitHub.

This project implements Continuous Integration.
Automatic production deployment is not included.
