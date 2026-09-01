# stable-video-diffusion

> 供应商：stability ｜ 版本：1.0 ｜ 信息核实日期：2026-09-01
> 来源：[https://github.com/Stability-AI/generative-models](https://github.com/Stability-AI/generative-models)

## 能力
- **任务类型**：generate
- **生成场景**：i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **备注**：Stable Video Diffusion（SVD），Stability AI 开源图生视频模型（研究用途，2023-11-21 发布）。SVD 生成 14 帧、SVD-XT 微调为 25 帧，固定分辨率 576x1024，仅输出画面无音频。模型已停滞，无活跃 API 文档，按 GitHub README 与推理脚本 simple_video_sample.py 录入。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |
| 图片最小边长 | 576 |
| 图片最大边长 | 1024 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 9:16 |
| 生成音频 | 不支持 |

> 备注：帧数控制（SVD 14 帧 / SVD-XT 25 帧），固定 576×1024，无秒级时长枚举：fps_id 默认 6（可设 5~30），时长=帧数/fps 无固定秒数档位；单张参考图（context frame）。分辨率 576×1024 不在 schema 清晰度枚举内，故 resolution 置 null、duration_seconds 置 null。

## 价格

待补充

## 错误码

待补充（开源模型无 API 错误码（本无）。）

