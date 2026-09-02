# hailuo-2-3

> 供应商：minimax ｜ 版本：2.3 ｜ 信息核实日期：2026-09-02
> 来源：[https://platform.minimax.io/docs/api-reference/video-generation-t2v](https://platform.minimax.io/docs/api-reference/video-generation-t2v)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **特色能力**：camera-control
- **备注**：官方 API 模型名 MiniMax-Hailuo-2.3，2025-10-28 发布（官方 news/minimax-hailuo-23）；走 MiniMax 国际站 v1 端点 POST https://api.minimax.io/v1/video_generation（platform.minimax.io 现将其列为 Legacy Models，主推 H3/H3 Max 的 v2 端点，勿混）。仅支持 T2V 与 I2V（只认首帧 first_frame_image）：T2V 参数参考 /docs/api-reference/video-generation-t2v，I2V 参考 /docs/api-reference/video-generation-i2v；首尾帧（FL2V 仅 MiniMax-Hailuo-02）、主体参考（S2V 仅 S2V-01）均不支持，无音频生成（无 generate_audio/音频输入参数）。镜头控制内置于 prompt 的 [command] 语法（15 种命令）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | jpg、jpeg、png、webp |
| 图片最小边长 | 300 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 补充提示词上限 | 2000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 6 ~ 10 秒 |
| 清晰度 | 768p、1080p |
| 生成音频 | 不支持 |

> 支持参数：duration、generate_audio、resolution

> 备注：时长/分辨率档位耦合（原文表）：MiniMax-Hailuo-2.3 在 768P 下时长可选 6 或 10 秒、1080P 下仅 6 秒；分辨率 6s 档默认 768P（可改 1080P），10s 档仅 768P。prompt 上限 2000 字符。API 不暴露画面比例参数（无 aspect_ratio），比例由输出档位决定，非客户端可选。prompt_optimizer 默认 true，fast_pretreatment 默认 false（仅 Hailuo-2.3 与 Hailuo-02 生效）。I2V 首帧图要求 JPG/JPEG/PNG/WebP、<20MB、短边 >300px、宽高比 2:5~5:2。成片 24fps（models-intro 规格表）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | hailuo-2.3 | 27 | 1262 | 5 | 357579 | — | — | — |
| LMArena·文生 | hailuo-2.3 | 30 | 1205 | 6 | 79981 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：request

| 档位 | 单价 |
| --- | --- |
| 768p·6s | 0.28 |
| 768p·10s | 0.56 |
| 1080p·6s | 0.49 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://platform.minimax.io/docs/api-reference/video-generation-t2v

> 备注：Pay-as-you-go（Legacy 价目，按条成片计费，非按秒）：MiniMax-Hailuo-2.3 每条 768P·6s=$0.28、768P·10s=$0.56、1080P·6s=$0.49。官方另推 Video Packages 订阅包按 video points 扣点（Hailuo-2.3 与 Hailuo-02 同档：768P·6s=1 点、768P·10s=2 点、1080P·6s=2 点）；订阅包仅支持 Hailuo 系列、MiniMax H3 暂不支持。生成失败或触发安全审核不扣费。2.3-Fast 为独立 I2V 专属模型另价（0.19/0.32/0.33），未并入本条。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 1000 | provider_failed | 未知错误，请稍后重试 |
| 1001 | timeout | 请求超时，请稍后重试 |
| 1002 | quota_exceeded | 触发限流，请稍后重试 |
| 1004 | access_denied | 鉴权失败，请检查 API Key 是否正确且有效 |
| 1008 | settlement_failed | 账户余额不足，请充值后重试 |
| 1024 | provider_failed | 服务内部错误，请稍后重试 |
| 1026 | content_violation.safety | 输入（prompt/图片）检出敏感内容，请修改 |
| 1027 | content_violation.safety | 生成结果检出敏感内容，请修改输入后重试 |
| 1039 | quota_exceeded | 触发 Token/请求限额，请稍后重试 |
| 2013 | invalid_parameter | 请求参数无效，请按文档要求检查参数 |
| 2049 | access_denied | API Key 无效，请检查后重试 |

