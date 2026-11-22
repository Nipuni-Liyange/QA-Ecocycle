import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HttpError, text, dateOnly, today } from '../src/validation.js'

// Check that invalid input produces the intended validation error.
function expectValidationError(action, field, message) {
  assert.throws(action, error => {
    assert.ok(error instanceof HttpError)
    assert.equal(error.status, 422)
    assert.equal(typeof error.fields?.[field], 'string')

    if (message !== undefined) {
      assert.equal(error.message, message)
    }

    return true
  })
}

// Calculate yesterday or tomorrow using EcoCycle's current date.
function dateOffset(days) {
  const date = new Date(`${today()}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

test('M2-T01: text rejects non-string inputs with a field error', () => {
  for (const value of [null, undefined, 123, {}, []]) {
    expectValidationError(
      () => text(value, 'itemName', 2, 120),
      'itemName'
    )
  }
})

test('M2-T02: text rejects values below the minimum after trimming', () => {
  for (const value of ['', 'A', ' A ', '   ']) {
    expectValidationError(
      () => text(value, 'itemName', 2, 120),
      'itemName'
    )
  }
})

test('M2-T03: text rejects values above the maximum', () => {
  expectValidationError(
    () => text('A'.repeat(121), 'itemName', 2, 120),
    'itemName'
  )
})

test('M2-T04: text trims valid input and accepts its length boundaries', () => {
  assert.equal(text('  Laptop  ', 'itemName', 2, 120), 'Laptop')
  assert.equal(text('AB', 'itemName', 2, 120), 'AB')

  assert.equal(
    text('A'.repeat(120), 'itemName', 2, 120),
    'A'.repeat(120)
  )

  // Check the default minimum of 1 and maximum of 200.
  assert.equal(text(' A ', 'note'), 'A')
  assert.equal(text('A'.repeat(200), 'note'), 'A'.repeat(200))
})

test('M2-T05: dateOnly rejects non-string dates', () => {
  for (const value of [null, undefined, 123, {}, []]) {
    expectValidationError(
      () => dateOnly(value),
      'preferredDate'
    )
  }
})

test('M2-T06: dateOnly rejects malformed dates and uses the requested field name', () => {
  for (const value of ['', 'not-a-date', '22/11/2026', '2026-1-01']) {
    expectValidationError(
      () => dateOnly(value, 'pickupDate'),
      'pickupDate'
    )
  }
})

test('M2-T07: dateOnly rejects an unparseable date despite the correct text format', () => {
  expectValidationError(
    () => dateOnly('2027-99-99'),
    'preferredDate'
  )
})

test('M2-T08: dateOnly rejects calendar dates that JavaScript normalizes', () => {
  expectValidationError(
    () => dateOnly('2027-02-30'),
    'preferredDate'
  )
})

test('M2-T09: dateOnly rejects yesterday with the past-date message', () => {
  expectValidationError(
    () => dateOnly(dateOffset(-1)),
    'preferredDate',
    'Pickup dates cannot be in the past.'
  )
})

test('M2-T10: dateOnly returns today and tomorrow unchanged', () => {
  const current = today()
  const tomorrow = dateOffset(1)

  assert.equal(dateOnly(current), current)
  assert.equal(dateOnly(tomorrow), tomorrow)
})