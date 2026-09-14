# ModelCap SDK API

ModelCap exposes a small ESM SDK for reading the catalog and validating requests before sending them to model providers.

```bash
npm install github:Eva-Dengyh/ModelCap
```

```js
import {
  getModel,
  listModels,
  normalizeError,
  validateRequest,
} from 'modelcap-catalog'
```

## getModel

```ts
function getModel(modelId: string): ModelEntry | undefined
```

Returns one immutable model entry by `model_id`.

```js
const model = getModel('wan-3.0')

if (model) {
  console.log(model.provider)
  console.log(model.ability.tasks)
}
```

Returns `undefined` when the model is not in the catalog.

## listModels

```ts
function listModels(filter?: ModelFilter): ModelEntry[]
```

Returns immutable model entries, optionally filtered by provider, task, input modality, or capability.

```js
const imageToVideoModels = listModels({
  task: 'generate',
  input: 'reference_image',
})

const cameraControlModels = listModels({
  capability: 'camera-control',
})
```

Filters are conjunctive: all supplied filters must match.

## validateRequest

```ts
function validateRequest(modelId: string, request: ModelRequest): ValidationResult
```

Validates a request against structured, documented model constraints.

```js
const result = validateRequest('wan-3.0', {
  task: 'generate',
  parameters: {
    duration: 12,
    resolution: '1080p',
    aspect_ratio: '16:9',
    generate_audio: true,
  },
  inputs: {
    reference_videos: [{
      duration_seconds: 20,
      format: 'mp4',
    }],
  },
})

if (!result.valid) {
  console.error(result.errors)
}

if (result.warnings.length > 0) {
  console.warn(result.warnings)
}
```

`errors` are explicit hard-constraint violations. `warnings` mean the catalog does not have enough structured information to reject the request safely.

Common error codes include:

- `UNKNOWN_MODEL`
- `UNSUPPORTED_TASK`
- `UNSUPPORTED_PARAMETER`
- `PARAMETER_NOT_ALLOWED_IN_CONTEXT`
- `DURATION_OUT_OF_RANGE`
- `RESOLUTION_NOT_ALLOWED`
- `ASPECT_RATIO_NOT_ALLOWED`
- `TOTAL_VIDEO_DURATION_EXCEEDED`
- `IMAGE_TOO_LARGE`
- `VIDEO_FORMAT_NOT_ALLOWED`

The validator does not interpret prose `note` fields as executable rules.

## normalizeError

```ts
function normalizeError(
  modelId: string,
  providerCode: string | number,
): NormalizedProviderError | undefined
```

Maps provider-specific error codes to stable standard categories when the mapping is documented.

```js
const normalized = normalizeError('seedance-1-5-pro', 'QuotaExceeded')

if (normalized) {
  console.log(normalized.standard)
  console.log(normalized.user_message)
}
```

Returns `undefined` when the model or provider code is unknown.

## TypeScript Types

The package exports public types for catalog consumers:

```ts
import type {
  ConditionalRule,
  InputLimits,
  ModelId,
  ModelEntry,
  ModelFilter,
  ModelRequest,
  NormalizedProviderError,
  OutputLimits,
  TaskRule,
  TaskRuleConstraints,
  ValidationIssue,
  ValidationResult,
} from 'modelcap-catalog'
```

The types are intentionally permissive where providers expose model-specific fields. Stable, commonly consumed fields are typed directly; unknown extension fields remain allowed.

`ModelId` is generated from the committed catalog:

```ts
import { validateRequest, type ModelId } from 'modelcap-catalog'

const modelId: ModelId = 'wan-3.0'

validateRequest(modelId, {
  task: 'generate',
  parameters: { duration: 5 },
})
```

Use `ModelId` when your application stores catalog-backed IDs and wants editor autocomplete. Keep plain `string` for user input or provider IDs that may not exist in ModelCap yet.

## Examples

Runnable examples live in `examples/`:

```bash
npm run examples:check
node examples/filter-models.mjs
node examples/validate-request.mjs
node examples/normalize-error.mjs
```

## Catalog Data

The same data is also available through JSON exports:

```js
import catalog from 'modelcap-catalog/catalog.json' with { type: 'json' }
import index from 'modelcap-catalog/index.json' with { type: 'json' }
```

`dist/catalog.json` contains full entries. `dist/index.json` contains a compact `model_id -> provider/version/fetched_at` lookup.
