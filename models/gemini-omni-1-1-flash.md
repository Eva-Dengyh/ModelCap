# gemini-omni-1-1-flash

> 供应商：google ｜ 版本：omni-1.1-flash ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、r2v
- **接受输入**：reference_image、reference_video、audio
- **生成音频**：支持
- **备注**：Google 官方（Interactions API）核对：Gemini Omni Flash 1.1（gemini-omni-1.1-flash）原生多模态（文本/图像/音频/视频），支持文生视频、图生视频（首帧 <FIRST_FRAME> 与参考图 R2V）、多轮对话式编辑（previous_interaction_id）与视频延长；原生生成音频。分辨率 360p/720p/1080p/4k，比例 16:9（默认）/9:16。原榜单推断仅标 t2v+reference_image，已据官方补全 edit/extend 与 audio。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 5 |
| 参考音频上限（条） | 5 |
| 参考视频最大时长 | 10 秒 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 360p、720p、1080p、4k |
| 画面比例 | 16:9、9:16 |
| 比例模式 | client_choice |
| 时长模式 | 待补充 |
| 生成音频 | 支持 |
| 参考音频上限 | 5 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：时长由提示词/时间码（如 [0-3s]）控制，无独立 duration 参数；默认 16:9；resolution 支持 360p（草稿）/720p/1080p/4k；video_config.task 可选 image_to_video 或 reference_to_video；最多 5 张参考图与 5 条音轨。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | inherit_from_reference_video |
| 生成音频 | 不支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：多轮对话式编辑，通过 previous_interaction_id 迭代；上传视频编辑通过 Files API 传入 document uri；官方未给出编辑任务的时长/分辨率/比例约束。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 3 ~ 10 秒 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：生成 3-10 秒续写，分析至多 10 秒前文；上传视频须 ≤10 秒（模型自生成视频多轮延长不限）；多轮语音扩展支持生成对白。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | gemini-omni-1.1-flash | 2 | 1488 | 11 | 3720 | — | — | — |
| LMArena·文生 | gemini-omni-1.1-flash | 1 | 1515 | 16 | 1762 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


- **价格快照日期**：2026-09-02

- **价格来源**：https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb

> 备注：官方定价页（ai.google.dev/pricing）在本环境无法访问，未核实单价；Gemini Omni Flash 1.1 为付费模型。

## 错误码

待补充（官方文档未提供错误码表；Interactions API 无公开错误码枚举。）

