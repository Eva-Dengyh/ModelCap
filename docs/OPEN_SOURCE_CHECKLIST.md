# Open Source Release Checklist

Use this before announcing ModelCap publicly or publishing a package.

## Repository

- README explains the project as a machine-readable AI video model capability catalog and conservative request validator.
- README avoids leaderboard or quality-ranking claims.
- `CONTRIBUTING.md` explains official-source-only contribution rules.
- `SECURITY.md` explains secret handling and vulnerability reporting.
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
npm run audit:sources
```

- `npm run ci` must pass before tagging or publishing.
- Review source-audit hash or redirect changes manually before advancing any `fetched_at`.
- Treat source-audit failures as review signals, not automatic data changes.

## npm Publish

- Decide whether the package name `modelcap-catalog` is available and final.
- Update `package.json` version intentionally.
- Confirm `npm pack --dry-run --json` includes only the public SDK, generated catalog files, README files, and licenses.
- Tag the release after CI passes.

## Announcement

- Say the project is focused on video-generation model integration.
- Mention the current model count from CI or the generated catalog.
- Invite official-source pull requests.
- Avoid claiming real-time freshness or complete market coverage.
