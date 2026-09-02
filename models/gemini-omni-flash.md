# gemini-omni-flash

> 供应商：google ｜ 版本：omni-flash ｜ 信息核实日期：2026-09-02
> 来源：[https://ai.google.dev/gemini-api/docs/omni](https://ai.google.dev/gemini-api/docs/omni)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_image、reference_video
- **生成音频**：支持
- **备注**：走 Interactions API（POST /v1beta/interactions）。官方现文档把稳定版写作 gemini-omni-1.1-flash（2026-08-27 更新），preview 为 gemini-omni-flash-preview（DeepMind 模型卡同时覆盖两代）。单段输出 3–10s、24fps、默认 720p；默认生成音频且无关闭开关，只能靠提示词控制；延伸每次 +10s、总长上限 40s。参考素材用 <IMAGE_REF_N>/<VIDEO_REF_N> 标签（从 0 起），首尾帧插值须 <FIRST_FRAME>+<LAST_FRAME> 成对。API 不支持：音频参考上传、跨多个视频参考、YouTube 视频源、system instruction/temperature/top_p/stop/negative prompt、provisioned throughput。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考视频数量 | 0 ~ 3 |
| 参考视频最大时长 | 3 秒 |
| 参考视频格式 | mp4 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 清晰度 | 360p、720p、1080p、4k |
| 画面比例 | 9:16、16:9 |
| 生成音频 | 支持 |

> 备注：无 duration 参数，时长由模型在 3–10s 内决定（模型页：3s-10s，360p/720p/1080p/4K，24 FPS；1080p/4K 为 upscale）。resolution 默认 720p；aspect_ratio 仅 9:16 与 16:9（默认横向 16:9）。video_config.task 可显式设为 text_to_video / image_to_video / reference_to_video，不设则由模型推断。参考视频最多 3 段、每段 ≤3s，其中的音频被忽略。默认会自动切多个镜头，要单镜头必须提示 "In a single unbroken scene / No scene cuts"。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 生成音频 | 支持 |

> 备注：两种编辑：①编辑模型自产视频用 previous_interaction_id 多轮会话（每轮产出一条新视频）；②编辑自己的视频需先经 Files API 上传且 ≤10s。Voice editing 不支持；简单 prompt 效果更好（描述过度会引发意外改动）；EEA/瑞士/英国暂不可用上传视频编辑；可识别他人图片受限制。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 生成音频 | 支持 |

> 备注：单次续写 3–10s，只能续在尾部（不可前置/插中）。提示词不够明确时可显式 task:"extend"（加严格约束）。多轮延伸每次 +10s、总长上限 40s（官方提示指南：extend by 10s, up to a total length of 40s）。上传输入视频 ≤10s；上传的含人物讲话视频不能新增对白（多轮自产视频可以）；EEA/瑞士/英国不可 extend 上传视频。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 40 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Gemini Omni Flash | 4 | 1180 | 7 | 12348 | 2026-05 | — | 6.00 |
| AA·文生 | Gemini Omni Flash | 1 | 1238 | 6 | 17994 | 2026-05 | — | 6.00 |
| AA·编辑 | Gemini Omni Flash | 3 | 1124 | 5 | 15908 | 2026-05 | — | 6.00 |
| LMArena·图生 | gemini-omni-flash | 5 | 1463 | 6 | 64567 | — | — | — |
| LMArena·文生 | gemini-omni-flash | 2 | 1512 | 10 | 19830 | — | — | — |
| LMArena·编辑 | gemini-omni-flash | 4 | 1367 | 15 | 2109 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD

> 备注：按 token 计费（非按秒/分辨率分档，官方无分档表）。输入 $1.50/1M token（text/image/video/audio 同价）；输出文本 $9.00/1M，输出视频 $17.50/1M；视频按 5,792 token/秒（720p）折算，标准定价下有效价约 $0.10/秒。无免费层。

## 错误码

待补充（官方 Omni 参数/模型页未给错误码表（含状态码清单的 REST 参考页当前网络不可达）；HTTP 状态与错误结构沿用 Gemini API 通用约定。）

