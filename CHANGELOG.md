# Changelog

All notable changes to ModelCap will be documented in this file.

ModelCap follows semantic versioning for the SDK API surface. Catalog data changes are listed when they materially change validation behavior, model coverage, pricing fields, or error mappings.

## 0.1.0 - 2026-09-14

Initial public SDK-ready release.

### Added

- Machine-readable catalog for 50 AI video model versions.
- Zero-runtime-dependency Node.js SDK exports:
  - `getModel`
  - `listModels`
  - `validateRequest`
  - `normalizeError`
- Conservative request validation for documented hard constraints.
- Conditional request rules for context-specific constraints such as resolution-specific durations, video-input total-duration caps, and context-forbidden parameters.
- Provider error-code normalization into stable standard categories.
- Generated distribution artifacts:
  - `dist/catalog.json`
  - `dist/index.json`
  - `dist/catalog.d.ts`
- JSON Schema validation, catalog validation, source freshness checks, build checks, type checks, and package dry-run checks.
- Open-source contribution, security, data license, and issue-template documentation.

### Policy

- JSON model entries are the source of truth.
- Markdown model pages and `dist/` artifacts are generated.
- Official provider sources are required for hard facts.
- Unknown or undocumented facts stay `null` instead of being inferred.
- Third-party leaderboard ranks, scores, sample counts, and leaderboard prices are not stored.

### Not Included

- Provider API calls.
- Credential management.
- Queueing, retries, callbacks, billing, or model gateway orchestration.
- Output quality ranking.
