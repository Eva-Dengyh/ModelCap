import assert from 'node:assert/strict'
import test from 'node:test'
import { validateRequest } from '../src/index.mjs'
import { validateModelRequest } from '../src/validate-request.mjs'

const model = {
  model_id: 'fixture-model',
  ability: { tasks: ['generate'] },
  input_limits: {
    max_reference_images: 1,
    reference_videos: { min: 1, max: 1 },
    max_reference_audios: 1,
    max_reference_materials: 2,
    image: {
      max_bytes: 1000,
      formats: ['png'],
      min_side_px: 256,
      max_side_px: 2048,
      min_ratio: 0.5,
      max_ratio: 2,
    },
    video: {
      min_duration_seconds: 2,
      max_duration_seconds: 10,
      formats: ['mp4'],
    },
    additional_prompt: { max_chars: 10 },
  },
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

test('rejects non-array input collections', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: {} },
  })

  assert.deepEqual(codes(result.errors), ['INVALID_PARAMETER_TYPE'])
})

test('rejects reference material counts over documented maxima', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{}, {}], reference_audios: [{}, {}] },
  })

  assert.deepEqual(codes(result.errors), ['INPUT_COUNT_EXCEEDED', 'INPUT_COUNT_EXCEEDED'])
})

test('rejects a supplied reference-video count outside its range', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_videos: [] },
  })

  assert.deepEqual(codes(result.errors), ['INPUT_COUNT_OUT_OF_RANGE'])
})

test('does not require optional reference videos when the input kind is omitted', () => {
  const result = validateModelRequest(model, { task: 'generate' })

  assert.equal(result.valid, true)
  assert.equal(result.errors.length, 0)
})

test('rejects total image and video materials over the documented maximum', () => {
  const totalLimited = structuredClone(model)
  totalLimited.input_limits.max_reference_images = 2
  totalLimited.input_limits.reference_videos = { min: 0, max: 2 }

  const result = validateModelRequest(totalLimited, {
    task: 'generate',
    inputs: {
      reference_images: [{}, {}],
      reference_videos: [{}],
    },
  })

  assert.deepEqual(codes(result.errors), ['TOTAL_MATERIALS_EXCEEDED'])
})

test('rejects an image over the documented byte limit', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 1001, format: 'png', width: 512, height: 512 }] },
  })

  assert.deepEqual(codes(result.errors), ['IMAGE_TOO_LARGE'])
})

test('normalizes image format case and rejects undocumented formats', () => {
  const accepted = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 900, format: 'PNG', width: 512, height: 512 }] },
  })
  const rejected = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 900, format: 'jpg', width: 512, height: 512 }] },
  })

  assert.equal(accepted.errors.length, 0)
  assert.deepEqual(codes(rejected.errors), ['IMAGE_FORMAT_NOT_ALLOWED'])
})

test('rejects image side and ratio violations independently', () => {
  const tooSmall = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 900, format: 'png', width: 200, height: 300 }] },
  })
  const tooLarge = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 900, format: 'png', width: 1800, height: 2050 }] },
  })
  const badRatio = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 900, format: 'png', width: 300, height: 1000 }] },
  })

  assert.deepEqual(codes(tooSmall.errors), ['IMAGE_SIDE_TOO_SMALL'])
  assert.deepEqual(codes(tooLarge.errors), ['IMAGE_SIDE_TOO_LARGE'])
  assert.deepEqual(codes(badRatio.errors), ['IMAGE_RATIO_OUT_OF_RANGE'])
})

test('rejects reference-video duration and format violations', () => {
  const duration = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_videos: [{ duration_seconds: 11, format: 'mp4' }] },
  })
  const format = validateModelRequest(model, {
    task: 'generate',
    inputs: { reference_videos: [{ duration_seconds: 5, format: 'mov' }] },
  })

  assert.deepEqual(codes(duration.errors), ['VIDEO_DURATION_OUT_OF_RANGE'])
  assert.deepEqual(codes(format.errors), ['VIDEO_FORMAT_NOT_ALLOWED'])
})

test('rejects an additional prompt over the documented character limit', () => {
  const result = validateModelRequest(model, {
    task: 'generate',
    additional_prompt: '12345678901',
  })

  assert.deepEqual(codes(result.errors), ['PROMPT_TOO_LONG'])
})

test('warns instead of rejecting when a supplied image fact has no constraint', () => {
  const unknownByteLimit = structuredClone(model)
  unknownByteLimit.input_limits.image = { max_bytes: null }

  const result = validateModelRequest(unknownByteLimit, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 500 }] },
  })

  assert.equal(result.valid, true)
  assert.deepEqual(codes(result.warnings), ['CONSTRAINT_UNKNOWN'])
  assert.equal(result.warnings[0].path, '$.inputs.reference_images[0].bytes')
})

test('warns instead of rejecting when required image metadata is absent', () => {
  const bytesOnly = structuredClone(model)
  bytesOnly.input_limits.image = { max_bytes: 1000 }

  const result = validateModelRequest(bytesOnly, {
    task: 'generate',
    inputs: { reference_images: [{}] },
  })

  assert.equal(result.valid, true)
  assert.deepEqual(codes(result.warnings), ['CONSTRAINT_UNKNOWN'])
  assert.equal(result.warnings[0].path, '$.inputs.reference_images[0].bytes')
})

test('warns when supplied image metadata has no documented image-limit block', () => {
  const withoutImageLimits = structuredClone(model)
  delete withoutImageLimits.input_limits.image

  const result = validateModelRequest(withoutImageLimits, {
    task: 'generate',
    inputs: { reference_images: [{ bytes: 500, format: 'png', width: 512, height: 512 }] },
  })

  assert.equal(result.valid, true)
  assert.deepEqual(codes(result.warnings), ['CONSTRAINT_UNKNOWN'])
  assert.equal(result.warnings[0].path, '$.inputs.reference_images[0]')
})
