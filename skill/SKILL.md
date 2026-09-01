---
name: model-catalog
description: 读取模型官方文档链接，按统一 schema 生成该模型的 JSON 事实源（models/{model_id}.json）和给人看的 markdown（models/{model_id}.md）。用户只需提供模型参数说明的官网链接。缺失字段打 _missing 标，不编造。
---

# Model Catalog 录入 Skill

把一份模型官方文档链接，转成结构化的模型能力条目（AI 录入为主）。

## 触发方式

用户说类似以下任意一句，附带官网链接：

- "帮我把这个模型录进目录：https://..."
- "录入模型 https://..."
- "/model-catalog https://..."
- 用户只发了一个模型文档链接

## 输入

| 参数 | 说明 |
| --- | --- |
| `链接`（必填） | 模型参数说明的官网链接 |
| `--model-id`（可选） | 手动指定模型 id；缺省从链接/页面标题推断，如 `seedance-2-5` |

## 仓库结构（结果为主，skill 是录入工具）

```
ModelCap/
├── README.md                       ← 项目介绍
├── LICENSE
├── models/                         ← 结果：一个模型版本一个 json + md
│   ├── seedance-2-5.{json,md}      ← 完整示例（AI 录入时照抄格式）
│   └── doubao-seedance-2-0-260128.{json,md}
└── skill/                          ← 录入工具（本 skill）
    ├── SKILL.md                    ← 本文件：录入流程说明
    ├── schema/model.schema.json    ← 数据格式定义（唯一权威）
    └── scripts/
        ├── tools.mjs               ← validate（校验 JSON）/ render（渲染 md）
        └── send-feishu.mjs         ← 推送到飞书（可选）
```

本 skill 是仓库的**录入工具**：产物直接写进仓库的 `models/` 目录。

## 执行流程（AI 录入）

### 第 1 步：用浏览器抓取正文

模型文档站（火山/腾讯等）多为 JS 动态渲染，静态抓取拿不到正文，统一用浏览器自动化：

1. 用浏览器自动化打开该链接，等 JS 渲染完成（约 3~5 秒）；
2. 只读提取正文纯文本（`main`/`article` 容器，避免导航与页脚）；
3. 确认正文含参数特征词（`duration`/`resolution`/`时长`/`分辨率`/`错误码` 等），是真正文不是壳；
4. 把正文保存为 `models/.raw/{model_id}.txt`（供对照参考，不入库）。

抓取成功判据：正文里**至少能找到模型名 + 一个参数表段落**（如时长范围、分辨率枚举），才继续解析。

### 第 2 步：按 schema 抽取字段，写完整 JSON

对照 `schema/model.schema.json`，**参考完整示例 `models/seedance-2-5.json` 的格式**，直接写完整 JSON 到 `models/{model_id}.json`。AI 录入时照示例结构填，不要另起格式。

| schema 字段 | 从页面哪里找 |
| --- | --- |
| model_id / provider / version | 标题、面包屑、URL、页面顶部 |
| ability.tasks | "任务类型"、"支持功能"、"生成/编辑/延长" |
| ability.inputs / audio | "输入"、"参考图/参考视频/音频"、"generate_audio" |
| input_limits | 参数表：数量、格式、大小、比例 |
| rules | 参数表 + 各任务分节（时长范围、分辨率、比例模式） |
| output_limits | 输出章节：成片时长、比例、格式 |
| pricing | 定价表（可能缺失/在登录后） |
| errors | 错误码章节（最容易抽漏，尽力找） |

抽取规则：

- **填得上就填实际值**（数字、枚举、数组）。
- **填不上就写 `null`，并且在同一对象里加 `"_missing": true`**，例：
  ```json
  "video": { "max_duration_seconds": null, "_missing": true }
  ```
- **禁止编造**：页面上没有的值，一律 null + _missing，不许猜。
- 数字只取原文数值；单位换算（如 MB→bytes、分钟→秒）在 JSON 里用标准单位并可在 note 里写原文。
- `fetched_at` = 当天日期（YYYY-MM-DD）；`source_url` = 用户给的链接。
- `rules` 必须按任务类型分键（`generate`/`edit`/`extend`）；同一参数不同任务约束不同时，各任务分别写（这是本 schema 的核心防坑点）。
- **注意版本差异**：不同版本（如 Seedance 2.0 vs 2.5）的时长、分辨率、数量限制往往不同，务必按页面实际版本填写，不要照搬示例里另一个版本的参数。

### 第 3 步：校验 JSON

```bash
node skill/scripts/tools.mjs validate models/{model_id}.json
```

必须全部通过才继续。骨架/示例里带 `_missing` 的字段补全后再校验。

### 第 4 步：渲染 markdown

```bash
node skill/scripts/tools.mjs render models/{model_id}.json
```

产出 `models/{model_id}.md`。md 是 json 的渲染视图，**不手写第二份事实**；json 改，md 重新生成。`_missing` 的字段在 md 中显示为"待补充"。

### 第 5 步：汇报

向用户报告：

- 生成了哪两个文件（路径）
- 自动填上了哪些字段（可信）
- 哪些字段 `_missing` 待人工补充（重点：任务类型约束、错误码、价格）
- 若整页抓取失败：说明原因，不给半成品

## 可选：推送飞书

```bash
node skill/scripts/send-feishu.mjs --file models/{model_id}.md "模型录入完成：{model_id}"
```

webhook 与签名 secret 存在 `~/.agents/skills/model-catalog/config.json`（本地配置，不进仓库），脚本自动读取。**这两个值等于群的发送权限，禁止提交进仓库。**

## 红线

1. **JSON 是唯一事实源**，md 是生成物。禁止手动维护 md 导致两边打架。
2. **缺失打标，禁止编造**。宁可标"待补充"，不许猜一个值写进去。
3. **按任务类型分规则**。不要把一个任务的参数规矩套到另一个任务上（编辑任务时长 -1 是典型坑）。
4. **抓取失败不给半成品**。浏览器拿不到正文或内容仍不完整时，明确报告缺失字段，而不是硬生成一个看似完整的空壳条目。
5. **版本差异要核对**。同系列不同版本（2.0 vs 2.5）参数往往不同，按页面实际版本填，不照搬其他版本。
