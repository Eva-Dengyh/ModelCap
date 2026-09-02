# hunyuanvideo-1.5

> 供应商：tencent ｜ 版本：1.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **备注**：腾讯混元开源视频生成模型 HunyuanVideo-1.5（8.3B 参数，可运行于消费级 GPU）。仅支持文生视频（T2V）与图生视频（I2V）两类生成任务，无视频编辑/延长任务，不生成音频（视频编辑等能力在同系列 OmniWeaving 模型，非本模型）。基础生成分辨率 480p/720p，超分网络（--sr）可上采样至 1080p。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 480p、720p |
| 画面比例 | 待补充 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：--resolution 仅接受 480p/720p；可选 --sr 超分将输出上采样至 1080p。--aspect_ratio 仅默认值 16:9（由客户端传入），README 无比例枚举；--video_length 仅默认值 121 帧（约 5 秒 @24fps），帧数由客户端设置，README 无秒级时长枚举，故 aspect_ratio / duration_seconds 置 null。--num_inference_steps 默认 50（cfg-distill 模型须固定 50 步）。--image_path 传 1 张参考图（首帧）即启用 I2V，不传则为 T2V。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | hunyuan-video-1.5 | 38 | 1197 | 16 | 5462 | — | — | — |
| LMArena·文生 | hunyuan-video-1.5 | 36 | 1169 | 16 | 4276 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

待补充（开源模型无 API 错误码（本无）。）

