# veo-3.1-i2v

> 供应商：aimlapi ｜ 版本：3.1 ｜ 信息核实日期：2026-09-01
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

> 备注：duration 仅支持 4/6/8 三档（默认 8）；resolution 默认 1080p；generate_audio 默认 true；输入图片需 720p 或更高分辨率。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 8 秒 |
| 画面比例模式 | client_choice |

## 价格

待补充

## 错误码

待补充（本页未提供错误码表；响应含 error 对象但无具体错误码枚举。）

