# ModelCap · AI Model Capability Catalog

[English](README.md) · [中文](README.zh-CN.md)

A machine-readable knowledge base of AI model capabilities — **one JSON entry per model version**, capturing parameter constraints, task differences, error-code attribution, and pricing for direct import and validation by programs, plus human-readable rendered markdown.

> Why: every time you integrate a model you re-trip over the same pitfalls — wrong parameters, stale constraints, unreadable error codes. This repo turns that accumulated knowledge into structured data so no one has to relearn it.

## Structure

```
├── models/                 ← output: one json + md per model version
│   ├── doubao-seedance-2-5-260628.{json,md}
│   └── doubao-seedance-2-0-260128.{json,md}
└── skill/                  ← entry tooling (for AI)
    ├── SKILL.md            ← entry workflow
    ├── schema/
    │   └── model.schema.json   ← data format definition (single source of truth)
    └── scripts/
        ├── tools.mjs       ← validate / render
        └── send-feishu.mjs ← Feishu push (optional)
```

## Tracked / Watched Models (video generation)

> Curated heat-ranked shortlist of 20 video-generation entries. The **Category** column splits them by capability — Text-to-Video / Image-to-Video / Video Edit; a model may belong to several categories, listed in one cell. The last column is the 2026-09-02 leaderboard snapshot (AA Elo / LMArena Arena score; two different scales — not comparable).

| Rank | Model | Company | Category | One-liner | Leaderboard (2026-09-02) |
| --- | --- | --- | --- | --- | --- |
| 1 | Veo 3.1 | Google DeepMind | Image-to-Video | Quality ceiling; native audio + lip sync; massive distribution via Gemini/YouTube | AA Elo 1086 · $24/min |
| 2 | Kling 3.0 | Kuaishou | Text-to-Video, Image-to-Video, Video Edit | Largest user base (60M+ creators, ~$240M ARR); audio-video sync | AA Elo 1071 (1080p Pro) · $20.16/min |
| 3 | Seedance 2.5 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | Released late Jul 2026; native 30s + multi-modal joint generation; even adopted by Runway | LMArena 1483 (i2v) |
| 4 | Seedance 2.0 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | 2.5's predecessor main model; Fast/Mini are lighter variants in the series | AA Elo 1190 · $9.07/min |
| 5 | Runway Gen-4.5 | Runway | Text-to-Video, Image-to-Video | Top Western pro film tooling; cinematic shot choreography; Hollywood adoption | LMArena 1224 (t2v) |
| 6 | Hailuo H3 | MiniMax | Text-to-Video, Image-to-Video | Native 2K + first/last-frame & reference control; great value; once topped VBench | AA Elo 1186 · $7.80/min · open weights |
| 7 | HappyHorse | Alibaba ATH | Text-to-Video, Image-to-Video | 2026 open-source dark horse; outputs 1080p video + audio in one pass; Arena #1 | AA Elo 1087 · $13.20/min |
| 8 | Wan 3.0 | Alibaba Cloud | Text-to-Video, Image-to-Video | Open-source ecosystem king (34k+ GitHub stars); native 30s | AA Elo 1237 · $12/min |
| 9 | HunyuanVideo 1.5 | Tencent | Text-to-Video, Image-to-Video | Lightweight open-source benchmark (8.3B); low deployment barrier | LMArena 1197 (i2v) |
| 10 | CogVideoX | Zhipu | Text-to-Video, Image-to-Video, Video Edit | Among the earliest Chinese open-source video models; wide dev ecosystem | — |
| 11 | PixVerse V6 | Aishi Technology | Text-to-Video, Image-to-Video, Video Edit | 15s + native audio + 20+ cinematic camera controls; strong overseas traction | AA Elo 1068 · $6.90/min |
| 12 | Vidu Q2 | ShengShu + Tsinghua | Text-to-Video, Image-to-Video | Reference-to-video pioneer; audio-video sync; lip-sync error ±15ms | LMArena 1243 (q2 turbo) |
| 13 | Luma Ray 2 | Luma AI | Text-to-Video, Image-to-Video, Video Edit | Dream Machine successor; strong 1080p image-to-video | LMArena 1108 (i2v) |
| 14 | Pika 2.2 | Pika Labs | Text-to-Video, Image-to-Video | Consumer pioneer; first/last-frame + effect templates; hype cooled | LMArena 1008 (t2v) |
| 15 | Firefly Video | Adobe | Text-to-Video, Image-to-Video | Commercially safe (licensed data); deep Premiere/AE integration | — |
| 16 | Dreamina / Jimeng | ByteDance (CapCut) | Text-to-Video, Image-to-Video | Rides CapCut's huge user base; short video + digital human | — (listed under the Seedance series; see rows 3–4) |
| 17 | LTX-2 | Lightricks | Text-to-Video, Image-to-Video, Video Edit | Open-source real-time video; leading real-time preview | AA Elo 930 (Fast) · $2.40/min |
| 18 | Mochi 1 | Genmo | Text-to-Video | 2024 open-source pioneer; now marginalized | LMArena 1006 (t2v) |
| 19 | Stable Video Diffusion | Stability AI | Image-to-Video | Open-source trailblazer, but company pivoted to audio; video line stalled | — |
| 20 | MAGI-1 | Sand.ai | Text-to-Video, Image-to-Video, Video Edit | Open-source autoregressive video model; scaled autoregressive route | — (MAGI-2 Preview is added to `models/`) |

> **Snapshot note (2026-09-02).** AA = Elo; LMArena = Arena score (different scales — not comparable). Prices are AA's "1 min 1080p video via creator API" convention (may differ across boards). Row-level detail (rank, CI, samples, release date, open weights, per-board URL) lives in each `models/*.json` under `rankings`, rendered into the model's `.md`. Beyond the 20 curated models, a further 30 leaderboard-listed model series (e.g. Gemini Omni Flash, Sora 2, Wan 2.7, Vidu Q3, Hailuo 2.3…) are recorded in `models/`, with parameters verified against official docs.

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

# 3. Model selection / pricing: rankings (AA/LMArena snapshots) + pricing (vendor billing)
```

**Validate data**: `node skill/scripts/tools.mjs validate models/*.json`; use `skill/schema/model.schema.json` with a JSON Schema library (ajv / jsonschema) for type checking.

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
- `rankings` stores third-party leaderboard snapshots only (Elo / Arena score and USD-per-minute API price); it is *not* vendor billing (`pricing`) and goes stale — trust the `as_of` date. Entries sourced from a leaderboard alone are skeletons (abilities partially inferred from board membership, everything else `_missing`).

## Contributing

To add or fix a model entry, follow [skill/SKILL.md](skill/SKILL.md); output goes into `models/`, and `node skill/scripts/tools.mjs validate models/*.json` must pass.

## License

Code and tooling MIT; model entry data CC BY 4.0 (see [LICENSE](LICENSE)).
