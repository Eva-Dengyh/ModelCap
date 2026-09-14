# Contributing to ModelCap

Thanks for helping make model integration less repetitive. ModelCap is intentionally conservative: it stores facts that developers can trace back to official sources and use in code.

## What Belongs Here

- AI video model capabilities, request constraints, error mappings, pricing snapshots, and source metadata.
- One JSON file per model version under `models/`.
- Generated markdown and `dist/` artifacts that match the JSON source.

## Source Rules

- Use official provider documentation, official SDKs, official API schemas, official model cards, or official pricing pages.
- Do not use third-party leaderboards, blog posts, videos, or benchmark claims as hard facts.
- If a fact is missing or unclear, write `null` and add `_missing` where the schema expects it.
- Do not infer undocumented limits from examples, UI labels, or provider marketing copy.
- Do not advance `fetched_at` unless you actually rechecked the official source.

## Data Rules

- `model_id` must match the JSON filename.
- Different model versions get separate entries.
- JSON is the source of truth. Markdown files and `dist/` are generated views.
- Hard request constraints belong in structured fields under `rules`.
- Context-specific hard constraints belong in `rules.{task}.conditional_rules`.
- Prose `note` fields may explain ambiguity, but validators must not depend on prose.
- Third-party ranking scores, ranks, sample counts, and leaderboard prices are not stored.

## Workflow

1. Read the existing model entries closest to the model or provider you are changing.
2. Update `models/{model_id}.json`.
3. Render the matching markdown:

```bash
node skill/scripts/tools.mjs render models/{model_id}.json
```

4. Rebuild distribution artifacts:

```bash
npm run build
```

5. Run the full gate:

```bash
npm run ci
```

## Pull Request Checklist

- The source is official and linked in `source_url`.
- `fetched_at` reflects a real source check.
- Unknown facts are represented as `null`, not guessed.
- Markdown and `dist/` were regenerated when JSON changed.
- `npm run ci` passes.
- The PR description names the model IDs changed and the official sources used.

## Security and Secrets

Never commit provider API keys, account IDs, private URLs, request logs with user data, or proprietary benchmark output. See [SECURITY.md](SECURITY.md).
