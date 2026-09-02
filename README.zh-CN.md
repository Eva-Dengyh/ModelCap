# ModelCap · AI 模型能力目录

[English](README.md) · [中文](README.zh-CN.md)

机器可读的 AI 模型能力知识库——**一个模型版本一个 JSON 条目**，把参数约束、任务差异、错误码归因、定价固化下来，供程序直接 import 校验，也给人看渲染后的 markdown。

> 为什么做：每接一个模型就要重新踩一遍"参数取错、约束过期、错误码看不懂"的坑。这里把踩过的认知沉淀成结构化数据，后人不再踩。

## 结构

```
├── models/                 ← 结果：一个模型版本一个 json + md（50 个）
├── dist/                   ← 构建产物：catalog.json / index.json / catalog.d.ts
├── update-history.json     ← 变更审计（added/changed/removed 快照）
├── skill/                  ← 录入与校验工具（AI 用）
│   ├── SKILL.md            ← 录入流程说明
│   ├── schema/
│   │   └── model.schema.json   ← 数据格式定义（唯一权威）
│   └── scripts/
│       ├── tools.mjs        ← validate / render
│       ├── check-fresh.mjs  ← 新鲜度检查
│       ├── build-dist.mjs   ← 合并生成 dist/ 产物
│       ├── build-history.mjs ← 变更审计
│       ├── backfill-meta.mjs ← 回填元数据
│       └── send-feishu.mjs  ← 飞书推送（可选）
└── .github/workflows/      ← CI：校验 + 新鲜度 + 构建
```

## 收录 / 关注模型（视频生成）

> 人工挑选的热度榜（20 个版本条目）。「分类」按能力划分：文生（文本转视频）、图生（图像转视频）、编辑（视频编辑）；一个模型可同时属于多类，并列在单元格里。最后一列是 2026-09-02 的榜单快照（AA=Elo、LMArena=Arena score，两种体系不可直接比较）。

| 排名 | 模型 | 公司 | 分类 | 一句话说明 | 榜单快照（2026-09-02） |
| --- | --- | --- | --- | --- | --- |
| 1 | Veo 3.1 | Google DeepMind | 图生 | 质量天花板，原生音频+唇形同步，经 Gemini/YouTube 海量分发 | AA Elo 1086 · $24/分钟 |
| 2 | Kling 3.0 可灵 | 快手 | 文生、图生、编辑 | 用户规模最大（6000万+创作者、约2.4亿美元ARR），音画同步 | AA Elo 1071（1080p Pro）· $20.16/分钟 |
| 3 | Seedance 2.5 | 字节跳动 | 文生、图生、编辑 | 2026年7月底发布，原生30秒+多模态联合生成，连 Runway 都接入 | LMArena 1483（图生） |
| 4 | Seedance 2.0 | 字节跳动 | 文生、图生、编辑 | 2.5 的前一代主模型，同系列另有 Fast/Mini 降配版 | AA Elo 1190 · $9.07/分钟 |
| 5 | Runway Gen-4.5 | Runway | 文生、图生 | 西方影视创作第一，电影级镜头编排，好莱坞采用 | LMArena 1224（文生） |
| 6 | Hailuo H3 海螺 | MiniMax | 文生、图生 | 原生2K+首尾帧/参考控制，性价比高，VBench 曾登顶 | AA Elo 1186 · $7.80/分钟 · 开放权重 |
| 7 | HappyHorse 快乐小马 | 阿里 ATH | 文生、图生 | 2026开源黑马，一次同出1080p视频+音频，Arena 第一 | AA Elo 1087 · $13.20/分钟 |
| 8 | Wan 3.0 万相 | 阿里云 | 文生、图生 | 开源生态之王（GitHub 3.4万+ star），原生30秒 | AA Elo 1237 · $12/分钟 |
| 9 | HunyuanVideo 1.5 混元 | 腾讯 | 文生、图生 | 开源轻量标杆（8.3B），部署门槛低 | LMArena 1197（图生） |
| 10 | CogVideoX | 智谱 | 文生、图生、编辑 | 开源最早的中国视频模型之一，开发者生态广 | — |
| 11 | PixVerse V6 | 爱诗科技 | 文生、图生、编辑 | 15秒+原生音频+20+电影镜头控制，出海表现强 | AA Elo 1068 · $6.90/分钟 |
| 12 | Vidu Q2 | 生数科技+清华 | 文生、图生 | 参考生视频开创者，音画同步、口型误差±15ms | LMArena 1243（q2 turbo） |
| 13 | Luma Ray 2 | Luma AI | 文生、图生、编辑 | Dream Machine 续作，1080p 图生视频强 | LMArena 1108（图生） |
| 14 | Pika 2.2 | Pika Labs | 文生、图生 | 消费级先行者，首尾帧+特效模板，热度已回落 | LMArena 1008（文生） |
| 15 | Firefly Video | Adobe | 文生、图生 | 商业安全（授权数据训练），深度整合 Premiere/AE | — |
| 16 | 即梦 Dreamina | 字节剪映 | 文生、图生 | 依托剪映庞大用户盘，短视频+数字人一体化 | —（榜单以 Seedance 系列名义上榜，见第 3、4 行） |
| 17 | LTX-2 | Lightricks | 文生、图生、编辑 | 开源实时视频生成，实时预览体验领先 | AA Elo 930（Fast）· $2.40/分钟 |
| 18 | Mochi 1 | Genmo | 文生 | 2024开源先驱，现已边缘化 | LMArena 1006（文生） |
| 19 | Stable Video Diffusion | Stability AI | 图生 | 开源开拓者，但公司已转音频，视频线停滞 | — |
| 20 | MAGI-1 | Sand.ai（吴恩达团队） | 文生、图生、编辑 | 开源自回归视频模型，规模化自回归路线代表 | —（MAGI-2 Preview 已收录进 models/） |

> **快照说明（2026-09-02）**：AA 用 Elo，LMArena 用 Arena score（两体系不可比）；价格取 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。排名/置信区间/样本量/发布日期/开放权重/各榜 URL 等行级明细都存在各 `models/*.json` 的 `rankings` 字段，并渲染进对应 `.md`。除上述 20 个人工榜单模型外，另有 30 个上榜模型系列（如 Gemini Omni Flash、Sora 2、Wan 2.7、Vidu Q3、Hailuo 2.3…）已按系列收录进 `models/`，参数均已按官方文档核实。

## 怎么用

**查一个模型**：直接读 `models/{model_id}.json`（程序）或 `.md`（人）。

**在别的项目里集成**：把本仓库当数据源引入，读 JSON 即可。

```bash
git submodule add https://github.com/Eva-Dengyh/ModelCap.git libs/modelcap
```

```python
import json
d = json.load(open("libs/modelcap/models/kling-v2-6.json"))
rules = d["rules"]["generate"]

# 1. 参数校验（同一参数不同任务约束可能不同，如编辑任务时长强制 -1）
if s < rules["duration_seconds"]["min"] or s > rules["duration_seconds"]["max"]:
    raise ValueError("时长超限")

# 2. 错误码归一化：供应商私有码 → 标准语义 standard
standard = d["errors"].get(vendor_code, {}).get("standard")

# 3. 选型/计费：rankings（AA/LMArena 榜单快照）+ pricing（厂商计费）
```

**直接消费统一产物**：`dist/catalog.json`（全量合并）、`dist/index.json`（model_id 索引）、`dist/catalog.d.ts`（TS 类型），由 `node skill/scripts/build-dist.mjs` 生成。

**数据校验**：`node skill/scripts/tools.mjs validate models/*.json`；`skill/schema/model.schema.json` 可配合 JSON Schema 库（ajv / jsonschema）做类型校验。

**维护工具**：`check-fresh.mjs` 检查 `fetched_at` 过期；`build-history.mjs` 生成 `update-history.json` 变更审计；CI 见 `.github/workflows/validate.yml`。

**录入新模型**：见 [skill/SKILL.md](skill/SKILL.md)——用 AI 打开官方文档、按 schema 写 JSON、`skill/scripts/tools.mjs` 校验并渲染。

## 能力分类

每个模型条目从四个维度描述能力：

| 维度 | 字段 | 取值 |
| --- | --- | --- |
| 任务类型 | `ability.tasks` | generate（生成）、edit（编辑）、extend（延长） |
| 输入模态 | `ability.inputs` | reference_image（图）、reference_video（视频）、audio（音频） |
| 生成场景 | `ability.scenes` | t2v（文生）、i2v-first-frame（首帧）、i2v-first-last-frame（首尾帧）、i2v-middle-frame（中帧）、r2v（参考生视频） |
| 特色能力 | `ability.capabilities` | lip-sync（口型同步）、multi-shot（多镜头分镜）、camera-control（运镜控制） |

## 约定

- **JSON 是唯一事实源**，markdown 是生成的视图，不手写第二份。
- 缺失字段写 `null` 并加 `_missing` 标记，**禁止编造**。
- 每条带 `source_url` + `fetched_at`，可追溯、防过期。
- 同系列不同版本（2.0 vs 2.5）参数往往不同，各自独立条目。
- `rankings` 只存第三方榜单快照（Elo/Arena 分与美元/分钟 API 价口径），**不是**厂商计费（`pricing`），会过期，以 `as_of` 为准。仅凭榜单收录的条目是骨架——能力仅按所属榜单可证明部分填写，其余字段 `_missing`。
- `rules.{task}.supported_parameters` 列出该任务支持的参数名（如 duration/resolution/generate_audio），供客户端快速判断可传哪些参数。
- `pricing.observed_at` / `pricing.source` 记录价格快照日期与来源——价格会变，以它们为准。

## 贡献

新增或修正模型条目：按 [skill/SKILL.md](skill/SKILL.md) 流程走，产物进 `models/`，`node skill/scripts/tools.mjs validate models/*.json` 必须通过。

## 协议

代码与工具 MIT；模型条目数据 CC BY 4.0（详见 [LICENSE](LICENSE)）。
