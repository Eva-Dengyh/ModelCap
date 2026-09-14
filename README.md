# ModelCap · AI Model Capability Catalog

[English](README.md) · [中文](README.zh-CN.md)

A machine-readable capability catalog and conservative request validator for AI video models — **one JSON entry per model version**, capturing parameter constraints, task differences, error-code attribution, and pricing for direct import by programs, plus human-readable rendered markdown.

> Why: every time you integrate a model you re-trip over the same pitfalls — wrong parameters, stale constraints, unreadable error codes. This repo turns that accumulated knowledge into structured data so no one has to relearn it.

ModelCap is for developers building model routers, AI video tools, provider SDK wrappers, or internal product forms. It is not a quality ranking system and does not claim to measure which model is "best."

## Structure

```
├── models/                 ← output: one json + md per model version (50)
├── dist/                   ← build artifacts: catalog.json / index.json / catalog.d.ts
├── src/                    ← zero-runtime-dependency Node.js SDK
├── update-history.json     ← change audit (added/changed/removed snapshots)
├── skill/                  ← entry & validation tooling
│   ├── SKILL.md            ← entry workflow
│   ├── schema/
│   │   └── model.schema.json   ← data format definition (single source of truth)
│   └── scripts/
│       ├── tools.mjs        ← validate / render
│       ├── validate-schema.mjs ← full JSON Schema validation
│       ├── check-fresh.mjs  ← freshness check
│       ├── audit-sources.mjs ← read-only source URL/hash audit
│       ├── build-dist.mjs   ← merge into dist/ artifacts
│       ├── build-history.mjs ← change audit
│       ├── backfill-meta.mjs ← backfill metadata
│       └── send-feishu.mjs  ← Feishu push (optional)
└── .github/workflows/      ← deterministic CI + scheduled source audit
```

## Tracked / Watched Models (video generation)

> A curated list of 20 notable model versions. **Category** is capability-based: Text-to-Video / Image-to-Video / Video Edit; a model may belong to several categories. See `models/` for the complete catalog.

| Model | Company | Category | One-liner |
| --- | --- | --- | --- |
| Veo 3.1 | Google DeepMind | Image-to-Video | Native audio and lip sync; broadly distributed through Gemini and YouTube |
| Kling 3.0 | Kuaishou | Text-to-Video, Image-to-Video, Video Edit | Large creator ecosystem with audio-video synchronization |
| Seedance 2.5 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | Native 30-second and multimodal joint generation |
| Seedance 2.0 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | Predecessor to 2.5; Fast and Mini are lighter variants |
| Runway Gen-4.5 | Runway | Text-to-Video, Image-to-Video | Professional film tooling and cinematic shot choreography |
| Hailuo H3 | MiniMax | Text-to-Video, Image-to-Video | Native 2K with first/last-frame and reference control |
| HappyHorse | Alibaba ATH | Text-to-Video, Image-to-Video | Generates 1080p video and audio in one pass |
| Wan 3.0 | Alibaba Cloud | Text-to-Video, Image-to-Video | Mature open-source ecosystem with native 30-second generation |
| HunyuanVideo 1.5 | Tencent | Text-to-Video, Image-to-Video | Lightweight open-source 8.3B model with a lower deployment barrier |
| CogVideoX | Zhipu | Text-to-Video, Image-to-Video, Video Edit | Early Chinese open-source video model with a broad developer ecosystem |
| PixVerse V6 | Aishi Technology | Text-to-Video, Image-to-Video, Video Edit | 15-second generation, native audio, and cinematic camera controls |
| Vidu Q2 | ShengShu + Tsinghua | Text-to-Video, Image-to-Video | Reference-to-video, audio-video synchronization, and lip control |
| Luma Ray 2 | Luma AI | Text-to-Video, Image-to-Video, Video Edit | Dream Machine successor with 1080p image-to-video support |
| Pika 2.2 | Pika Labs | Text-to-Video, Image-to-Video | First/last-frame control and effect templates |
| Firefly Video | Adobe | Text-to-Video, Image-to-Video | Trained on licensed data and integrated with Premiere and After Effects |
| Dreamina / Jimeng | ByteDance (CapCut) | Text-to-Video, Image-to-Video | Integrated short-video and digital-human creation |
| LTX-2 | Lightricks | Text-to-Video, Image-to-Video, Video Edit | Open-source real-time video generation with live preview |
| Mochi 1 | Genmo | Text-to-Video | Open-source video-generation model released in 2024 |
| Stable Video Diffusion | Stability AI | Image-to-Video | Early open-source image-to-video model |
| MAGI-1 | Sand.ai | Text-to-Video, Image-to-Video, Video Edit | Open-source autoregressive video model |

The directory contains additional model series. Incomplete entries use `_missing` explicitly until official parameter documentation is available.

## Usage

### Node.js SDK

The package is npm-compatible but is not claimed as published to the npm registry. Install it from GitHub:

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

const model = getModel('kling-2-6')
const imageModels = listModels({ task: 'generate', input: 'reference_image' })

const validation = validateRequest('kling-2-6', {
  task: 'generate',
  parameters: {
    duration: 5,
    resolution: '720p',
    aspect_ratio: '16:9',
    generate_audio: false,
  },
  inputs: {
    reference_images: [{
      bytes: 800_000,
      format: 'png',
      width: 1280,
      height: 720,
    }],
  },
})

if (!validation.valid) console.error(validation.errors)
if (validation.warnings.length) console.warn(validation.warnings)

const normalized = normalizeError('agnes-video-2-5', 400)
if (normalized) console.log(normalized.standard, normalized.user_message)
```

Validation rejects only explicit structured hard constraints. Missing or `null` facts produce warnings where possible; prose notes are never interpreted as executable rules. ModelCap does not send provider requests, manage credentials, retry calls, or rank output quality.

See [docs/API.md](docs/API.md) for the full public API and exported TypeScript types.

### Raw data and maintenance

Read `models/{model_id}.json` (programs) or `.md` (humans), or add the repository as a raw-data submodule:

```bash
git submodule add https://github.com/Eva-Dengyh/ModelCap.git libs/modelcap
```

Unified artifacts are available as `dist/catalog.json`, `dist/index.json`, and `dist/catalog.d.ts`.

```bash
npm test                 # SDK and tooling behavior
npm run typecheck        # TypeScript public type consumption
npm run examples:check   # runnable SDK examples
npm run validate:catalog # domain-specific catalog checks
npm run validate:schema  # full Draft 2020-12 schema checks
npm run build:check      # generated artifacts match model JSON
npm run ci               # complete deterministic pull-request gate
npm run audit:sources    # live URL metadata and body hashes as JSON
```

Source-audit HTTP changes and hashes are review signals, not proof that model facts changed. The audit never edits model JSON or advances `fetched_at`; the scheduled workflow uploads its report as an artifact for human review. `build-history.mjs` continues to generate the `update-history.json` data-change audit.

**Add a new model**: see [CONTRIBUTING.md](CONTRIBUTING.md) and [skill/SKILL.md](skill/SKILL.md) — use official provider documentation, write JSON per the schema, then validate and render with `skill/scripts/tools.mjs`.

## Capability dimensions

Each model entry describes capabilities along four dimensions:

| Dimension | Field | Values |
| --- | --- | --- |
| Task type | `ability.tasks` | generate, edit, extend |
| Input modality | `ability.inputs` | reference_image, reference_video, audio |
| Generation scene | `ability.scenes` | t2v, i2v-first-frame, i2v-first-last-frame, i2v-middle-frame, r2v |
| Special capability | `ability.capabilities` | lip-sync, multi-shot, camera-control |

## Conventions

- **JSON is the single source of truth**; markdown is a generated view — never hand-maintain a second copy.
- Missing fields are `null` with a `_missing` marker — **never fabricate**.
- Every entry carries `source_url` + `fetched_at` for traceability and freshness.
- Different versions in the same series (2.0 vs 2.5) often differ in parameters; keep separate entries.
- Third-party leaderboard ranks, scores, sample counts, and leaderboard prices are not stored.
- `rules.{task}.supported_parameters` lists the parameter names that task accepts (e.g. duration/resolution/generate_audio) for quick client-side feature detection.
- `rules.{task}.conditional_rules` stores documented context-specific constraints, such as 1080p-only duration limits or video-input total-duration caps.
- `pricing.observed_at` / `pricing.source` record when and where the price was seen — prices change, trust them.
- SDK compatibility and catalog-data compatibility are described in [docs/VERSIONING.md](docs/VERSIONING.md).

## Contributing

To add or fix a model entry, follow [skill/SKILL.md](skill/SKILL.md); output goes into `models/`, and `npm run ci` must pass.

## License

Code and tooling are MIT (see [LICENSE](LICENSE)). Model entry data is CC BY 4.0 (see [DATA_LICENSE.md](DATA_LICENSE.md)).
