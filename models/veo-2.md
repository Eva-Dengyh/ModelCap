# veo-2

> 供应商：google ｜ 版本：2 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/googleapis/python-genai/blob/main/google/genai/types.py](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：Google 官方 SDK（googleapis/python-genai，GenerateVideosConfig）核对：Veo 2 支持文生视频与图生视频（首帧 image、末帧 last_frame、参考图 reference_images），可生成音频（generate_audio）。resolution 720p/1080p，aspect_ratio 16:9/9:16。官方文档页 ai.google.dev/gemini-api/docs/video 在本环境不可达，参数据官方 SDK 类型定义核对。原榜单推断仅标 t2v，已据官方补全 i2v 场景与 audio。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 3 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16 |
| 比例模式 | client_choice |
| 时长模式 | 待补充 |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：官方 SDK 未给出时长范围（文档页不可达）；resolution 720p/1080p，aspect_ratio 16:9/9:16；generate_audio 可选生成音频。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 画面比例模式 | client_choice |

## 价格


- **价格快照日期**：2026-09-02

- **价格来源**：https://github.com/googleapis/python-genai/blob/main/google/genai/types.py

> 备注：官方定价页（ai.google.dev/pricing）在本环境无法访问，未核实单价；Veo 2 为付费模型。

## 错误码

待补充（官方 SDK 未提供错误码表。）

