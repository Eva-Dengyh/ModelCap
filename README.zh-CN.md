# ModelCap · AI 模型能力目录

[English](README.md) · [中文](README.zh-CN.md)

面向 AI 视频模型的机器可读能力目录和保守请求校验器——**一个模型版本一个 JSON 条目**，把参数约束、任务差异、错误码归因、定价固化下来，供程序直接 import 校验，也给人看渲染后的 markdown。

> 为什么做：每接一个模型就要重新踩一遍"参数取错、约束过期、错误码看不懂"的坑。这里把踩过的认知沉淀成结构化数据，后人不再踩。

ModelCap 面向做模型路由、AI 视频工具、Provider SDK 封装、产品表单校验的开发者。它不是质量排行榜，也不声称判断哪个模型“最好”。

## 结构

```
├── models/                 ← 结果：一个模型版本一个 json + md（50 个）
├── dist/                   ← 构建产物：catalog.json / index.json / catalog.d.ts
├── src/                    ← 零运行时依赖的 Node.js SDK
├── update-history.json     ← 变更审计（added/changed/removed 快照）
├── skill/                  ← 录入与校验工具（AI 用）
│   ├── SKILL.md            ← 录入流程说明
│   ├── schema/
│   │   └── model.schema.json   ← 数据格式定义（唯一权威）
│   └── scripts/
│       ├── tools.mjs        ← validate / render
│       ├── validate-schema.mjs ← 完整 JSON Schema 校验
│       ├── check-fresh.mjs  ← 新鲜度检查
│       ├── audit-sources.mjs ← 只读来源 URL/哈希巡检
│       ├── build-dist.mjs   ← 合并生成 dist/ 产物
│       ├── build-history.mjs ← 变更审计
│       ├── backfill-meta.mjs ← 回填元数据
│       └── send-feishu.mjs  ← 飞书推送（可选）
└── .github/workflows/      ← 确定性 CI + 定时来源巡检
```

## 收录 / 关注模型（视频生成）

> 人工挑选的 20 个重点版本条目。「分类」按能力划分：文生（文本转视频）、图生（图像转视频）、编辑（视频编辑）；一个模型可同时属于多类。完整目录以 `models/` 为准。

| 模型 | 公司 | 分类 | 一句话说明 |
| --- | --- | --- | --- |
| Veo 3.1 | Google DeepMind | 图生 | 原生音频+唇形同步，经 Gemini/YouTube 广泛分发 |
| Kling 3.0 可灵 | 快手 | 文生、图生、编辑 | 用户规模大，支持音画同步 |
| Seedance 2.5 | 字节跳动 | 文生、图生、编辑 | 原生30秒+多模态联合生成 |
| Seedance 2.0 | 字节跳动 | 文生、图生、编辑 | 2.5 的前一代主模型，同系列另有 Fast/Mini 降配版 |
| Runway Gen-4.5 | Runway | 文生、图生 | 面向专业影视创作，支持电影级镜头编排 |
| Hailuo H3 海螺 | MiniMax | 文生、图生 | 原生2K+首尾帧/参考控制 |
| HappyHorse 快乐小马 | 阿里 ATH | 文生、图生 | 可一次生成1080p视频+音频 |
| Wan 3.0 万相 | 阿里云 | 文生、图生 | 开源生态成熟，支持原生30秒 |
| HunyuanVideo 1.5 混元 | 腾讯 | 文生、图生 | 8.3B 开源轻量模型，部署门槛较低 |
| CogVideoX | 智谱 | 文生、图生、编辑 | 较早的中国开源视频模型，开发者生态广 |
| PixVerse V6 | 爱诗科技 | 文生、图生、编辑 | 15秒+原生音频+多种电影镜头控制 |
| Vidu Q2 | 生数科技+清华 | 文生、图生 | 支持参考生视频、音画同步与口型控制 |
| Luma Ray 2 | Luma AI | 文生、图生、编辑 | Dream Machine 续作，支持1080p图生视频 |
| Pika 2.2 | Pika Labs | 文生、图生 | 支持首尾帧与特效模板 |
| Firefly Video | Adobe | 文生、图生 | 使用授权数据训练，深度整合 Premiere/AE |
| 即梦 Dreamina | 字节剪映 | 文生、图生 | 短视频与数字人一体化创作 |
| LTX-2 | Lightricks | 文生、图生、编辑 | 开源实时视频生成，支持实时预览 |
| Mochi 1 | Genmo | 文生 | 2024 年发布的开源视频生成模型 |
| Stable Video Diffusion | Stability AI | 图生 | 较早的开源图生视频模型 |
| MAGI-1 | Sand.ai（吴恩达团队） | 文生、图生、编辑 | 开源自回归视频模型 |

目录中还有更多模型系列；资料不完整的条目会用 `_missing` 明确标记，待官方参数文档补全。

## 怎么用

### Node.js SDK

当前仓库已兼容 npm 包格式，但不声称已经发布到 npm registry；可以直接从 GitHub 安装：

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

校验器只会拒绝结构化数据里明确写出的硬约束。资料缺失或为 `null` 时尽量给出 warning，不会把备注文字解释成可执行规则。ModelCap 不负责发送厂商请求、管理密钥、重试调用或评价生成质量。

完整公开 API 和 TypeScript 类型见 [docs/API.md](docs/API.md)。

### 原始数据与维护

可以直接读取 `models/{model_id}.json`（程序）或 `.md`（人），也可以把仓库作为原始数据子模块：

```bash
git submodule add https://github.com/Eva-Dengyh/ModelCap.git libs/modelcap
```

统一产物包括 `dist/catalog.json`、`dist/index.json` 和 `dist/catalog.d.ts`。

```bash
npm test                 # SDK 与工具行为
npm run typecheck        # TypeScript 公开类型消费检查
npm run examples:check   # 可运行 SDK 示例
npm run validate:catalog # 目录领域规则校验
npm run validate:schema  # 完整 Draft 2020-12 Schema 校验
npm run build:check      # 生成物与模型 JSON 一致
npm run ci               # 完整、确定性的 PR 门禁
npm run release:check    # 发布前完整门禁 + 发布元信息检查
npm run audit:sources    # 输出实时 URL 元数据与正文哈希
```

### CLI

可以用命令行直接查目录或校验请求文件：

```bash
node bin/modelcap.mjs list --task generate --input reference_image
node bin/modelcap.mjs get wan-3.0
node bin/modelcap.mjs validate wan-3.0 examples/request-invalid.json
```

作为 npm 包安装后，可直接使用 `modelcap` 命令。详见 [docs/CLI.md](docs/CLI.md)。

来源巡检得到的 HTTP 变化和哈希只是人工复核信号，不代表模型事实一定变化。巡检不会修改模型 JSON，也不会推进 `fetched_at`；定时工作流只把报告上传为附件。`build-history.mjs` 继续生成 `update-history.json` 数据变更审计。

**录入新模型**：见 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [skill/SKILL.md](skill/SKILL.md)——使用官方文档、按 schema 写 JSON、`skill/scripts/tools.mjs` 校验并渲染。

**正式发布**：见 [docs/RELEASE.md](docs/RELEASE.md)。发布门禁会在 npm 发布或打 tag 前检查 CI、打包内容、CLI 是否入包，以及 package 版本是否和 CHANGELOG 对齐。

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
- 不收录第三方榜单排名、分数、样本量或榜单价格。
- `rules.{task}.supported_parameters` 列出该任务支持的参数名（如 duration/resolution/generate_audio），供客户端快速判断可传哪些参数。
- `rules.{task}.conditional_rules` 记录官方明确写出的上下文限制，例如 1080p 只支持某个时长，或有参考视频时输入+输出总时长封顶。
- `pricing.observed_at` / `pricing.source` 记录价格快照日期与来源——价格会变，以它们为准。
- SDK 兼容性和目录数据兼容性见 [docs/VERSIONING.md](docs/VERSIONING.md)。

## 贡献

新增或修正模型条目：按 [skill/SKILL.md](skill/SKILL.md) 流程走，产物进 `models/`，`npm run ci` 必须通过。

## 协议

代码与工具 MIT（详见 [LICENSE](LICENSE)）；模型条目数据 CC BY 4.0（详见 [DATA_LICENSE.md](DATA_LICENSE.md)）。
