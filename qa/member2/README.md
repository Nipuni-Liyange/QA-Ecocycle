# Validation tests and quality analysis

This guide is for anyone reproducing the validation tests and quality analysis.
All workflows start at the **repository root**, the folder containing `client`,
`server`, and `qa`. Paths are relative to that folder.

## Documentation

| Item | File |
|---|---|
| White-box analysis | [whitebox-analysis.md](whitebox-analysis.md) |
| Annotated control-flow graphs | [control-flow-graphs.md](control-flow-graphs.md) |
| Baseline | [baseline.md](baseline.md) |
| Coverage comparison | [coverage-summary.md](coverage-summary.md) |
| TDD evidence | [tdd-evidence.md](tdd-evidence.md) |
| SonarQube findings and proposals | [sonarqube-analysis.md](sonarqube-analysis.md) |
| Handoff and reflection | [final-handoff.md](final-handoff.md) |

## Run the selected validation tests

Use the checked-out source and the project's installed dependencies. From the
repository root, run:

```sh
node --test server/test/validation.test.js server/test/qa-validation.test.js server/test/qa-profile-tdd.test.js
```

The recorded run used Node.js 20.20.0 and npm 10.8.2 and reported **15 passed,
0 failed**: 2 existing tests, 10 white-box tests, and 3 profile TDD tests.
This is the selected validation suite. The transcript is
[sonarqube-test-run.txt](evidence/sonarqube-test-run.txt).

## Generate module coverage

The coverage command runs inside `server`, then returns to the repository root:

```sh
cd server
npx c8 --all --include="src/validation.js" --reporter=text --reporter=html --reporter=lcov node --test test/validation.test.js test/qa-validation.test.js test/qa-profile-tdd.test.js
cd ..
```

Outputs are `server/coverage/index.html` and `server/coverage/lcov.info`.
The recorded validation.js-only coverage is 91.66% statements/lines, 77.27%
branches, and 90% functions. Revision-specific interpretation and limitations are
in [coverage-summary.md](coverage-summary.md).

## Run SonarQube analysis

Run the selected tests and coverage generation first. Start the existing local
SonarQube container if needed:

```sh
docker start ecocycle-sonarqube
```

Wait until the service is operational. Install SonarScanner CLI and make its
`bin` directory available through the current machine's PATH.
Confirm the command is available:

```sh
sonar-scanner --version
```

The checked-in `sonar-project.properties` identifies the source directories,
tests, project key `qa-ecocycle`, and LCOV report path.
For PowerShell, prepare repository-relative coverage paths from the repository root:

```powershell
Get-Content ".\server\coverage\lcov.info" | ForEach-Object {
    $_ -replace '^SF:src[\\/]', 'SF:server/src/'
} | Set-Content -Encoding ASCII ".\server\coverage\lcov-sonar.info"
```

Set the current operator's analysis token privately. The next commands use PowerShell:

```powershell
$qaToken = Read-Host "SonarQube analysis token" -AsSecureString
$env:SONAR_TOKEN = [System.Net.NetworkCredential]::new('', $qaToken).Password
```

Run the scanner from the repository root:

```powershell
try {
    sonar-scanner
    $qaScanExit = $LASTEXITCODE
} finally {
    Remove-Item Env:\SONAR_TOKEN -ErrorAction SilentlyContinue
}
"Scanner exit code: $qaScanExit"
```

The recorded analysis of revision `a63ed6f` used SonarScanner CLI 8.4.0.16527
and SonarQube Community Build 26.11.0.134175. It returned `ANALYSIS SUCCESSFUL`,
`EXECUTION SUCCESS`, and exit 0. Quality-gate status is a separate result.
The wider source scan reported 16.9% overall coverage; see
[sonarqube-analysis.md](sonarqube-analysis.md) for its scope and findings.

## Evidence and validation scope

- Reproduce commands from the repository root or the explicitly stated subfolder.
- Use the environment configuration, tool installation, and authorized test data
  appropriate to the current machine.
- The selected validation suite and scan have recorded execution evidence.
- A successful full integration run, frontend lint/build, and shared CI are not
  established by the selected-suite transcript alone.
- The final handoff identifies the remaining shared defect-log and review items.
