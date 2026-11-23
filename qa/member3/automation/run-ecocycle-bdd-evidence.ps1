# Run one BDD scenario safely, saving a console log. The Cucumber hook also saves a screenshot.
param(
  [ValidateSet('M3-BDD01','M3-BDD02','M3-BDD03','M3-BDD04','M3-BDD05','M3-BDD06','M3-BDD07','M3-BDD08')]
  [string]$Id = 'M3-BDD01',
  [string]$RepoRoot = 'D:\EcoCycle-QA-shared'
)
$automation = Join-Path $RepoRoot 'qa\member3\automation'
$evidence = Join-Path $RepoRoot 'qa\member3\evidence'
if (!(Test-Path $automation)) { throw "Missing automation folder: $automation" }
New-Item -ItemType Directory -Force -Path $evidence | Out-Null
$log = Join-Path $evidence "$Id-output.txt"
Push-Location $automation
try {
  & npm run bdd -- "@$Id" 2>&1 | Tee-Object -FilePath $log
  $testExit = $LASTEXITCODE
  "Exit code: $testExit" | Tee-Object -FilePath $log -Append
  if ($testExit -ne 0) { throw "$Id failed, see $log" }
  Write-Host "$Id PASSED. Log: $log" -ForegroundColor Green
  Write-Host "Screenshot: $evidence\artifacts\$Id-PASS.png"
} finally {
  Pop-Location
}
