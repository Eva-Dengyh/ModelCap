# ModelCap · AI Model Capability Catalog

[English](README.md) · [中文](README.zh-CN.md)

A machine-readable knowledge base of AI model capabilities — **one JSON entry per model version**, capturing parameter constraints, task differences, error-code attribution, and pricing for direct import and validation by programs, plus human-readable rendered markdown.

> Why: every time you integrate a model you re-trip over the same pitfalls — wrong parameters, stale constraints, unreadable error codes. This repo turns that accumulated knowledge into structured data so no one has to relearn it.

## Structure

```
├── models/                 ← output: one json + md per model version (50)
├── dist/                   ← build artifacts: catalog.json / index.json / catalog.d.ts
├── update-history.json     ← change audit (added/changed/removed snapshots)
├── skill/                  ← entry & validation tooling
│   ├── SKILL.md            ← entry workflow
│   ├── schema/
│   │   └── model.schema.json   ← data format definition (single source of truth)
│   └── scripts/
│       ├── tools.mjs        ← validate / render
│       ├── check-fresh.mjs  ← freshness check
│       ├── build-dist.mjs   ← merge into dist/ artifacts
│       ├── build-history.mjs ← change audit
│       ├── backfill-meta.mjs ← backfill metadata
│       └── send-feishu.mjs  ← Feishu push (optional)
└── .github/workflows/      ← CI: validate + freshness + build
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

**Look up a model**: read `models/{model_id}.json` (programs) or `.md` (humans).

**Integrate into another project**: pull this repo in as a data source and read the JSON.

```bash
git submodule add https://github.com/Eva-Dengyh/ModelCap.git libs/modelcap
```

```python
import json
d = json.load(open("libs/modelcap/models/kling-v2-6.json"))
rules = d["rules"]["generate"]

# 1. Validate params (constraints differ per task, e.g. edit duration forced to -1)
if s < rules["duration_seconds"]["min"] or s > rules["duration_seconds"]["max"]:
    raise ValueError("duration out of range")

# 2. Normalize errors: vendor code → standard semantic
standard = d["errors"].get(vendor_code, {}).get("standard")

# 3. Model selection / pricing: combine ability, rules, and pricing (vendor billing)
```

**Consume unified artifacts**: `dist/catalog.json` (full merged catalog), `dist/index.json` (model_id index), `dist/catalog.d.ts` (TS types), generated by `node skill/scripts/build-dist.mjs`.

**Validate data**: `node skill/scripts/tools.mjs validate models/*.json`; use `skill/schema/model.schema.json` with a JSON Schema library (ajv / jsonschema) for type checking.

**Maintenance tools**: `check-fresh.mjs` flags stale `fetched_at`; `build-history.mjs` generates the `update-history.json` change audit; CI lives in `.github/workflows/validate.yml`.

**Add a new model**: see [skill/SKILL.md](skill/SKILL.md) — open official docs with AI, write JSON per the schema, then validate and render with `skill/scripts/tools.mjs`.

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
- `pricing.observed_at` / `pricing.source` record when and where the price was seen — prices change, trust them.

## Contributing

To add or fix a model entry, follow [skill/SKILL.md](skill/SKILL.md); output goes into `models/`, and `node skill/scripts/tools.mjs validate models/*.json` must pass.

## License

Code and tooling MIT; model entry data CC BY 4.0 (see [LICENSE](LICENSE)).
