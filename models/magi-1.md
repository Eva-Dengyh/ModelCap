# magi-1

> 供应商：sand-ai ｜ 版本：1 ｜ 信息核实日期：2026-09-01
> 来源：[https://github.com/SandAI-org/MAGI-1](https://github.com/SandAI-org/MAGI-1)

## 能力
- **任务类型**：generate、extend
- **接受输入**：reference_image、reference_video
- **生成音频**：不支持
- **备注**：MAGI-1，Sand.ai 开源自回归视频生成模型（Apache 2.0）。支持 t2v（文生视频）/ i2v（图生视频）/ v2v（给定前缀视频续写）三种模式。逐 chunk（24 帧）自回归去噪，支持流式生成；VAE 8x 空间 / 4x 时间压缩。开源自托管，无 API 定价与错误码。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |
| 参考视频上限（条） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 备注：t2v / i2v。任意分辨率/帧数控制，无固定枚举：分辨率默认 720×720（4.5B）/ 720×1280（24B）；时长由 num_frames 控制（默认 96，fps 默认 24≈4s），流式无固定上限；cfg_number 基础模型=3、distill/quant=1。故 duration_seconds / resolution / aspect_ratio 置 null。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 待补充 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 备注：v2v 视频续写：输入前缀视频（--prefix_video_path）作为条件，自回归继续生成后续 chunk。任意分辨率/帧数控制，无固定枚举，duration_seconds / resolution / aspect_ratio 置 null。

## 价格

待补充

## 错误码

待补充（开源无错误码。）

