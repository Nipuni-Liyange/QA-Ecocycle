$ErrorActionPreference = 'Stop'
$project = 'D:\EcoCycle-QA-shared'
$automation = Join-Path $project 'qa\member3\automation'
if (-not (Test-Path (Join-Path $automation 'package.json'))) { throw 'Automation package missing.' }
Set-Location $automation
npm pkg set 'scripts.ui:raw=node tests/ui.mjs'
if ($LASTEXITCODE -ne 0) { throw 'Could not add ui:raw script' }
npm pkg set 'scripts.bdd:raw=cucumber-js --import features/step_definitions/*.mjs features/pickups.feature'
if ($LASTEXITCODE -ne 0) { throw 'Could not add bdd:raw script' }
npm pkg set 'scripts.ui=node scripts/isolated-runner.mjs ui'
if ($LASTEXITCODE -ne 0) { throw 'Could not add ui script' }
npm pkg set 'scripts.bdd=node scripts/isolated-runner.mjs bdd'
if ($LASTEXITCODE -ne 0) { throw 'Could not add bdd script' }
Write-Host 'Commands installed. Stop any existing app servers before npm run ui or npm run bdd.'
npm pkg get scripts
