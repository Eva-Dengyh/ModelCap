# grok-imagine-video-1-5

> 供应商：spacexai ｜ 版本：1.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/xai-org/xai-proto/blob/main/proto/xai/api/v1/video.proto](https://github.com/xai-org/xai-proto/blob/main/proto/xai/api/v1/video.proto)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、r2v
- **接受输入**：reference_image、reference_video、audio
- **生成音频**：支持
- **备注**：xAI 官方（xai-proto video.proto）核对：视频生成模型支持文生视频、图生视频（首帧）、参考图 R2V、视频编辑与视频延长；默认生成音频（generate_audio 默认 true），支持参考音轨（voice_id 预置音色，最多 3 条）。官方 proto 注明 1080p 分辨率「由宣称支持 1080p 的模型提供，例如 grok-imagine-video-1.5 的图生视频」。原骨架 scenes 为空，已据官方补全。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考音频上限（条） | 3 |
| 图片大小上限 | 10485760 字节 |
| 图片格式 | png、jpg、webp |
| 参考视频最小时长 | 2 秒 |
| 参考视频最大时长 | 30 秒 |
| 参考视频格式 | mp4 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 15 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 1:1、16:9、9:16、4:3、3:4、3:2、2:3 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 3 |

> 备注：duration 1-15 秒；resolution 默认 480p，本版本支持 480p/720p/1080p（官方注明 1080p 用于其图生视频）；aspect_ratio 默认 16:9。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | inherit_from_reference_video |
| 生成音频 | 支持 |

> 备注：编辑通过 GenerateVideo 传入 video 字段实现；官方未给出编辑任务的时长/分辨率/比例约束。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 10 秒 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：延长片段 1-10 秒（默认 6 秒）；输入视频须 2-30 秒，从末尾续写。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | grok-imagine-video-1.5 | 5 | 1109 | 7 | 6366 | 2026-05 | — | 8.40 |
| LMArena·图生 | grok-imagine-video-1.5-720p | 6 | 1459 | 5 | 111667 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


> 备注：官方定价页（docs.x.ai）在本环境无法访问，未核实单价；proto 无静态视频计费字段（计费信息运行时随响应返回）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| invalid_argument | invalid_parameter | 请求参数非法，请检查模型名、时长/分辨率/比例等参数取值 |
| internal_error | provider_failed | 服务端内部错误，请稍后重试 |

