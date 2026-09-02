# veo-3.1-i2v

> 供应商：aimlapi ｜ 版本：3.1 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.aimlapi.com/api-references/video-models/google/veo-3-1-image-to-video](https://docs.aimlapi.com/api-references/video-models/google/veo-3-1-image-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **特色能力**：lip-sync
- **备注**：Google Veo 3.1 image-to-video（模型标识 google/veo-3.1-i2v），经 AIML API 提供。生成 8 秒 720p/1080p 视频，带音频，支持多风格与对白。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 8 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：duration 仅支持 4/6/8 三档（默认 8）；resolution 默认 1080p；generate_audio 默认 true；输入图片需 720p 或更高分辨率。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 8 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Veo 3.1 | 9 | 1086 | 7 | 8858 | 2026-01 | — | 24.00 |
| AA·图生 | Veo 3.1 Preview | 12 | 1079 | 7 | 7532 | 2025-10 | — | 24.00 |
| AA·图生 | Veo 3.1 Fast Preview | 13 | 1079 | 7 | 7968 | 2025-10 | — | 9.00 |
| AA·图生 | Veo 3.1 Fast | 15 | 1072 | 6 | 16474 | 2026-01 | — | 9.00 |
| AA·图生 | Veo 3.1 Lite | 17 | 1070 | 7 | 8140 | 2026-03 | — | 4.80 |
| AA·文生 | Veo 3.1 Preview | 13 | 1097 | 6 | 8850 | 2025-10 | — | 24.00 |
| AA·文生 | Veo 3.1 | 15 | 1092 | 6 | 9449 | 2026-01 | — | 24.00 |
| AA·文生 | Veo 3.1 Lite | 16 | 1089 | 6 | 8883 | 2026-03 | — | 4.80 |
| AA·文生 | Veo 3.1 Fast | 19 | 1086 | 5 | 20209 | 2026-01 | — | 9.00 |
| AA·文生 | Veo 3.1 Fast Preview | 20 | 1086 | 6 | 7294 | 2025-10 | — | 9.00 |
| LMArena·图生 | veo-3.1-audio | 11 | 1398 | 11 | 25114 | — | — | — |
| LMArena·图生 | veo-3.1-audio-1080p | 12 | 1390 | 9 | 53121 | — | — | — |
| LMArena·图生 | veo-3.1-fast-audio | 13 | 1385 | 9 | 99828 | — | — | — |
| LMArena·图生 | veo-3.1-fast-audio-1080p | 15 | 1371 | 10 | 54411 | — | — | — |
| LMArena·文生 | veo-3.1-audio | 10 | 1364 | 14 | 13705 | — | — | — |
| LMArena·文生 | veo-3.1-audio-1080p | 11 | 1363 | 10 | 24972 | — | — | — |
| LMArena·文生 | veo-3.1-fast-audio | 12 | 1361 | 10 | 39371 | — | — | — |
| LMArena·文生 | veo-3.1-fast-audio-1080p | 13 | 1358 | 10 | 25768 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

待补充（本页未提供错误码表；响应含 error 对象但无具体错误码枚举。）

