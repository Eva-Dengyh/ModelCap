# ModelCap Runtime SDK and Catalog Hardening Design

## Goal

Turn ModelCap from a static collection of model facts into a small, dependable Node.js capability library without turning it into a provider gateway. Consumers should be able to discover models, validate a canonical request against documented hard constraints, and normalize known provider errors. Maintainers should get strict schema checks, reproducible generated artifacts, and a safe report about source health.

## Scope

This change adds four connected capabilities:

1. A zero-runtime-dependency ESM SDK for catalog lookup, request validation, and error normalization.
2. Full Draft 2020-12 JSON Schema validation in development and CI.
3. Reproducible builds and CI checks for tests, schema validity, freshness, and committed generated artifacts.
4. A read-only source audit that records HTTP metadata and content hashes without modifying model facts.

Actual provider invocation, authentication, retries, billing, model-quality ranking, automatic edits, and automatic publishing to npm are out of scope.

## Supported Environment and Packaging

- Node.js 20 or newer.
- ESM only.
- Package name: `modelcap-catalog`.
- Initial package version: `0.1.0`.
- Runtime code has no external dependencies.
- Ajv and `ajv-formats` are development dependencies used only for full schema validation.
- The package exports the SDK, `dist/catalog.json`, `dist/index.json`, and public TypeScript declarations.
- The repository becomes npm-pack-compatible, but this change does not publish the package or require registry credentials.

## Public SDK

The public module exports:

```ts
getModel(modelId: string): ModelEntry | undefined

listModels(filter?: {
  provider?: string
  task?: 'generate' | 'edit' | 'extend'
  input?: 'reference_video' | 'reference_image' | 'audio'
  capability?: 'lip-sync' | 'multi-shot' | 'camera-control'
}): ModelEntry[]

validateRequest(
  modelId: string,
  request: ModelRequest
): ValidationResult

normalizeError(
  modelId: string,
  providerCode: string | number
): NormalizedProviderError | undefined
```

The canonical request shape is deliberately provider-neutral:

```ts
interface ModelRequest {
  task: 'generate' | 'edit' | 'extend'
  parameters?: {
    duration?: number
    resolution?: string
    aspect_ratio?: string
    generate_audio?: boolean
    [name: string]: unknown
  }
  inputs?: {
    reference_images?: Array<{
      bytes?: number
      format?: string
      width?: number
      height?: number
    }>
    reference_videos?: Array<{
      duration_seconds?: number
      format?: string
    }>
    reference_audios?: unknown[]
  }
  additional_prompt?: string
}
```

`ValidationResult` contains `valid`, `errors`, and `warnings`. Every issue has a stable `code`, JSON-style `path`, human-readable `message`, and optional `expected` and `actual` values. Errors mean a documented hard constraint was violated. Warnings mean the catalog cannot prove whether a value is valid.

## Validation Semantics

Validation is conservative and deterministic:

- Reject an unknown model or unsupported task.
- Reject a parameter not listed in `supported_parameters` when that list exists. When the list is absent, emit a warning instead of rejecting the parameter.
- Enforce documented duration ranges, steps, and the special fixed `-1` mode.
- Enforce documented resolution and aspect-ratio choices.
- Reject `generate_audio: true` only when the task rule explicitly says audio generation is unsupported.
- Enforce reference image, video, audio, and total-material counts when limits exist.
- Enforce documented image bytes, format, side length, and aspect-ratio bounds when corresponding metadata is supplied.
- Enforce documented reference-video duration and format bounds when corresponding metadata is supplied.
- Enforce the additional prompt character limit when known.
- Never invent a constraint from prose notes. Missing or `null` constraints produce warnings only when they prevent checking a supplied value.
- Return all issues in one pass and never mutate the request or catalog.

Error normalization performs an exact string-key lookup in the selected model's `errors` map. Metadata keys such as `note` and `_missing` are ignored. Unknown model IDs or provider codes return `undefined`; the SDK does not guess a standard error category.

## Internal Structure

- `src/catalog.mjs` owns catalog loading, indexing, lookup, and filtering.
- `src/validate-request.mjs` owns canonical request validation and issue construction.
- `src/normalize-error.mjs` owns provider error lookup.
- `src/index.mjs` is the public export surface.
- `src/index.d.ts` contains the public API types.
- `test/*.test.mjs` exercises public behavior with the real catalog plus focused fixtures where edge cases require them.
- `skill/scripts/validate-schema.mjs` validates every model with Ajv and checks that `model_id` matches its filename.
- `skill/scripts/audit-sources.mjs` performs the read-only source audit.

Catalog data remains in `dist/catalog.json`. The Node-only SDK loads it synchronously once, recursively freezes every entry, and builds an in-memory index. Returned arrays are new arrays and their model entries cannot be mutated, so one consumer cannot corrupt later lookups.

## Schema Correction

`output_limits.aspect_ratio_mode` already uses `null` in a verified model entry to represent an unknown official limit. The schema will explicitly allow `null`, matching the surrounding catalog convention. This fixes the current Kandinsky validation failure without inventing data.

## Source Audit

The source audit accepts all model `source_url` and `pricing.source` URLs, deduplicates them, and checks them with bounded concurrency and a configurable timeout. It records:

- URL and referring model IDs.
- Check timestamp.
- Final URL and HTTP status.
- `etag` and `last-modified` when supplied.
- SHA-256 of the response body when a body can be fetched.
- A stable outcome: `ok`, `redirected`, `client_error`, `server_error`, `network_error`, or `timeout`.

HTTP status changes and body-hash changes are evidence for review, not proof that model facts changed. The script therefore writes a report and summary but never changes model JSON, `fetched_at`, Markdown, or history. A scheduled weekly GitHub Actions job uploads the JSON report as an artifact. URL failures are visible in the report but do not fail normal pull-request CI; malformed catalog inputs or script failures do.

## Build and CI

`package.json` exposes stable scripts for tests, custom validation, full schema validation, freshness checking, distribution generation, source auditing, and the complete CI sequence.

Pull-request and push CI will:

1. Install locked development dependencies with `npm ci`.
2. Run all Node tests.
3. Run the existing domain-specific validator.
4. Run full JSON Schema validation with format checks.
5. Check the 180-day freshness policy.
6. Rebuild distribution artifacts.
7. Fail if tracked generated artifacts differ after rebuilding.
8. Run `npm pack --dry-run` so the declared package surface stays publishable.

The source-audit workflow runs separately on a weekly schedule and by manual dispatch because network reachability is not deterministic enough for pull-request gating.

## History and Releases

The existing `update-history.json` remains the data-change audit. SDK and tooling changes are represented by Git history and semantic package versions. Version `0.1.0` signals that the public API is usable but may still evolve before `1.0.0`. Publishing and automated version bumps are intentionally deferred until the owner chooses a registry and release policy.

## Testing Strategy

Implementation follows red-green-refactor. Tests cover:

- Lookup and each list filter.
- Unknown models and unsupported tasks.
- Parameter allow-list behavior.
- Duration range, step, fixed `-1`, resolution, aspect ratio, and audio flags.
- Material counts and supplied image/video/prompt metadata.
- Unknown constraints producing warnings instead of false rejection.
- Exact provider-error normalization and unknown-code behavior.
- Full-schema success for all committed model files and a failing invalid fixture.
- Source-audit deduplication, redirects, hashes, HTTP failures, and timeouts using a local HTTP server.
- Reproducible dist generation and package dry-run.

## Documentation

Both README files will gain a minimal SDK example, the canonical request shape, validation-result behavior, source-audit usage, and a clear statement that ModelCap does not invoke providers. Generated model Markdown remains unchanged except where an underlying model fact changes.

## Success Criteria

- A Node.js consumer can install or reference the repository and call all four public SDK functions.
- Explicitly invalid requests produce stable machine-readable errors; unknown catalog facts never create false hard failures.
- Every committed model passes full Draft 2020-12 schema validation.
- CI detects failing tests, schema drift, stale entries, stale generated output, and broken package metadata.
- The scheduled source audit produces a reviewable artifact without modifying catalog facts.
- Existing JSON and Markdown consumers continue to work.
