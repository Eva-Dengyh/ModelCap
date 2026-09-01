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

> Heat-ranked list of 20 version entries, one-to-one with the `models/` directory. The **Category** column splits them by capability — Text-to-Video / Image-to-Video / Video Edit; a model may belong to several categories, listed in one cell.

| Rank | Model | Company | Category | One-liner |
| --- | --- | --- | --- | --- |
| 1 | Veo 3.1 | Google DeepMind | Image-to-Video | Quality ceiling; native audio + lip sync; massive distribution via Gemini/YouTube |
| 2 | Kling 3.0 | Kuaishou | Text-to-Video, Image-to-Video, Video Edit | Largest user base (60M+ creators, ~$240M ARR); audio-video sync |
| 3 | Seedance 2.5 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | Released late Jul 2026; native 30s + multi-modal joint generation; even adopted by Runway |
| 4 | Seedance 2.0 | ByteDance | Text-to-Video, Image-to-Video, Video Edit | 2.5's predecessor main model; Fast/Mini are lighter variants in the series |
| 5 | Runway Gen-4.5 | Runway | Text-to-Video, Image-to-Video | Top Western pro film tooling; cinematic shot choreography; Hollywood adoption |
| 6 | Hailuo H3 | MiniMax | Text-to-Video, Image-to-Video | Native 2K + first/last-frame & reference control; great value; once topped VBench |
| 7 | HappyHorse | Alibaba ATH | Text-to-Video, Image-to-Video | 2026 open-source dark horse; outputs 1080p video + audio in one pass; Arena #1 |
| 8 | Wan 3.0 | Alibaba Cloud | Text-to-Video, Image-to-Video | Open-source ecosystem king (34k+ GitHub stars); native 30s |
| 9 | HunyuanVideo 1.5 | Tencent | Text-to-Video, Image-to-Video | Lightweight open-source benchmark (8.3B); low deployment barrier |
| 10 | CogVideoX | Zhipu | Text-to-Video, Image-to-Video, Video Edit | Among the earliest Chinese open-source video models; wide dev ecosystem |
| 11 | PixVerse V6 | Aishi Technology | Text-to-Video, Image-to-Video, Video Edit | 15s + native audio + 20+ cinematic camera controls; strong overseas traction |
| 12 | Vidu Q2 | ShengShu + Tsinghua | Text-to-Video, Image-to-Video | Reference-to-video pioneer; audio-video sync; lip-sync error ±15ms |
| 13 | Luma Ray 2 | Luma AI | Text-to-Video, Image-to-Video, Video Edit | Dream Machine successor; strong 1080p image-to-video |
| 14 | Pika 2.2 | Pika Labs | Text-to-Video, Image-to-Video | Consumer pioneer; first/last-frame + effect templates; hype cooled |
| 15 | Firefly Video | Adobe | Text-to-Video, Image-to-Video | Commercially safe (licensed data); deep Premiere/AE integration |
| 16 | Dreamina / Jimeng | ByteDance (CapCut) | Text-to-Video, Image-to-Video | Rides CapCut's huge user base; short video + digital human |
| 17 | LTX-2 | Lightricks | Text-to-Video, Image-to-Video, Video Edit | Open-source real-time video; leading real-time preview |
| 18 | Mochi 1 | Genmo | Text-to-Video | 2024 open-source pioneer; now marginalized |
| 19 | Stable Video Diffusion | Stability AI | Image-to-Video | Open-source trailblazer, but company pivoted to audio; video line stalled |
| 20 | MAGI-1 | Sand.ai | Text-to-Video, Image-to-Video, Video Edit | Open-source autoregressive video model; scaled autoregressive route |

## Usage

**Look up a model**: read `models/{model_id}.json` (programs) or `.md` (humans).

**Programmatic validation** (example): validate request params against `rules[task]` — the same parameter may carry different constraints per task (e.g. edit task duration forced to -1).

**Add a new model**: see [skill/SKILL.md](skill/SKILL.md) — open official docs with AI, write JSON per the schema, then validate and render with `skill/scripts/tools.mjs`.

## Capability dimensions

Each model entry describes capabilities along four dimensions:

| Dimension | Field | Values |
| --- | --- | --- |
| Task type | `ability.tasks` | generate, edit, extend |
| Input modality | `ability.inputs` | reference_image, reference_video, audio |
| Generation scene | `ability.scenes` | t2v, i2v-first-frame, i2v-first-last-frame, i2v-middle-frame, r2v |
| Special capability | `ability.capabilities` | lip-sync, portrait, multi-shot, camera-control |

## Conventions

- **JSON is the single source of truth**; markdown is a generated view — never hand-maintain a second copy.
- Missing fields are `null` with a `_missing` marker — **never fabricate**.
- Every entry carries `source_url` + `fetched_at` for traceability and freshness.
- Different versions in the same series (2.0 vs 2.5) often differ in parameters; keep separate entries.

## Contributing

To add or fix a model entry, follow [skill/SKILL.md](skill/SKILL.md); output goes into `models/`, and `node skill/scripts/tools.mjs validate models/*.json` must pass.

## License

Code and tooling MIT; model entry data CC BY 4.0 (see [LICENSE](LICENSE)).
