# ModelCap · AI Model Capability Catalog

[English](README.md) · [中文](README.zh-CN.md)

A machine-readable knowledge base of AI model capabilities — **one JSON entry per model version**, capturing parameter constraints, task differences, error-code attribution, and pricing for direct import and validation by programs, plus human-readable rendered markdown.

> Why: every time you integrate a model you re-trip over the same pitfalls — wrong parameters, stale constraints, unreadable error codes. This repo turns that accumulated knowledge into structured data so no one has to relearn it.

## Structure

```
├── models/                 ← output: one json + md per model version
│   ├── seedance-2-5.{json,md}
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

> The actual entries under `models/` are the source of truth; the table below is the watch list, populated incrementally.

| Rank | Model | Company | One-liner |
| --- | --- | --- | --- |
| 1 | Veo 3.1 | Google DeepMind | Quality ceiling; native audio + lip sync; massive distribution via Gemini/YouTube |
| 2 | Kling 3.0 | Kuaishou | Largest user base (60M+ creators, ~$240M ARR); audio-video sync |
| 3 | Seedance 2.5 | ByteDance | Released late Jul 2026; native 30s + multi-modal joint generation; even adopted by Runway |
| 4 | Runway Gen-4.5 | Runway | Top Western pro film tooling; cinematic shot choreography; Hollywood adoption |
| 5 | Hailuo H3 | MiniMax | Native 2K + first/last-frame & reference control; great value; once topped VBench |
| 6 | HappyHorse | Alibaba ATH | 2026 open-source dark horse; outputs 1080p video + audio in one pass; Arena #1 |
| 7 | Wan 3.0/2.x | Alibaba Cloud | Open-source ecosystem king (34k+ GitHub stars); native 30s |
| 8 | Sora / Sora 2 | OpenAI | Highest historical impact, but shut down March 2026 |
| 9 | HunyuanVideo 1.5 | Tencent | Lightweight open-source benchmark (8.3B); low deployment barrier |
| 10 | CogVideoX | Zhipu | Among the earliest Chinese open-source video models; wide dev ecosystem |
| 11 | PixVerse V6 | Aishi Technology | 15s + native audio + 20+ cinematic camera controls; strong overseas traction |
| 12 | Vidu Q3 | ShengShu + Tsinghua | Reference-to-video pioneer; audio-video sync; lip-sync error ±15ms |
| 13 | Luma Ray 3 | Luma AI | Dream Machine successor; strong 1080p image-to-video |
| 14 | Pika 2.2/2.5 | Pika Labs | Consumer pioneer; first/last-frame + effect templates; hype cooled |
| 15 | Firefly Video | Adobe | Commercially safe (licensed data); deep Premiere/AE integration |
| 16 | Dreamina / Jimeng | ByteDance (CapCut) | Rides CapCut's huge user base; short video + digital human |
| 17 | LTX-2 / LTX-Video | Lightricks | Open-source real-time video; leading real-time preview |
| 18 | Mochi 1 | Genmo | 2024 open-source pioneer; now marginalized |
| 19 | Stable Video Diffusion | Stability AI | Open-source trailblazer, but company pivoted to audio; video line stalled |
| 20 | MAGI-1 | Sand.ai | Open-source autoregressive video model; scaled autoregressive route |

## Usage

**Look up a model**: read `models/{model_id}.json` (programs) or `.md` (humans).

**Programmatic validation** (example): validate request params against `rules[task]` — the same parameter may carry different constraints per task (e.g. edit task duration forced to -1).

**Add a new model**: see [skill/SKILL.md](skill/SKILL.md) — open official docs with AI, write JSON per the schema, then validate and render with `skill/scripts/tools.mjs`.

## Conventions

- **JSON is the single source of truth**; markdown is a generated view — never hand-maintain a second copy.
- Missing fields are `null` with a `_missing` marker — **never fabricate**.
- Every entry carries `source_url` + `fetched_at` for traceability and freshness.
- Different versions in the same series (2.0 vs 2.5) often differ in parameters; keep separate entries.

## Contributing

To add or fix a model entry, follow [skill/SKILL.md](skill/SKILL.md); output goes into `models/`, and `node skill/scripts/tools.mjs validate models/*.json` must pass.

## License

Code and tooling MIT; model entry data CC BY 4.0 (see [LICENSE](LICENSE)).
