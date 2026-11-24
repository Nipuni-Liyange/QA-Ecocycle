# EcoCycle Member 3 - clean, traceable BDD evidence runner.
# Runs one scenario (-Id) or all eight (-All) against the EXISTING isolated test runner.
# Preserves previous evidence, keeps full raw output, creates readable per-test summaries.
param(
  [ValidateSet('M3-BDD01','M3-BDD02','M3-BDD03','M3-BDD04','M3-BDD05','M3-BDD06','M3-BDD07','M3-BDD08')]
  [string]$Id = 'M3-BDD01',
  [switch]$All,
  [string]$RepoRoot = 'D:\EcoCycle-QA-shared'
)
$ErrorActionPreference = 'Stop'
$automation = Join-Path $RepoRoot 'qa\member3\automation'
$evidence = Join-Path $RepoRoot 'qa\member3\evidence'
$artifacts = Join-Path $evidence 'artifacts'
$featureFile = Join-Path $automation 'features\pickups.feature'

foreach ($required in @($automation, $featureFile, (Join-Path $automation 'scripts\isolated-runner.mjs'))) {
  if (!(Test-Path $required)) { throw "Missing project file or folder: $required" }
}
if (!(Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  throw 'npm.cmd was not found. Open PowerShell where Node.js/npm is installed.'
}
New-Item -ItemType Directory -Force -Path $evidence, $artifacts | Out-Null

$ids = if ($All) { 1..8 | ForEach-Object { 'M3-BDD{0:d2}' -f $_ } } else { @($Id) }
$backupDir = Join-Path $evidence ('previous-runs\' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff'))
$features = Get-Content -LiteralPath $featureFile

function Get-ScenarioInfo([string]$testId) {
  $name = '(scenario title not found)'
  $steps = New-Object 'System.Collections.Generic.List[string]'
  $found = $false
  foreach ($line in $features) {
    $trimmed = $line.Trim()
    if ($trimmed -eq ('@' + $testId)) { $found = $true; continue }
    if (!$found) { continue }
    if ($trimmed -match '^Scenario:\s*(.+)$') { $name = $Matches[1]; continue }
    if ($trimmed -match '^(Given|When|Then|And|But)\s+') { $steps.Add($trimmed); continue }
    if ($trimmed -match '^@M3-BDD\d+' -or $trimmed -match '^Scenario:') { break }
  }
  return @{ Name = $name; Steps = @($steps.ToArray()) }
}

function Preserve-OldEvidence([string]$testId) {
  $paths = @(
    (Join-Path $evidence ($testId + '-output.txt')),
    (Join-Path $evidence ($testId + '-raw.txt')),
    (Join-Path $artifacts ($testId + '-PASS.png')),
    (Join-Path $artifacts ($testId + '-FAIL.png'))
  )
  $existing = @($paths | Where-Object { Test-Path -LiteralPath $_ })
  if ($existing.Count -gt 0) {
    $target = Join-Path $backupDir $testId
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    foreach ($p in $existing) { Copy-Item -LiteralPath $p -Destination $target -Force }
  }
}

$results = New-Object 'System.Collections.Generic.List[object]'
foreach ($testId in $ids) {
  Write-Host "`nRunning $testId in the isolated environment..." -ForegroundColor Cyan
  Preserve-OldEvidence $testId
  $start = Get-Date
  $rawFile = Join-Path $evidence ($testId + '-raw.txt')
  $reportFile = Join-Path $evidence ($testId + '-output.txt')
  $stdoutTemp = Join-Path $env:TEMP ($testId + '-stdout-' + [guid]::NewGuid().ToString('N') + '.txt')
  $stderrTemp = Join-Path $env:TEMP ($testId + '-stderr-' + [guid]::NewGuid().ToString('N') + '.txt')
  $exitCode = 999
  try {
    # The existing npm bdd script invokes the isolated runner, NOT any real Atlas DB.
    $command = 'npm run bdd -- @' + $testId
    $process = Start-Process -FilePath $env:ComSpec -ArgumentList @('/d', '/c', $command) `
      -WorkingDirectory $automation -NoNewWindow -Wait -PassThru `
      -RedirectStandardOutput $stdoutTemp -RedirectStandardError $stderrTemp
    $exitCode = $process.ExitCode
    $out = if (Test-Path $stdoutTemp) { Get-Content -LiteralPath $stdoutTemp -Raw } else { '' }
    $err = if (Test-Path $stderrTemp) { Get-Content -LiteralPath $stderrTemp -Raw } else { '' }
    # Keep unedited evidence from both streams, including warnings and failures.
    $rawText = $out + "`r`n--- stderr (warnings/errors, if any) ---`r`n" + $err + "`r`nProcess exit code: " + $exitCode
    [System.IO.File]::WriteAllText($rawFile, $rawText, (New-Object System.Text.UTF8Encoding($false)))
  } finally {
    Remove-Item -LiteralPath $stdoutTemp, $stderrTemp -ErrorAction SilentlyContinue
  }

  $ansiFree = [regex]::Replace($rawText, '\x1b\[[0-?]*[ -/]*[@-~]', '')
  $scenarioMatch = [regex]::Match($ansiFree, '(?m)^\s*(\d+) scenario(?:s)? \((\d+) passed\)\s*$')
  $stepsMatch = [regex]::Match($ansiFree, '(?m)^\s*(\d+) steps? \((\d+) passed\)\s*$')
  $durationMatch = [regex]::Match($ansiFree, '(?m)^\s*(0m\s+\d+(?:\.\d+)?s)\b')
  $scenarioText = if ($scenarioMatch.Success) { $scenarioMatch.Value.Trim() } else { 'Not found (inspect raw log)' }
  $stepsText = if ($stepsMatch.Success) { $stepsMatch.Value.Trim() } else { 'Not found (inspect raw log)' }
  $durationText = if ($durationMatch.Success) { $durationMatch.Groups[1].Value } else { 'Not reported' }
  $screenshot = Join-Path $artifacts ($testId + '-PASS.png')
  $freshScreenshot = (Test-Path -LiteralPath $screenshot) -and ((Get-Item -LiteralPath $screenshot).LastWriteTime -ge $start.AddSeconds(-2))
  $cucumberPassed = $scenarioMatch.Success -and $scenarioMatch.Groups[1].Value -eq '1' -and $scenarioMatch.Groups[2].Value -eq '1' `
    -and $stepsMatch.Success -and $stepsMatch.Groups[1].Value -eq $stepsMatch.Groups[2].Value `
    -and [int]$stepsMatch.Groups[1].Value -gt 0
  $status = if ($exitCode -eq 0 -and $cucumberPassed -and $freshScreenshot) { 'PASS' } else { 'FAIL / NEEDS REVIEW' }
  $info = Get-ScenarioInfo $testId
  $scenarioSteps = if ($info.Steps.Count -gt 0) { ($info.Steps | ForEach-Object { '  ' + $_ }) -join "`r`n" } else { '  Scenario steps unavailable in feature file' }
  $shotDisplay = if ($freshScreenshot) { 'artifacts\' + $testId + '-PASS.png (captured during this run)' } `
    else { 'No confirmed fresh PASS screenshot; see raw log / artifacts' }
  $report = @"
EcoCycle - Member 3 BDD Test Evidence
====================================
Test ID        : $testId
Scenario       : $($info.Name)
Executed at    : $($start.ToString('yyyy-MM-dd HH:mm:ss'))
Test framework : Cucumber + Selenium (Firefox)
Environment    : Isolated temporary MongoDB and local app servers

BDD STEPS
---------
$scenarioSteps

ACTUAL EXECUTION RESULTS
------------------------
Scenarios      : $scenarioText
Steps          : $stepsText
Duration       : $durationText
Process exit   : $exitCode
Screenshot     : $shotDisplay

FINAL RESULT   : $status

AUDIT TRAIL
-----------
Full original console output: $testId-raw.txt
Screenshot assertions are performed by the executable step definitions.
This report summarizes real output; it does not add unverified observations.
"@
  [System.IO.File]::WriteAllText($reportFile, $report + "`r`n", (New-Object System.Text.UTF8Encoding($false)))
  $results.Add([pscustomobject]@{ Test = $testId; Status = $status; Scenarios = $scenarioText; Steps = $stepsText })
  Write-Host "$testId : $status" -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } else { 'Red' })
  Write-Host "Clean report: $reportFile"
  Write-Host "Raw audit log: $rawFile"
  if ($freshScreenshot) { Write-Host "Screenshot: $screenshot" }
}

Write-Host "`nSUMMARY" -ForegroundColor Cyan
$results | Format-Table -AutoSize
Write-Host "Previous files backed up (if present): $backupDir"
if (@($results | Where-Object { $_.Status -ne 'PASS' }).Count -gt 0) {
  Write-Warning 'One or more tests did not pass or fresh screenshot evidence was not confirmed. Review raw logs.'
  exit 1
}
