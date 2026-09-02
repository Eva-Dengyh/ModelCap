# pika-2.2

> 供应商：pika ｜ 版本：2.2 ｜ 信息核实日期：2026-09-02
> 来源：[https://fal.ai/models/fal-ai/pika/v2.2/text-to-video](https://fal.ai/models/fal-ai/pika/v2.2/text-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：Pika 2.2（Pika Labs）。经官方 API 合作方 fal.ai 提供文生视频(text-to-video)与图生视频(image-to-video，首帧)。文生视频为「文生图 + 图生视频」两阶段。API 文档未提及音频生成能力。官方直连站点 pika.art / docs.pika.art 在当前网络环境不可达，参数以 fal.ai 官方 llms.txt 与 OpenAPI 为准。任务建议的 Pika 2.5 未在可达 API 中发现（当前仅 v2.1 / v2.2）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:5、5:4、3:2、2:3 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |

> 备注：文生视频支持 7 种 aspect_ratio（默认 16:9）；图生视频无 aspect_ratio 参数（比例继承首帧图）。resolution 默认 720p；duration 可选 5 / 10 秒，默认 5；negative_prompt、seed 可选。输出为 mp4（File.url）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | pika-v2.2 | 46 | 996 | 14 | 8635 | — | — | — |
| LMArena·文生 | pika-v2.2 | 45 | 1008 | 15 | 5727 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 4 |
| 1080p | 9 |

> 备注：fal.ai 官方给出 5 秒成片价格：720p $0.20、1080p $0.45；此处按秒折算为 4 / 9 美分/秒（tiers 整数单位为美分）。

## 错误码

待补充（fal.ai 队列 API 无私有错误码表；任务状态经 QueueStatus（IN_QUEUE / IN_PROGRESS / COMPLETED）表达，错误经 HTTP 状态码返回。）

