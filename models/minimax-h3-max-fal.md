# minimax-h3-max-fal

> 供应商：fal ｜ 版本：h3-max ｜ 信息核实日期：2026-09-02
> 来源：[https://fal.ai/models/minimax/h3-max/text-to-video](https://fal.ai/models/minimax/h3-max/text-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：fal 官方模型 minimax/h3-max（text-to-video 与 image-to-video 两个独立端点，POST fal.run/minimax/h3-max/*）。fal 后训练版 MiniMax H3，prompt 遵循与画面美学更强（页面自述）。本端点最高仅 480P/768P，无 1080P；fal 端点未暴露音频参数与输出音频字段（底层可能规划音效，但不可控）。i2v 变体：image_url 首帧（省略则按文生处理，默认 16:9）、end_image_url 尾帧做首尾帧生成，各至多 1 张。无 negative prompt/风格参数；enable_safety_checker 默认 true；prompt_expansion_mode=balanced/quality（改写力度，quality 最多约 30s）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 补充提示词上限 | 50000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 15 秒 |
| 清晰度 | 480p、768p |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16 |

> 支持参数：aspect_ratio、duration、resolution

> 备注：duration 整数 5–15 默认 5；resolution 480P/768P（默认 768P，无 1080P 档）。aspect_ratio 仅 t2v 变体可选（默认 16:9）；i2v 无比例参数、输出比例跟随首帧图。prompt_expansion_mode 必填（默认 balanced）。sync_mode=true 返回 base64 而非 CDN url；seed 可选。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Minimax H3 Max (post-trained by fal) | 1 | 1202 | 9 | 5453 | 2026-08 | — | 2.40 |
| AA·文生 | Minimax H3 Max (post-trained by fal) | 3 | 1235 | 10 | 5372 | 2026-08 | — | 2.40 |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 480p | 0.0125 |
| 768p | 0.02 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://fal.ai/models/minimax/h3-max/text-to-video

> 备注：fal 页面按输出秒计费：480p $0.0125/s、768p $0.02/s（促销 launch 价，75% off，2026-09-07 截止）；促销后 480p $0.05/s、768p $0.08/s。AA 榜单 $2.40/分钟 是 1080p 口径（本端点最高 768P），非本模型官方价。

## 错误码

待补充（fal 模型页无模型级错误码表；沿用平台 HTTP 语义（400/422 参数校验、429 限流、5xx 服务端）。任务状态枚举 IN_QUEUE/IN_PROGRESS/COMPLETED。）

