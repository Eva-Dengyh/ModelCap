# Open Source Release Checklist

Use this before announcing ModelCap publicly or publishing a package.

## Repository

- README explains the project as a machine-readable AI video model capability catalog and conservative request validator.
- README avoids leaderboard or quality-ranking claims.
- `CONTRIBUTING.md` explains official-source-only contribution rules.
- `SECURITY.md` explains secret handling and vulnerability reporting.
- `docs/API.md` and runnable `examples/` demonstrate the public SDK.
- `docs/CLI.md` documents the `modelcap` command.
- `docs/RELEASE.md` documents the release procedure.
- `docs/VERSIONING.md` explains SDK and catalog-data compatibility.
- `LICENSE` covers code and SDK tooling.
- `DATA_LICENSE.md` covers model entry data and generated catalog artifacts.

## Data

- Every committed model JSON passes schema validation.
- Every non-skeleton entry includes `source_url` and `fetched_at`.
- No `rankings` fields exist in JSON, markdown, or distribution artifacts.
- Unknown facts are `null` or explicitly marked with `_missing`.
- Markdown files are regenerated after model JSON changes.
- `dist/catalog.json`, `dist/index.json`, and `dist/catalog.d.ts` are regenerated.

## Verification

```bash
npm run ci
npm run release:check
npm run audit:sources
```

- `npm run ci` must pass before tagging or publishing.
- `npm run release:check` must pass before npm publishing or release tagging.
- Review source-audit hash or redirect changes manually before advancing any `fetched_at`.
- Treat source-audit failures as review signals, not automatic data changes.

## npm Publish

- Decide whether the package name `modelcap-catalog` is available and final.
- Update `package.json` version intentionally.
- Update `CHANGELOG.md` with user-visible SDK and catalog changes.
- Confirm `CHANGELOG.md` has a heading for the exact `package.json` version.
- Run `npm run typecheck` before publishing any SDK type changes.
- Run `npm run examples:check` before publishing documentation or example changes.
- Run `npm run release:check` before tagging or publishing.
- Confirm `npm pack --dry-run --json` includes only the public SDK, generated catalog files, README files, and licenses.
- Confirm `bin/modelcap.mjs`, `docs/CLI.md`, and runnable examples are included in the packed package.
- Confirm `DATA_LICENSE.md` is included in the packed package.
- Publish with npm provenance when possible:

```bash
npm publish --provenance
```

- Tag the release after CI passes.

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Announcement

- Say the project is focused on video-generation model integration.
- Mention the current model count from CI or the generated catalog.
- Invite official-source pull requests.
- Avoid claiming real-time freshness or complete market coverage.
