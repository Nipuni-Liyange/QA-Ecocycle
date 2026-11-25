const http = require('node:http')

const HEALTH_URL = 'http://127.0.0.1:5000/api/health'
const STARTUP_TIMEOUT_MS = 120_000
const REQUEST_TIMEOUT_MS = 2_000
const RETRY_INTERVAL_MS = 500

function checkHealth() {
  return new Promise(resolve => {
    let settled = false
    const finish = result => {
      if (settled) return
      settled = true
      resolve(result)
    }

    const request = http.get(HEALTH_URL, response => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => {
        if (response.statusCode !== 200) {
          finish({ ready: false, reason: `HTTP ${response.statusCode}` })
          return
        }

        let health
        try {
          health = JSON.parse(body)
        } catch {
          finish({ ready: false, reason: 'invalid JSON health response' })
          return
        }

        const ready = health.status === 'ok' && health.database === 'connected'
        finish({
          ready,
          reason: ready ? '' : 'health response does not report a connected database',
        })
      })
      response.on('error', error => finish({ ready: false, reason: error.message }))
    })

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('health request timed out'))
    })
    request.on('error', error => finish({ ready: false, reason: error.message }))
  })
}

async function waitForBackend() {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS
  let lastReason = 'no health response received'

  while (Date.now() < deadline) {
    const result = await checkHealth()
    if (result.ready) {
      console.log('Backend is healthy and connected to MongoDB.')
      return
    }

    lastReason = result.reason
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS))
  }

  console.error(
    `Backend did not become ready at ${HEALTH_URL} within ${STARTUP_TIMEOUT_MS / 1000} seconds. ` +
    `Last check: ${lastReason}. Check server/.env, MongoDB availability, and port 5000.`,
  )
  process.exitCode = 1
}

waitForBackend()
