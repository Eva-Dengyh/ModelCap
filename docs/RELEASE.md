# Release Guide

Use this guide when cutting a public ModelCap SDK release.

ModelCap releases cover two surfaces:

- the SDK and CLI API surface, versioned with semantic versioning;
- the catalog data artifacts, documented in the changelog when they affect model coverage or validation behavior.

## Before publishing

1. Confirm the package name and version in `package.json`.
2. Update `CHANGELOG.md` with a heading for the exact package version, for example `## 0.1.0 - 2026-09-14`.
3. Confirm public documentation is current:
   - `README.md`
   - `README.zh-CN.md`
   - `docs/API.md`
   - `docs/CLI.md`
   - `docs/VERSIONING.md`
4. Run the release gate:

```bash
npm run release:check
```

The release gate runs the full deterministic CI suite and checks release metadata. It does not publish anything.

## Publish to npm

Publish with provenance when the npm account and registry support it:

```bash
npm publish --provenance
```

If provenance is unavailable, document why in the GitHub Release notes before publishing without it.

## Tag the release

Tag only after the release gate passes and the intended package contents have been reviewed.

```bash
git tag v0.1.0
git push origin v0.1.0
```

Use the same version as `package.json`.

## Create the GitHub Release

Create a GitHub Release from the pushed tag. Include:

- the SDK and CLI changes from `CHANGELOG.md`;
- the current catalog model count from `npm run ci`;
- any material catalog-data changes;
- a note that ModelCap validates documented hard constraints but does not call providers or rank output quality.

## After publishing

Install the published package in a clean project and run a smoke test:

```bash
npm install modelcap-catalog
npx modelcap-catalog list --task generate
```

If the binary name is exposed as `modelcap`, also verify:

```bash
npx modelcap list --task generate
```

Do not advance `fetched_at` dates or change model facts as part of release bookkeeping unless official provider sources were reviewed.
