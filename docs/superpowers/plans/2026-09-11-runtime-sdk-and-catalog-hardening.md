# ModelCap Runtime SDK and Catalog Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a zero-runtime-dependency Node.js SDK for catalog discovery, conservative request validation, and exact error normalization, backed by strict schema/build CI and a read-only scheduled source audit.

**Architecture:** The SDK is split into catalog lookup, request validation, and error normalization modules behind one ESM entry point. Runtime code reads the committed catalog and has no third-party dependencies; maintenance-only scripts use Ajv for full schema validation and native `fetch`/`crypto` for source auditing. Pull-request CI is deterministic, while network source checks run in a separate scheduled workflow and only publish evidence.

**Tech Stack:** Node.js 20+, ESM, `node:test`, Ajv Draft 2020-12, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-11-runtime-sdk-and-catalog-hardening-design.md`

## Global Constraints

- Support Node.js 20 or newer and ESM only.
- Use package name `modelcap-catalog` and initial version `0.1.0`.
- Keep SDK runtime code free of external dependencies.
- Treat JSON model entries as the sole source of truth; do not infer constraints from prose notes.
- A missing or `null` fact may cause a warning but must never cause a false hard rejection.
- Do not invoke providers, publish to npm, edit model facts automatically, or add model-quality rankings.
- Preserve existing JSON and Markdown consumption paths.

---

### Task 1: Package Surface and Immutable Catalog Lookup

**Files:**
- Create: `package.json`
- Create: `src/catalog.mjs`
- Create: `src/index.mjs`
- Create: `src/index.d.ts`
- Create: `test/catalog.test.mjs`
- Create: `package-lock.json` through `npm install`

**Interfaces:**
- Consumes: committed `dist/catalog.json`.
- Produces: `getModel(modelId)`, `listModels(filter?)`, immutable `ModelEntry` objects, and the base public TypeScript declarations used by later tasks.

- [ ] **Step 1: Write failing catalog API tests**

Create `test/catalog.test.mjs` with real-catalog tests:

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { getModel, listModels } from '../src/index.mjs'

test('getModel returns a known immutable model', () => {
  const model = getModel('kling-2-6')
  assert.equal(model.model_id, 'kling-2-6')
  assert.equal(Object.isFrozen(model), true)
  assert.equal(Object.isFrozen(model.ability), true)
})

test('getModel returns undefined for an unknown model', () => {
  assert.equal(getModel('does-not-exist'), undefined)
})

test('listModels filters without exposing the internal array', () => {
  const kling = listModels({ provider: 'kling', task: 'generate' })
  assert.ok(kling.length > 0)
  assert.ok(kling.every((model) => model.provider === 'kling'))
  assert.ok(kling.every((model) => model.ability.tasks.includes('generate')))

  const imageModels = listModels({ input: 'reference_image' })
  assert.ok(imageModels.length > 0)
  assert.ok(imageModels.every((model) => model.ability.inputs.includes('reference_image')))

  const lipSync = listModels({ capability: 'lip-sync' })
  assert.ok(lipSync.length > 0)
  assert.ok(lipSync.every((model) => model.ability.capabilities.includes('lip-sync')))

  kling.pop()
  assert.notEqual(listModels({ provider: 'kling', task: 'generate' }).length, kling.length)
})
```

- [ ] **Step 2: Run the tests and verify the missing-module failure**

Run: `node --test test/catalog.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/index.mjs`.

- [ ] **Step 3: Implement immutable catalog loading and filtering**

Create `src/catalog.mjs` with:

```js
import { readFileSync } from 'node:fs'

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  for (const child of Object.values(value)) deepFreeze(child)
  return Object.freeze(value)
}

const catalogUrl = new URL('../dist/catalog.json', import.meta.url)
const catalog = deepFreeze(JSON.parse(readFileSync(catalogUrl, 'utf8')))
const byId = new Map(catalog.map((model) => [model.model_id, model]))

export function getModel(modelId) {
  return byId.get(modelId)
}

export function listModels(filter = {}) {
  return catalog.filter((model) =>
    (!filter.provider || model.provider === filter.provider) &&
    (!filter.task || model.ability?.tasks?.includes(filter.task)) &&
    (!filter.input || model.ability?.inputs?.includes(filter.input)) &&
    (!filter.capability || model.ability?.capabilities?.includes(filter.capability)))
}
```

Create `src/index.mjs` initially with:

```js
export { getModel, listModels } from './catalog.mjs'
```

Create `src/index.d.ts` with exact base types for `Task`, `InputType`, `Capability`, `ModelEntry`, `ModelFilter`, `getModel`, and `listModels`. Use `Readonly`/`readonly` collections so the compile-time contract matches recursive runtime freezing. Keep open-ended catalog blocks such as `input_limits`, `rules`, and `output_limits` typed as `Readonly<Record<string, unknown>>` until Task 2 adds request-specific types.

Create `package.json` with:

```json
{
  "name": "modelcap-catalog",
  "version": "0.1.0",
  "description": "Machine-readable video model capabilities and conservative request validation",
  "type": "module",
  "engines": { "node": ">=20" },
  "exports": {
    ".": { "types": "./src/index.d.ts", "import": "./src/index.mjs" },
    "./catalog.json": "./dist/catalog.json",
    "./index.json": "./dist/index.json"
  },
  "files": ["src", "dist", "LICENSE", "README.md", "README.zh-CN.md"],
  "scripts": { "test": "node --test" },
  "license": "MIT"
}
```

Run `npm install --save-dev ajv@^8.17.1 ajv-formats@^3.0.1` to produce the locked development dependency set needed by Task 5.

- [ ] **Step 4: Run the catalog tests and complete test suite**

Run: `npm test`

Expected: all existing and new tests PASS with zero failures.

- [ ] **Step 5: Commit the package foundation**

```bash
git add package.json package-lock.json src/catalog.mjs src/index.mjs src/index.d.ts test/catalog.test.mjs
git commit -m "feat: add immutable catalog SDK"
```

---

### Task 2: Parameter and Task Request Validation

**Files:**
- Create: `src/validate-request.mjs`
- Create: `test/validate-request.test.mjs`
- Modify: `src/index.mjs`
- Modify: `src/index.d.ts`

**Interfaces:**
- Consumes: `getModel(modelId)` from `src/catalog.mjs`, a `ModelEntry`, and canonical `ModelRequest`.
- Produces: internal `validateModelRequest(model, request)` and public `validateRequest(modelId, request): ValidationResult`.

- [ ] **Step 1: Write failing tests for model, task, and parameter rules**

Create a focused fixture inside `test/validate-request.test.mjs` with `generate` rules containing `supported_parameters: ['duration', 'resolution', 'aspect_ratio', 'generate_audio']`, duration `{min: 4, max: 12, step: 4}`, resolutions `['720p']`, aspect ratios `['16:9']`, and `generate_audio: false`. Import `validateModelRequest` directly and assert separate tests for:

```js
assert.deepEqual(codes(validateModelRequest(model, { task: 'edit' }).errors), ['UNSUPPORTED_TASK'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { seed: 1 }
}).errors), ['UNSUPPORTED_PARAMETER'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { duration: 3 }
}).errors), ['DURATION_OUT_OF_RANGE'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { duration: 6 }
}).errors), ['DURATION_STEP_MISMATCH'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { resolution: '1080p' }
}).errors), ['RESOLUTION_NOT_ALLOWED'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { aspect_ratio: '9:16' }
}).errors), ['ASPECT_RATIO_NOT_ALLOWED'])
assert.deepEqual(codes(validateModelRequest(model, {
  task: 'generate', parameters: { generate_audio: true }
}).errors), ['AUDIO_GENERATION_NOT_SUPPORTED'])
```

Also assert that a fully valid request has `valid: true`, no errors, and that a rule with `duration_seconds: -1` rejects any client-supplied duration with `DURATION_SERVER_CONTROLLED`.

Add a public integration test:

```js
const result = validateRequest('does-not-exist', { task: 'generate' })
assert.equal(result.valid, false)
assert.equal(result.errors[0].code, 'UNKNOWN_MODEL')
```

- [ ] **Step 2: Run the validation tests and verify the missing-export failure**

Run: `node --test test/validate-request.test.mjs`

Expected: FAIL because `validateModelRequest` and `validateRequest` do not exist.

- [ ] **Step 3: Implement result and parameter validation**

In `src/validate-request.mjs`, implement the parameter checks completely:

```js
export function validateModelRequest(model, request) {
  const errors = []
  const warnings = []
  const finish = () => ({ valid: errors.length === 0, errors, warnings })

  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    errors.push(issue('INVALID_REQUEST', '$', 'request must be an object'))
    return finish()
  }

  const task = request.task
  if (!model.ability?.tasks?.includes(task)) {
    errors.push(issue('UNSUPPORTED_TASK', '$.task', 'task is not supported', model.ability?.tasks, task))
    return finish()
  }

  const rule = model.rules?.[task]
  const parameters = request.parameters ?? {}
  if (!rule) {
    warnings.push(issue('CONSTRAINT_UNKNOWN', '$.parameters', 'no task rules are documented'))
    return finish()
  }

  const supported = rule.supported_parameters
  for (const [name] of Object.entries(parameters)) {
    if (Array.isArray(supported) && !supported.includes(name)) {
      errors.push(issue('UNSUPPORTED_PARAMETER', `$.parameters.${name}`, 'parameter is not supported', supported, name))
    } else if (!Array.isArray(supported)) {
      warnings.push(issue('PARAMETER_SUPPORT_UNKNOWN', `$.parameters.${name}`, 'supported parameter list is not documented'))
    }
  }

  if (isPresent(parameters, 'duration')) {
    const value = parameters.duration
    const limit = rule.duration_seconds
    if (limit === undefined || limit === null) {
      warnings.push(issue('CONSTRAINT_UNKNOWN', '$.parameters.duration', 'duration constraint is not documented'))
    } else if (limit === -1) {
      errors.push(issue('DURATION_SERVER_CONTROLLED', '$.parameters.duration', 'duration is controlled by the provider', 'omit duration', value))
    } else if (!Number.isFinite(value)) {
      errors.push(issue('INVALID_PARAMETER_TYPE', '$.parameters.duration', 'duration must be a finite number', 'number', value))
    } else if ((limit.min != null && value < limit.min) || (limit.max != null && value > limit.max)) {
      errors.push(issue('DURATION_OUT_OF_RANGE', '$.parameters.duration', 'duration is outside the documented range', limit, value))
    } else if (limit.step != null && !matchesStep(value, limit.min ?? 0, limit.step)) {
      errors.push(issue('DURATION_STEP_MISMATCH', '$.parameters.duration', 'duration does not match the documented step', limit, value))
    }
  }

  if (isPresent(parameters, 'resolution')) {
    if (rule.resolution == null) {
      warnings.push(issue('CONSTRAINT_UNKNOWN', '$.parameters.resolution', 'resolution choices are not documented'))
    } else if (!rule.resolution.includes(parameters.resolution)) {
      errors.push(issue('RESOLUTION_NOT_ALLOWED', '$.parameters.resolution', 'resolution is not allowed', rule.resolution, parameters.resolution))
    }
  }

  if (isPresent(parameters, 'aspect_ratio')) {
    if (rule.aspect_ratio == null) {
      warnings.push(issue('CONSTRAINT_UNKNOWN', '$.parameters.aspect_ratio', 'aspect-ratio choices are not documented'))
    } else if (!rule.aspect_ratio.includes(parameters.aspect_ratio)) {
      errors.push(issue('ASPECT_RATIO_NOT_ALLOWED', '$.parameters.aspect_ratio', 'aspect ratio is not allowed', rule.aspect_ratio, parameters.aspect_ratio))
    }
  }

  if (parameters.generate_audio === true && rule.generate_audio === false) {
    errors.push(issue('AUDIO_GENERATION_NOT_SUPPORTED', '$.parameters.generate_audio', 'audio generation is explicitly unsupported', false, true))
  } else if (isPresent(parameters, 'generate_audio') && rule.generate_audio == null) {
    warnings.push(issue('CONSTRAINT_UNKNOWN', '$.parameters.generate_audio', 'audio-generation support is not documented'))
  }

  return finish()
}

export function validateRequest(modelId, request, findModel) {
  const model = findModel(modelId)
  if (!model) return {
    valid: false,
    errors: [issue('UNKNOWN_MODEL', '$.model_id', 'model is not in the catalog', undefined, modelId)],
    warnings: [],
  }
  return validateModelRequest(model, request)
}
```

Use these exact helper implementations above `validateModelRequest`:

```js
function issue(code, path, message, expected, actual) {
  return {
    code,
    path,
    message,
    ...(expected === undefined ? {} : { expected }),
    ...(actual === undefined ? {} : { actual })
  }
}

function isPresent(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function matchesStep(value, origin, step) {
  if (!Number.isFinite(step) || step <= 0) return true
  const steps = (value - origin) / step
  return Math.abs(steps - Math.round(steps)) <= 1e-9
}
```

The `else if` ordering is intentional: a single duration value receives the most specific applicable error instead of duplicate range and step errors. Keep collecting violations for unrelated parameters.

Wire the public wrapper in `src/index.mjs` so callers do not pass `findModel`:

```js
import { getModel } from './catalog.mjs'
import { validateRequest as validate } from './validate-request.mjs'

export { getModel, listModels } from './catalog.mjs'
export const validateRequest = (modelId, request) => validate(modelId, request, getModel)
```

Extend `src/index.d.ts` with exact `ModelRequest`, `ValidationIssue`, and `ValidationResult` definitions from the design, including the stable error-code string union exercised by tests.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test test/validate-request.test.mjs`

Expected: all focused tests PASS.

Run: `npm test`

Expected: entire suite PASS.

- [ ] **Step 5: Commit parameter validation**

```bash
git add src/validate-request.mjs src/index.mjs src/index.d.ts test/validate-request.test.mjs
git commit -m "feat: validate model task parameters"
```

---

### Task 3: Input Material and Prompt Validation

**Files:**
- Modify: `src/validate-request.mjs`
- Modify: `src/index.d.ts`
- Modify: `test/validate-request.test.mjs`

**Interfaces:**
- Consumes: `request.inputs`, `request.additional_prompt`, and `model.input_limits`.
- Produces: count and metadata validation appended to the same `ValidationResult` without changing the public call signature.

- [ ] **Step 1: Add failing input-limit tests**

Extend the fixture with:

```js
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
    max_ratio: 2
  },
  video: {
    min_duration_seconds: 2,
    max_duration_seconds: 10,
    formats: ['mp4']
  },
  additional_prompt: { max_chars: 10 }
}
```

Write separate assertions for `INPUT_COUNT_EXCEEDED`, `INPUT_COUNT_OUT_OF_RANGE`, `TOTAL_MATERIALS_EXCEEDED`, `IMAGE_TOO_LARGE`, `IMAGE_FORMAT_NOT_ALLOWED`, `IMAGE_SIDE_TOO_SMALL`, `IMAGE_SIDE_TOO_LARGE`, `IMAGE_RATIO_OUT_OF_RANGE`, `VIDEO_DURATION_OUT_OF_RANGE`, `VIDEO_FORMAT_NOT_ALLOWED`, and `PROMPT_TOO_LONG`. Use real arrays and metadata, not mocks.

Add a conservative-unknown test where an image has `{ bytes: 500 }` and the model's image limit has `max_bytes: null`; assert no error and a `CONSTRAINT_UNKNOWN` warning at the image bytes path. Add a missing-metadata test where a documented byte limit exists but an image omits `bytes`; assert a warning and no hard error.

- [ ] **Step 2: Run focused tests and verify input cases fail**

Run: `node --test test/validate-request.test.mjs`

Expected: the new cases FAIL because input limits are not enforced yet.

- [ ] **Step 3: Implement count, metadata, and prompt checks**

Add these focused functions inside `src/validate-request.mjs`:

```js
function warnUnknown(warnings, path, message) {
  warnings.push(issue('CONSTRAINT_UNKNOWN', path, message))
}

function validateInputCounts(limits, inputs, errors, hasReferenceVideos) {
  const images = inputs.reference_images ?? []
  const videos = inputs.reference_videos ?? []
  const audios = inputs.reference_audios ?? []
  const checks = [
    ['reference_images', images.length, limits.max_reference_images],
    ['reference_videos', videos.length, limits.max_reference_videos],
    ['reference_audios', audios.length, limits.max_reference_audios]
  ]
  for (const [name, count, max] of checks) {
    if (max != null && count > max) {
      errors.push(issue('INPUT_COUNT_EXCEEDED', `$.inputs.${name}`, `${name} exceeds the documented maximum`, max, count))
    }
  }
  if (hasReferenceVideos && limits.reference_videos) {
    const { min, max } = limits.reference_videos
    if ((min != null && videos.length < min) || (max != null && videos.length > max)) {
      errors.push(issue('INPUT_COUNT_OUT_OF_RANGE', '$.inputs.reference_videos', 'reference video count is outside the documented range', { min, max }, videos.length))
    }
  }
  const materialCount = images.length + videos.length
  if (limits.max_reference_materials != null && materialCount > limits.max_reference_materials) {
    errors.push(issue('TOTAL_MATERIALS_EXCEEDED', '$.inputs', 'image and video material count exceeds the documented maximum', limits.max_reference_materials, materialCount))
  }
}

function validateImages(limits, images, errors, warnings) {
  const imageLimits = limits.image
  if (!imageLimits) return
  images.forEach((image, index) => {
    const base = `$.inputs.reference_images[${index}]`
    if (image.bytes == null && imageLimits.max_bytes != null) warnUnknown(warnings, `${base}.bytes`, 'image byte size was not supplied')
    else if (image.bytes != null && imageLimits.max_bytes == null) warnUnknown(warnings, `${base}.bytes`, 'image byte limit is not documented')
    else if (image.bytes > imageLimits.max_bytes) errors.push(issue('IMAGE_TOO_LARGE', `${base}.bytes`, 'image exceeds the documented byte limit', imageLimits.max_bytes, image.bytes))

    if (image.format == null && Array.isArray(imageLimits.formats)) warnUnknown(warnings, `${base}.format`, 'image format was not supplied')
    else if (image.format != null && imageLimits.formats == null) warnUnknown(warnings, `${base}.format`, 'allowed image formats are not documented')
    else if (image.format != null && !imageLimits.formats.includes(String(image.format).toLowerCase())) errors.push(issue('IMAGE_FORMAT_NOT_ALLOWED', `${base}.format`, 'image format is not allowed', imageLimits.formats, image.format))

    const hasDimensions = Number.isFinite(image.width) && image.width > 0 && Number.isFinite(image.height) && image.height > 0
    if (!hasDimensions && [imageLimits.min_side_px, imageLimits.max_side_px, imageLimits.min_ratio, imageLimits.max_ratio].some((value) => value != null)) {
      warnUnknown(warnings, base, 'image dimensions were not supplied')
      return
    }
    if (!hasDimensions) return
    const minSide = Math.min(image.width, image.height)
    const maxSide = Math.max(image.width, image.height)
    const ratio = image.width / image.height
    if (imageLimits.min_side_px != null && minSide < imageLimits.min_side_px) errors.push(issue('IMAGE_SIDE_TOO_SMALL', base, 'image side is below the documented minimum', imageLimits.min_side_px, minSide))
    if (imageLimits.max_side_px != null && maxSide > imageLimits.max_side_px) errors.push(issue('IMAGE_SIDE_TOO_LARGE', base, 'image side exceeds the documented maximum', imageLimits.max_side_px, maxSide))
    if ((imageLimits.min_ratio != null && ratio < imageLimits.min_ratio) || (imageLimits.max_ratio != null && ratio > imageLimits.max_ratio)) errors.push(issue('IMAGE_RATIO_OUT_OF_RANGE', base, 'image ratio is outside the documented range', { min: imageLimits.min_ratio, max: imageLimits.max_ratio }, ratio))
  })
}

function validateVideos(limits, videos, errors, warnings) {
  const videoLimits = limits.video
  if (!videoLimits) return
  videos.forEach((video, index) => {
    const base = `$.inputs.reference_videos[${index}]`
    if (video.duration_seconds == null && (videoLimits.min_duration_seconds != null || videoLimits.max_duration_seconds != null)) warnUnknown(warnings, `${base}.duration_seconds`, 'reference video duration was not supplied')
    else if (video.duration_seconds != null && videoLimits.min_duration_seconds == null && videoLimits.max_duration_seconds == null) warnUnknown(warnings, `${base}.duration_seconds`, 'reference video duration limits are not documented')
    else if ((videoLimits.min_duration_seconds != null && video.duration_seconds < videoLimits.min_duration_seconds) || (videoLimits.max_duration_seconds != null && video.duration_seconds > videoLimits.max_duration_seconds)) errors.push(issue('VIDEO_DURATION_OUT_OF_RANGE', `${base}.duration_seconds`, 'reference video duration is outside the documented range', { min: videoLimits.min_duration_seconds, max: videoLimits.max_duration_seconds }, video.duration_seconds))

    if (video.format == null && Array.isArray(videoLimits.formats)) warnUnknown(warnings, `${base}.format`, 'reference video format was not supplied')
    else if (video.format != null && videoLimits.formats == null) warnUnknown(warnings, `${base}.format`, 'allowed reference video formats are not documented')
    else if (video.format != null && !videoLimits.formats.map((value) => value.toLowerCase()).includes(String(video.format).toLowerCase())) errors.push(issue('VIDEO_FORMAT_NOT_ALLOWED', `${base}.format`, 'reference video format is not allowed', videoLimits.formats, video.format))
  })
}

function validatePrompt(limits, prompt, errors, warnings) {
  if (prompt === undefined) return
  const max = limits.additional_prompt?.max_chars
  if (max == null) warnUnknown(warnings, '$.additional_prompt', 'additional prompt limit is not documented')
  else if (typeof prompt !== 'string') errors.push(issue('INVALID_PARAMETER_TYPE', '$.additional_prompt', 'additional prompt must be a string', 'string', prompt))
  else if (prompt.length > max) errors.push(issue('PROMPT_TOO_LONG', '$.additional_prompt', 'additional prompt exceeds the documented character limit', max, prompt.length))
}
```

Before calling the helpers, normalize and validate the input container with:

```js
const inputs = request.inputs == null ? {} : request.inputs
if (typeof inputs !== 'object' || Array.isArray(inputs)) {
  errors.push(issue('INVALID_PARAMETER_TYPE', '$.inputs', 'inputs must be an object', 'object', inputs))
} else {
  for (const name of ['reference_images', 'reference_videos', 'reference_audios']) {
    if (Object.hasOwn(inputs, name) && !Array.isArray(inputs[name])) {
      errors.push(issue('INVALID_PARAMETER_TYPE', `$.inputs.${name}`, `${name} must be an array`, 'array', inputs[name]))
    }
  }
  const safeInputs = {
    reference_images: Array.isArray(inputs.reference_images) ? inputs.reference_images : [],
    reference_videos: Array.isArray(inputs.reference_videos) ? inputs.reference_videos : [],
    reference_audios: Array.isArray(inputs.reference_audios) ? inputs.reference_audios : []
  }
  validateInputCounts(
    model.input_limits ?? {},
    safeInputs,
    errors,
    Object.hasOwn(inputs, 'reference_videos')
  )
  validateImages(model.input_limits ?? {}, safeInputs.reference_images, errors, warnings)
  validateVideos(model.input_limits ?? {}, safeInputs.reference_videos, errors, warnings)
}
validatePrompt(model.input_limits ?? {}, request.additional_prompt, errors, warnings)
```

The separate `hasReferenceVideos` boolean ensures the `reference_videos.min` constraint applies only when the caller supplied that input kind. Call the helpers after parameter checks so one invocation reports all independent violations. In `finish`, remove duplicate warnings with `new Map(warnings.map((item) => [`${item.code}:${item.path}`, item]))`. Audio has its own count but is intentionally excluded from `max_reference_materials`, matching that field's schema description. JavaScript string `.length` is the documented prompt character convention for version `0.1.0`.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test test/validate-request.test.mjs`

Expected: all parameter and input cases PASS.

Run: `npm test`

Expected: entire suite PASS.

- [ ] **Step 5: Commit input validation**

```bash
git add src/validate-request.mjs src/index.d.ts test/validate-request.test.mjs
git commit -m "feat: validate model input constraints"
```

---

### Task 4: Exact Provider Error Normalization

**Files:**
- Create: `src/normalize-error.mjs`
- Create: `test/normalize-error.test.mjs`
- Modify: `src/index.mjs`
- Modify: `src/index.d.ts`

**Interfaces:**
- Consumes: `getModel(modelId)` and a provider error code coercible to string.
- Produces: `normalizeError(modelId, providerCode): NormalizedProviderError | undefined`.

- [ ] **Step 1: Write failing normalization tests**

Use the committed `agnes-video-2-5` mapping for provider code `400`. Assert that string code `'400'` and numeric code `400` both resolve through exact string-key lookup, metadata keys never resolve, and unknown models/codes return `undefined`. Assert the returned object is a copy containing `provider_code`, `standard`, and `user_message`, so changing it cannot mutate the catalog.

Example shape:

```js
assert.deepEqual(normalizeError('agnes-video-2-5', 400), {
  provider_code: '400',
  standard: 'invalid_parameter',
  user_message: '请求参数缺失或不合法，或 mode/媒体组合错误、时长/比例不支持'
})
assert.equal(normalizeError('agnes-video-2-5', 'not-documented'), undefined)
assert.equal(normalizeError('does-not-exist', 400), undefined)
```

- [ ] **Step 2: Run the test and verify the missing-export failure**

Run: `node --test test/normalize-error.test.mjs`

Expected: FAIL because `normalizeError` is not exported.

- [ ] **Step 3: Implement exact lookup and public wiring**

Create `src/normalize-error.mjs`:

```js
export function normalizeModelError(model, providerCode) {
  const key = String(providerCode)
  if (key === 'note' || key.startsWith('_')) return undefined
  const mapped = model?.errors?.[key]
  if (!mapped || typeof mapped !== 'object' || !mapped.standard) return undefined
  return {
    provider_code: key,
    standard: mapped.standard,
    ...(mapped.user_message ? { user_message: mapped.user_message } : {})
  }
}
```

Wire `normalizeError` through `src/index.mjs` using `getModel`, and add `NormalizedProviderError` plus the standard-error string union to `src/index.d.ts`.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test test/normalize-error.test.mjs`

Expected: all normalization tests PASS.

Run: `npm test`

Expected: entire suite PASS.

- [ ] **Step 5: Commit error normalization**

```bash
git add src/normalize-error.mjs src/index.mjs src/index.d.ts test/normalize-error.test.mjs
git commit -m "feat: normalize documented provider errors"
```

---

### Task 5: Full Draft 2020-12 Schema Validation

**Files:**
- Create: `skill/scripts/validate-schema.mjs`
- Create: `test/validate-schema.test.mjs`
- Modify: `skill/schema/model.schema.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: `skill/schema/model.schema.json` and model JSON paths.
- Produces: `validateFiles(files): { valid, results }` for tests and a CLI with exit code 0/1.

- [ ] **Step 1: Write failing schema tests**

Create `test/validate-schema.test.mjs` that imports `validateFiles`, writes a temporary invalid entry derived from a real model but with `ability.tasks: ['invalid-task']`, and asserts its result is invalid with an error path containing `/ability/tasks/0`. Add a second test that validates every `models/*.json` file and expects success; before the schema correction this must expose the existing `output_limits.aspect_ratio_mode: null` mismatch.

- [ ] **Step 2: Run tests and verify both missing-module and catalog-schema failures**

Run: `node --test test/validate-schema.test.mjs`

Expected: first FAIL with `ERR_MODULE_NOT_FOUND`. After adding the validator implementation but before changing the schema, the all-model test must still FAIL on `models/kandinsky-5-0.json`, demonstrating the schema/data mismatch before the fix.

- [ ] **Step 3: Implement strict schema validation**

Create `skill/scripts/validate-schema.mjs` using:

```js
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
```

Compile the schema once with `{ allErrors: true, strict: false }`, add standard formats, parse every input file, run the compiled validator, and additionally verify `model_id === basename(file, '.json')`. Export `validateFiles`. Detect direct CLI execution with `fileURLToPath(import.meta.url) === resolve(process.argv[1])`, print each file result, and set `process.exitCode = 1` when any file fails. Parsing failures must be returned as structured invalid results instead of crashing the batch.

- [ ] **Step 4: Correct the nullable output-limit schema**

Change only this schema enum:

```json
"aspect_ratio_mode": {
  "enum": ["inherit_from_reference_video", "client_choice", null]
}
```

Do not change the verified Kandinsky model fact.

- [ ] **Step 5: Add stable package scripts and run validation**

Extend `package.json` scripts with:

```json
"validate:catalog": "node skill/scripts/tools.mjs validate models/*.json",
"validate:schema": "node skill/scripts/validate-schema.mjs models/*.json",
"check:fresh": "node skill/scripts/check-fresh.mjs --max-days 180",
"build": "node skill/scripts/build-dist.mjs"
```

Run: `node --test test/validate-schema.test.mjs`

Expected: invalid fixture is rejected and all 50 committed models pass.

Run: `npm run validate:catalog && npm run validate:schema`

Expected: both validators exit 0.

- [ ] **Step 6: Commit strict validation**

```bash
git add skill/scripts/validate-schema.mjs skill/schema/model.schema.json test/validate-schema.test.mjs package.json package-lock.json
git commit -m "feat: enforce full model schema validation"
```

---

### Task 6: Read-Only Source Audit

**Files:**
- Create: `skill/scripts/audit-sources.mjs`
- Create: `test/audit-sources.test.mjs`
- Create: `.github/workflows/audit-sources.yml`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Consumes: model `source_url`, optional `pricing.source`, native `fetch`, timeout, and concurrency options.
- Produces: `collectSources(entries)`, `auditUrls(sources, options)`, CLI JSON report, and a weekly workflow artifact.

- [ ] **Step 1: Write failing source collection and HTTP audit tests**

Create `test/audit-sources.test.mjs`. Use a local `node:http` server with routes for a 200 body plus `etag`, a redirect, a 404, and a delayed response. Tests must assert:

- duplicate source URLs merge their referring model IDs;
- pricing URLs are included;
- successful body SHA-256 equals `createHash('sha256').update(body).digest('hex')`;
- redirects report `redirected` and the final URL;
- 404 reports `client_error` without throwing;
- an `AbortSignal.timeout`-driven request reports `timeout`;
- maximum observed in-flight requests does not exceed configured concurrency.

- [ ] **Step 2: Run tests and verify the missing-module failure**

Run: `node --test test/audit-sources.test.mjs`

Expected: FAIL because `audit-sources.mjs` does not exist.

- [ ] **Step 3: Implement source collection, hashing, and bounded concurrency**

Create `skill/scripts/audit-sources.mjs` with these core functions, then add the CLI wrapper described below:

```js
import { createHash } from 'node:crypto'

export function collectSources(entries) {
  const collected = new Map()
  const add = (url, modelId, kind) => {
    if (typeof url !== 'string' || !url) return
    const current = collected.get(url) ?? { url, model_ids: new Set(), kinds: new Set() }
    current.model_ids.add(modelId)
    current.kinds.add(kind)
    collected.set(url, current)
  }
  for (const entry of entries) {
    add(entry.source_url, entry.model_id, 'model')
    add(entry.pricing?.source, entry.model_id, 'pricing')
  }
  return [...collected.values()]
    .map((item) => ({
      url: item.url,
      model_ids: [...item.model_ids].sort(),
      kinds: [...item.kinds].sort()
    }))
    .sort((a, b) => a.url.localeCompare(b.url))
}

async function auditOne(source, fetchImpl, timeoutMs) {
  const checkedAt = new Date().toISOString()
  try {
    const response = await fetchImpl(source.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'ModelCap-source-audit/0.1' }
    })
    const body = Buffer.from(await response.arrayBuffer())
    const status = response.status
    const outcome = status >= 500 ? 'server_error'
      : status >= 400 ? 'client_error'
        : response.redirected ? 'redirected' : 'ok'
    return {
      ...source,
      checked_at: checkedAt,
      outcome,
      status,
      final_url: response.url || source.url,
      etag: response.headers.get('etag'),
      last_modified: response.headers.get('last-modified'),
      body_sha256: createHash('sha256').update(body).digest('hex')
    }
  } catch (error) {
    const outcome = error?.name === 'TimeoutError' || error?.name === 'AbortError'
      ? 'timeout'
      : 'network_error'
    return {
      ...source,
      checked_at: checkedAt,
      outcome,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function auditUrls(sources, { fetchImpl = fetch, timeoutMs = 15000, concurrency = 5 } = {}) {
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new TypeError('timeoutMs must be a positive integer')
  if (!Number.isInteger(concurrency) || concurrency <= 0) throw new TypeError('concurrency must be a positive integer')
  const ordered = [...sources].sort((a, b) => a.url.localeCompare(b.url))
  const results = new Array(ordered.length)
  let cursor = 0
  async function worker() {
    while (cursor < ordered.length) {
      const index = cursor
      cursor += 1
      results[index] = await auditOne(ordered[index], fetchImpl, timeoutMs)
    }
  }
  const workerCount = Math.min(concurrency, Math.max(ordered.length, 1))
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}
```

The CLI supports `--output <path>`, `--timeout-ms <positive integer>`, and `--concurrency <positive integer>`. Parse named arguments with one loop, reject missing values and unknown flags, and call the same exported functions used by tests. Load sorted `models/*.json`, then create:

```js
{
  generated_at: new Date().toISOString(),
  summary: { total, ok, redirected, client_error, server_error, network_error, timeout },
  sources: results
}
```

Add `readFileSync`, `readdirSync`, `mkdirSync`, and `writeFileSync` from `node:fs`; `dirname`, `join`, and `resolve` from `node:path`; and `fileURLToPath` from `node:url`. Use this CLI structure:

```js
function parseArgs(args) {
  const options = { output: undefined, timeoutMs: 15000, concurrency: 5 }
  const names = { '--output': 'output', '--timeout-ms': 'timeoutMs', '--concurrency': 'concurrency' }
  for (let index = 0; index < args.length; index += 2) {
    const name = names[args[index]]
    const value = args[index + 1]
    if (!name || value === undefined) throw new TypeError(`invalid argument: ${args[index]}`)
    options[name] = name === 'output' ? value : Number(value)
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) throw new TypeError('--timeout-ms must be a positive integer')
  if (!Number.isInteger(options.concurrency) || options.concurrency <= 0) throw new TypeError('--concurrency must be a positive integer')
  return options
}

function summarize(results) {
  const summary = { total: results.length, ok: 0, redirected: 0, client_error: 0, server_error: 0, network_error: 0, timeout: 0 }
  for (const result of results) summary[result.outcome] += 1
  return summary
}

async function main(args) {
  const options = parseArgs(args)
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
  const modelDir = join(root, 'models')
  const entries = readdirSync(modelDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(modelDir, name), 'utf8')))
  const sources = await auditUrls(collectSources(entries), options)
  const report = { generated_at: new Date().toISOString(), summary: summarize(sources), sources }
  const json = `${JSON.stringify(report, null, 2)}\n`
  if (options.output) {
    const output = resolve(options.output)
    mkdirSync(dirname(output), { recursive: true })
    writeFileSync(output, json)
    console.log(JSON.stringify(report.summary))
  } else {
    process.stdout.write(json)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
```

URL-level failures remain report data and do not make the CLI exit nonzero; invalid arguments, unreadable catalog data, or report-write failures do.

- [ ] **Step 4: Add package command and scheduled workflow**

Add `source-audit-report.json` to `.gitignore` and add:

```json
"audit:sources": "node skill/scripts/audit-sources.mjs"
```

Create `.github/workflows/audit-sources.yml` with weekly Monday scheduling and `workflow_dispatch`, Node 20 setup, `npm ci`, execution to `source-audit-report.json`, and `actions/upload-artifact@v4` with a 30-day retention. Grant only `contents: read`.

- [ ] **Step 5: Run tests and a local deterministic CLI check**

Run: `node --test test/audit-sources.test.mjs`

Expected: all local-server cases PASS.

Run: `node skill/scripts/audit-sources.mjs --concurrency 0`

Expected: exit 1 with a clear positive-integer argument error, proving bad configuration cannot silently run.

Run: `npm test`

Expected: entire suite PASS without contacting external sources.

- [ ] **Step 6: Commit source auditing**

```bash
git add .gitignore .github/workflows/audit-sources.yml package.json skill/scripts/audit-sources.mjs test/audit-sources.test.mjs
git commit -m "feat: add read-only source auditing"
```

---

### Task 7: Reproducible Build, CI Gate, and Package Verification

**Files:**
- Create: `test/package.test.mjs`
- Modify: `skill/scripts/build-dist.mjs`
- Modify: `dist/catalog.d.ts`
- Modify: `.github/workflows/validate.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: all model JSON, SDK declarations, and package export metadata.
- Produces: deterministic dist artifacts and the single `npm run ci` gate.

- [ ] **Step 1: Write a failing package-surface test**

Create `test/package.test.mjs` that runs `npm pack --dry-run --json`, parses the JSON, and asserts the tarball contains `src/index.mjs`, `src/index.d.ts`, `dist/catalog.json`, `dist/index.json`, `LICENSE`, `README.md`, and `README.zh-CN.md`, while excluding `models/`, `test/`, `.github/`, and `.zcode/`. Assert the package name and version are `modelcap-catalog` and `0.1.0`. Read `package.json` and assert `scripts.ci` and `scripts['build:check']` equal the commands defined in Step 4; these assertions provide the intentional red failure before the reproducible-build gate exists.

- [ ] **Step 2: Run the package test and verify the expected surface failure**

Run: `node --test test/package.test.mjs`

Expected: FAIL because `scripts.ci` and `scripts.build:check` do not exist yet; any missing declaration or accidental package file is also reported.

- [ ] **Step 3: Make generated declarations and builds deterministic**

Update `skill/scripts/build-dist.mjs` so `dist/catalog.d.ts` describes the same `ModelEntry` shape exported by `src/index.d.ts` without duplicating incompatible definitions. The generated file may re-export the type:

```ts
export type { ModelEntry } from '../src/index.js'
declare const catalog: readonly import('../src/index.js').ModelEntry[]
export default catalog
```

Keep model ordering by `model_id`, index key insertion order by that sorted catalog, two-space JSON formatting, and a trailing newline. Run the build once and commit all resulting dist changes.

- [ ] **Step 4: Define the complete local CI command**

Add scripts:

```json
"build:check": "npm run build && git diff --exit-code -- dist",
"pack:check": "npm pack --dry-run --json",
"ci": "npm test && npm run validate:catalog && npm run validate:schema && npm run check:fresh && npm run build:check && npm run pack:check"
```

Run: `node --test test/package.test.mjs`

Expected: package surface test PASS.

- [ ] **Step 5: Replace the deterministic validation workflow**

Update `.github/workflows/validate.yml` to use `permissions: contents: read`, checkout, Node 20 with npm cache, `npm ci`, and one named `npm run ci` step. Keep `push` and `pull_request` triggers. Do not run the network source audit in this workflow.

- [ ] **Step 6: Run the complete CI gate**

Run: `npm run ci`

Expected: all tests and both validators pass, all 50 entries are fresh under 180 days, generated dist has no diff, and package dry-run succeeds.

- [ ] **Step 7: Commit build and CI hardening**

```bash
git add package.json package-lock.json skill/scripts/build-dist.mjs dist/catalog.json dist/index.json dist/catalog.d.ts test/package.test.mjs .github/workflows/validate.yml
git commit -m "ci: enforce reproducible catalog releases"
```

---

### Task 8: Consumer and Maintainer Documentation

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

**Interfaces:**
- Consumes: final SDK and maintenance commands.
- Produces: matching English and Chinese usage documentation.

- [ ] **Step 1: Add SDK installation and lookup examples to both READMEs**

Document local Git dependency installation without claiming npm publication:

```bash
npm install github:Eva-Dengyh/ModelCap
```

Add a runnable ESM example:

```js
import { getModel, listModels } from 'modelcap-catalog'

const model = getModel('kling-2-6')
const imageModels = listModels({ task: 'generate', input: 'reference_image' })
```

- [ ] **Step 2: Document request validation and error normalization**

Add one canonical request example showing `task`, `parameters`, image metadata, and checking both `errors` and `warnings`. Add one exact `normalizeError` example that handles `undefined`. State explicitly that ModelCap validates documented constraints but does not send provider requests, manage credentials, retry requests, or rank output quality.

- [ ] **Step 3: Document strict maintenance commands and source-audit meaning**

Document `npm test`, `npm run validate:schema`, `npm run build:check`, `npm run ci`, and `npm run audit:sources`. Explain that source hashes and HTTP changes are review signals, not automatic proof that catalog facts are outdated, and that the audit never updates `fetched_at`.

- [ ] **Step 4: Verify examples and bilingual consistency**

Run every JavaScript README example as a temporary `.mjs` snippet against the local package entry. Search both READMEs for the four public function names and all maintenance commands, confirming neither language omits a capability or limitation.

Run: `npm run ci`

Expected: complete CI gate PASS after documentation edits.

- [ ] **Step 5: Commit documentation**

```bash
git add README.md README.zh-CN.md
git commit -m "docs: document runtime SDK and maintenance gates"
```

---

### Task 9: Final Requirement Verification

**Files:**
- Verify only; modify files only if a failing requirement exposes a defect.

**Interfaces:**
- Consumes: the design success criteria and all implementation outputs.
- Produces: fresh verification evidence and a clean, reviewable branch.

- [ ] **Step 1: Run the complete automated gate from a clean dependency install**

Run: `npm ci && npm run ci`

Expected: exit 0 with zero failed tests, both validators successful, 50 fresh entries, no generated diff, and a successful package dry-run.

- [ ] **Step 2: Verify runtime behavior from the package root**

Run a Node ESM smoke script that imports the package by its root path, finds `kling-2-6`, lists image-generation models, rejects an invalid Kling resolution, accepts a documented valid request, and normalizes one known provider error. Assert all results with `node:assert/strict`.

- [ ] **Step 3: Verify source audit without relying on public internet**

Run: `node --test test/audit-sources.test.mjs`

Expected: local-server source audit tests PASS, including timeout and bounded concurrency.

- [ ] **Step 4: Inspect repository scope and generated cleanliness**

Run: `git diff --check && git status --short && git log --oneline -10`

Expected: no whitespace errors; only the user's pre-existing untracked `.zcode/` remains outside committed work; commits correspond to the tasks above.

- [ ] **Step 5: Review the implementation against every design success criterion**

Confirm explicitly:

- all four public SDK functions are exported and typed;
- hard violations return stable errors while unknown facts return warnings;
- all committed models pass Draft 2020-12 validation;
- deterministic CI covers tests, schema, freshness, dist, and packaging;
- source auditing is scheduled, read-only, and artifact-based;
- existing JSON and Markdown files remain consumable.

If any item is false, do not claim completion; return to the responsible task, add a failing test when behavior changes, fix it, and rerun the full gate.
