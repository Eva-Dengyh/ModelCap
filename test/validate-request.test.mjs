import assert from 'node:assert/strict'
import test from 'node:test'
import { validateRequest } from '../src/index.mjs'
import { validateModelRequest } from '../src/validate-request.mjs'

const model = {
  model_id: 'fixture-model',
  ability: { tasks: ['generate'] },
  input_limits: {},
  rules: {
    generate: {
      supported_parameters: ['duration', 'resolution', 'aspect_ratio', 'generate_audio'],
      duration_seconds: { min: 4, max: 12, step: 4 },
      resolution: ['720p'],
      aspect_ratio: ['16:9'],
      generate_audio: false,
    },
  },
}

const codes = (issues) => issues.map((item) => item.code)

test('rejects an unsupported task', () => {
  assert.deepEqual(codes(validateModelRequest(model, { task: 'edit' }).errors), ['UNSUPPORTED_TASK'])
})

test('rejects a parameter outside the documented allow-list', () => {
  assert.deepEqual(codes(validateModelRequest(model, {
    task: 'generate', parameters: { seed: 1 },
  }).errors), ['UNSUPPORTED_PARAMETER'])
})

test('warns when parameter support is undocumented', () => {
  const withoutAllowList = structuredClone(model)
  delete withoutAllowList.rules.generate.supported_parameters

  const result = validateModelRequest(withoutAllowList, {
    task: 'generate', parameters: { seed: 1 },
  })

  assert.equal(result.valid, true)
  assert.deepEqual(codes(result.warnings), ['PARAMETER_SUPPORT_UNKNOWN'])
})

test('rejects duration outside the documented range', () => {
  assert.deepEqual(codes(validateModelRequest(model, {
    task: 'generate', parameters: { duration: 3 },
  }).errors), ['DURATION_OUT_OF_RANGE'])
})

test('rejects duration that misses the documented step', () => {
  assert.deepEqual(codes(validateModelRequest(model, {
    task: 'generate', parameters: { duration: 6 },
  }).errors), ['DURATION_STEP_MISMATCH'])
})

test('rejects client duration when the provider controls it', () => {
  const serverControlled = structuredClone(model)
  serverControlled.rules.generate.duration_seconds = -1

  assert.deepEqual(codes(validateModelRequest(serverControlled, {
    task: 'generate', parameters: { duration: -1 },
  }).errors), ['DURATION_SERVER_CONTROLLED'])
})

test('rejects undocumented resolution and aspect ratio choices', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    parameters: { resolution: '1080p', aspect_ratio: '9:16' },
  })

  assert.deepEqual(codes(result.errors), ['RESOLUTION_NOT_ALLOWED', 'ASPECT_RATIO_NOT_ALLOWED'])
})

test('rejects explicitly unsupported audio generation', () => {
  assert.deepEqual(codes(validateModelRequest(model, {
    task: 'generate', parameters: { generate_audio: true },
  }).errors), ['AUDIO_GENERATION_NOT_SUPPORTED'])
})

test('accepts a request satisfying every documented parameter constraint', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    parameters: {
      duration: 8,
      resolution: '720p',
      aspect_ratio: '16:9',
      generate_audio: false,
    },
  })

  assert.deepEqual(result, { valid: true, errors: [], warnings: [] })
})

test('reports unknown constraints as warnings instead of hard failures', () => {
  const unknowns = structuredClone(model)
  unknowns.rules.generate.duration_seconds = null
  unknowns.rules.generate.resolution = null
  unknowns.rules.generate.aspect_ratio = null
  unknowns.rules.generate.generate_audio = null

  const result = validateModelRequest(unknowns, {
    task: 'generate',
    parameters: {
      duration: 8,
      resolution: '720p',
      aspect_ratio: '16:9',
      generate_audio: true,
    },
  })

  assert.equal(result.valid, true)
  assert.deepEqual(codes(result.warnings), [
    'CONSTRAINT_UNKNOWN',
    'CONSTRAINT_UNKNOWN',
    'CONSTRAINT_UNKNOWN',
    'CONSTRAINT_UNKNOWN',
  ])
})

test('public validation rejects an unknown model', () => {
  const result = validateRequest('does-not-exist', { task: 'generate' })

  assert.equal(result.valid, false)
  assert.equal(result.errors[0].code, 'UNKNOWN_MODEL')
})
