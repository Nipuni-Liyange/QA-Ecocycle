# White-box testing and code quality

Contribution scope: white-box analysis, validation unit tests, one TDD cycle,
coverage measurement, and SonarQube findings. Branch: `qa/whitebox-quality`.

## Start here

| Item | File |
|---|---|
| White-box explanation | [whitebox-analysis.md](whitebox-analysis.md) |
| Two explicit control-flow graphs | [control-flow-graphs.md](control-flow-graphs.md) |
| Baseline | [baseline.md](baseline.md) |
| Coverage comparison | [coverage-summary.md](coverage-summary.md) |
| TDD history | [tdd-evidence.md](tdd-evidence.md) |
| SonarQube findings and proposals | [sonarqube-analysis.md](sonarqube-analysis.md) |
| Results, reflection, and defect handoff | [final-handoff.md](final-handoff.md) |
| Pull-request description | [pull-request.md](pull-request.md) |

## Reproduce the selected unit tests

Use PowerShell with the project's installed dependencies. The recorded environment
used Node.js 20.20.0 and npm 10.8.2. Adapt the drive path for another machine.

```powershell
cd "D:\QA-Ecocycle\EcoCycle-main\server"
node --test test/validation.test.js test/qa-validation.test.js test/qa-profile-tdd.test.js
```

Recorded result: **15 tests passed, 0 failed**. There are 2 existing baseline tests,
10 new white-box tests, and 3 new profile TDD tests. This command is the selected
validation suite, not a claim that every application test has passed.

Evidence: [sonarqube-test-run.txt](evidence/sonarqube-test-run.txt).
The historical baseline transcript is [baseline-validation.txt](evidence/baseline-validation.txt).

## Reproduce module coverage

From `server`, run:

```powershell
npx c8 --all --include="src/validation.js" --reporter=text --reporter=html --reporter=lcov node --test test/validation.test.js test/qa-validation.test.js test/qa-profile-tdd.test.js
```

Outputs: `server/coverage/index.html` and `server/coverage/lcov.info`.
Recorded module coverage: statements/lines **91.66%**, branches **77.27%**,
functions **90%**. The coverage scope is only `server/src/validation.js`.

## Reproduce the SonarQube analysis

The recorded SonarQube project key is `qa-ecocycle`, running locally at
`http://127.0.0.1:9000`. Start the existing container if necessary:

```powershell
docker start ecocycle-sonarqube
```

Wait until SonarQube is operational. Run the coverage command above first, then
prepare repository-relative coverage paths from the repository root:

```powershell
cd "D:\QA-Ecocycle\EcoCycle-main"
Get-Content ".\server\coverage\lcov.info" | ForEach-Object {
    $_ -replace '^SF:src[\\/]', 'SF:server/src/'
} | Set-Content -Encoding ASCII ".\server\coverage\lcov-sonar.info"
```

Set the token privately; enter the generated token value at the prompt:

```powershell
$qaToken = Read-Host "SonarQube analysis token" -AsSecureString
$env:SONAR_TOKEN = [System.Net.NetworkCredential]::new('', $qaToken).Password
$env:SONAR_USER_HOME = "D:\QA-Ecocycle\sonar-cache"
```

Run the installed scanner from the repository root, using its actual path:

```powershell
& "D:\QA-Ecocycle\tools\sonar-scanner-8.4.0.16527-windows-x64\bin\sonar-scanner.bat"
$qaScanExit = $LASTEXITCODE
Remove-Item Env:\SONAR_TOKEN -ErrorAction SilentlyContinue
"Scanner exit code: $qaScanExit"
```

The recorded run returned `ANALYSIS SUCCESSFUL`, `EXECUTION SUCCESS`, and exit 0.
That confirms submission of the analysis; quality-gate status is a separate result.
Keep future scan results tied to their actual source revision.

## Evidence and limits

- SonarQube baseline source revision: `a63ed6f`.
- Recorded scanner: 8.4.0.16527; SonarQube Community Build: 26.11.0.134175, MQR mode.
- The broader source scan covers `client/src` and `server/src`; overall coverage is 16.9%.
- The selected suite has successful local execution evidence. A successful full
  database-backed integration run, frontend lint/build, and shared CI are not
  established by these selected-suite results.
- MongoDB binary download interrupted the earlier environment setup. Keep this
  historical blocker separate from the successful pure validation runs.
- Defect-log totals, issue IDs, review, and integration status are tracked in the
  [final handoff](final-handoff.md).
