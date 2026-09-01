# ModelCap · AI 模型能力目录

机器可读的 AI 模型能力知识库——**一个模型版本一个 JSON 条目**，把参数约束、任务差异、错误码归因、定价固化下来，供程序直接 import 校验，也给人看渲染后的 markdown。

> 为什么做：每接一个模型就要重新踩一遍"参数取错、约束过期、错误码看不懂"的坑。这里把踩过的认知沉淀成结构化数据，后人不再踩。

## 结构

```
├── models/                 ← 结果：一个模型版本一个 json + md
│   ├── seedance-2-5.{json,md}
│   └── doubao-seedance-2-0-260128.{json,md}
└── skill/                  ← 录入工具（AI 用）
    ├── SKILL.md            ← 录入流程说明
    ├── schema/
    │   └── model.schema.json   ← 数据格式定义（唯一权威）
    └── scripts/
        ├── tools.mjs       ← validate / render
        └── send-feishu.mjs ← 飞书推送（可选）
```

## 收录 / 关注模型（视频生成）

> 当前 `models/` 已收录的条目以实际文件为准；下表是关注清单，逐步录入。

| 排名 | 模型 | 公司 | 一句话说明 |
| --- | --- | --- | --- |
| 1 | Veo 3.1 | Google DeepMind | 质量天花板，原生音频+唇形同步，经 Gemini/YouTube 海量分发 |
| 2 | Kling 3.0 可灵 | 快手 | 用户规模最大（6000万+创作者、约2.4亿美元ARR），音画同步 |
| 3 | Seedance 2.5 | 字节跳动 | 2026年7月底发布，原生30秒+多模态联合生成，连 Runway 都接入 |
| 4 | Runway Gen-4.5 | Runway | 西方影视创作第一，电影级镜头编排，好莱坞采用 |
| 5 | Hailuo H3 海螺 | MiniMax | 原生2K+首尾帧/参考控制，性价比高，VBench 曾登顶 |
| 6 | HappyHorse 快乐小马 | 阿里 ATH | 2026开源黑马，一次同出1080p视频+音频，Arena 第一 |
| 7 | Wan 3.0/2.x 万相 | 阿里云 | 开源生态之王（GitHub 3.4万+ star），原生30秒 |
| 8 | Sora / Sora 2 | OpenAI | 历史影响力第一，但2026年3月已关停 |
| 9 | HunyuanVideo 1.5 混元 | 腾讯 | 开源轻量标杆（8.3B），部署门槛低 |
| 10 | CogVideoX | 智谱 | 开源最早的中国视频模型之一，开发者生态广 |
| 11 | PixVerse V6 | 爱诗科技 | 15秒+原生音频+20+电影镜头控制，出海表现强 |
| 12 | Vidu Q3 | 生数科技+清华 | 参考生视频开创者，音画同步、口型误差±15ms |
| 13 | Luma Ray 3 | Luma AI | Dream Machine 续作，1080p 图生视频强 |
| 14 | Pika 2.2/2.5 | Pika Labs | 消费级先行者，首尾帧+特效模板，热度已回落 |
| 15 | Firefly Video | Adobe | 商业安全（授权数据训练），深度整合 Premiere/AE |
| 16 | 即梦 Dreamina | 字节剪映 | 依托剪映庞大用户盘，短视频+数字人一体化 |
| 17 | LTX-2 / LTX-Video | Lightricks | 开源实时视频生成，实时预览体验领先 |
| 18 | Mochi 1 | Genmo | 2024开源先驱，现已边缘化 |
| 19 | Stable Video Diffusion | Stability AI | 开源开拓者，但公司已转音频，视频线停滞 |
| 20 | MAGI-1 | Sand.ai（吴恩达团队） | 开源自回归视频模型，规模化自回归路线代表 |

## 怎么用

**查一个模型**：直接读 `models/{model_id}.json`（程序）或 `.md`（人）。

**程序校验**（示例）：按 `rules[task]` 校验请求参数是否合法——同一参数在不同任务下约束可能不同（如编辑任务时长强制 -1）。

**录入新模型**：见 [skill/SKILL.md](skill/SKILL.md)——用 AI 打开官方文档、按 schema 写 JSON、`skill/scripts/tools.mjs` 校验并渲染。

## 约定

- **JSON 是唯一事实源**，markdown 是生成的视图，不手写第二份。
- 缺失字段写 `null` 并加 `_missing` 标记，**禁止编造**。
- 每条带 `source_url` + `fetched_at`，可追溯、防过期。
- 同系列不同版本（2.0 vs 2.5）参数往往不同，各自独立条目。

## 贡献

新增或修正模型条目：按 [skill/SKILL.md](skill/SKILL.md) 流程走，产物进 `models/`，`node skill/scripts/tools.mjs validate models/*.json` 必须通过。

## 协议

代码与工具 MIT；模型条目数据 CC BY 4.0（详见 [LICENSE](LICENSE)）。
