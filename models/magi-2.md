# magi-2

> 供应商：sand-ai ｜ 版本：2 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/SandAI-org/MAGI-2-preview](https://github.com/SandAI-org/MAGI-2-preview)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：MAGI-2 Preview（官方 2026-08-05 发布，Apache-2.0，HF sand-ai/MAGI-2-preview 未 gated，约 307GB）。114B 总参数/每 token 激活约 6B（MagiMoE），官方定位 intermediate research release。只支持 T2V（纯文本）与 I2V（文本+一张首帧图），无视频输入/续写（与 MAGI-1 的 v2v 续写不同，也不再沿用 MAGI-1 的自回归 chunk 续写，改为统一序列+扩散）。开放权重侧生成含同步音轨（输出 mp4 内 mux）；托管 API（platform.sand.ai）仅 magi 公开、magi-2-preview 需联系 Sand.ai 开通，且 API 侧不支持音频条件。时长固定 10s；开放权重原生 512×896 → refiner 至 1088×1920，API 交付 540p/720p/1080p 且仅 16:9。文本编码器 Qwen3.5-27B、视频 VAE 取自 Wan2.2、音频 VAE stable-audio-open-1.0。推理需 8× NVIDIA Hopper。
## 输入限制

待补充

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 10 ~ 10 秒 |
| 清晰度 | 540p、720p、1080p |
| 生成音频 | 支持 |

> 备注：时长固定 10 秒（官方唯一支持时长）。API 侧 resolution 540p/720p/1080p、仅 16:9（开放权重示例为竖版 1088×1920，两口径已分别注明）。inference_steps 仅对 magi-2-preview：4–100 且须被 4 整除，默认 64；guidance_scale 无范围限制、7.5 已验证；prompt enhancement 默认开启。API 每次请求仅 1 chunk、无需 task type、condition.type 仅 text。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | MAGI-2 Preview | 7 | 1099 | 7 | 11933 | 2026-08 | 开放权重 | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


> 备注：官方未公开定价：magi-2-preview 需联系 Sand.ai 开通（"Currently, only magi is publicly available"），无公开价格。AA 榜价格栏为 "即将推出"。

## 错误码

待补充（官方 OpenAPI 无错误码枚举；任务状态 PreProcessing/Pending/Running/Success/Fail/Canceled。开放权重自托管无 API 错误码。）

