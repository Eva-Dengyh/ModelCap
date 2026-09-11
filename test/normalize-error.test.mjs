import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeError } from '../src/index.mjs'

const expected = {
  provider_code: '400',
  standard: 'invalid_parameter',
  user_message: '请求参数缺失或不合法，或 mode/媒体组合错误、时长/比例不支持',
}

test('normalizes documented string and numeric provider codes', () => {
  assert.deepEqual(normalizeError('agnes-video-2-5', '400'), expected)
  assert.deepEqual(normalizeError('agnes-video-2-5', 400), expected)
})

test('does not expose metadata or guess unknown error mappings', () => {
  assert.equal(normalizeError('agnes-video-2-5', 'note'), undefined)
  assert.equal(normalizeError('agnes-video-2-5', '_missing'), undefined)
  assert.equal(normalizeError('agnes-video-2-5', 'not-documented'), undefined)
  assert.equal(normalizeError('does-not-exist', 400), undefined)
})

test('returns a copy that cannot mutate the catalog mapping', () => {
  const first = normalizeError('agnes-video-2-5', 400)
  first.standard = 'provider_failed'

  assert.deepEqual(normalizeError('agnes-video-2-5', 400), expected)
})
