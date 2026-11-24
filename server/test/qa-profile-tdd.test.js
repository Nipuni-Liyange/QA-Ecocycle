import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HttpError, profileInput } from '../src/validation.js'

test('M2-TDD01: reject a provided phone containing no digits', () => {
  assert.throws(
    () => profileInput({
      name: 'Test User',
      phone: '-------',
      district: ''
    }),
    error =>
      error instanceof HttpError &&
      error.status === 422 &&
      typeof error.fields?.phone === 'string'
  )
})

test('M2-TDD02: accept a valid formatted phone number', () => {
  const result = profileInput({
    name: 'Test User',
    phone: '+94 77 123 4567',
    district: 'Colombo'
  })

  assert.equal(result.phone, '+94 77 123 4567')
  assert.equal(result.district, 'Colombo')
})

test('M2-TDD03: allow an empty or omitted optional phone', () => {
  const empty = profileInput({
    name: 'Test User',
    phone: '',
    district: ''
  })

  const omitted = profileInput({
    name: 'Test User'
  })

  assert.equal(empty.phone, '')
  assert.equal(omitted.phone, '')
})