# hailuo-02

> 供应商：minimax ｜ 版本：02 ｜ 信息核实日期：2026-09-02
> 来源：[https://platform.minimax.io/docs/api-reference/video-generation-t2v](https://platform.minimax.io/docs/api-reference/video-generation-t2v)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **特色能力**：camera-control
- **备注**：官方 legacy v1 端点（POST api.minimax.io/v1/video_generation）只有单一模型串 MiniMax-Hailuo-02（2025-06-18 发布，支持 1080p、最长 10s）；榜单 hailuo-02-pro/standard/fast 不是官方 API 档名。t2v 必需 model+prompt；i2v 需 first_frame_image；fl2v（首尾帧）是独立页且仅此模型支持（需 first+last 两图，输出分辨率随首帧图，尾帧与首帧尺寸不同会被裁切）。s2v 主体参考不支持（仅 S2V-01）。无任何音频参数；无 aspect_ratio 参数（输出比例由输入图决定或未公开）；镜头控制用 prompt 内 [command] 语法（15 种：Truck/Pan/Push/Pedestal/Tilt/Zoom/Shake/Tracking/Static，推荐 ≤3 个）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
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

> 备注：时长/分辨率按任务与档位耦合：t2v 768P(默认) 可选 6/10s、1080P 仅 6s（720P 不支持）；i2v 额外支持 512P 且 512P/768P 可 6/10s、1080P 仅 6s（512P 未在 schema 分辨率枚举中，未录入）；fl2v 同 t2v 且不支持 512P。默认 6s。prompt_optimizer 默认 true；fast_pretreatment 默认 false（仅对 Hailuo-2.3 与 Hailuo-02 生效）。fps 官方未公开。prompt ≤2000 字符。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | hailuo-02-pro | 33 | 1228 | 11 | 21743 | — | — | — |
| LMArena·图生 | hailuo-02-standard | 36 | 1223 | 10 | 21785 | — | — | — |
| LMArena·图生 | hailuo-02-fast | 39 | 1193 | 11 | 22519 | — | — | — |
| LMArena·文生 | hailuo-02-pro | 32 | 1198 | 12 | 9363 | — | — | — |
| LMArena·文生 | hailuo-02-standard | 34 | 1180 | 12 | 9330 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：request

| 档位 | 单价 |
| --- | --- |
| 768p·6s | 0.28 |
| 768p·10s | 0.56 |
| 1080p·6s | 0.49 |
| 512p·6s | 0.1 |
| 512p·10s | 0.15 |

> 备注：Pay-as-you-go 按条计费（$/条）；Video Packages 订阅按点数：768P·6s=1 点、768P·10s=2 点、1080P·6s=2 点、512P·6s=0.3 点、512P·10s=0.5 点。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 1000 | provider_failed | 未知错误，请稍后重试 |
| 1001 | timeout | 请求超时，请稍后重试 |
| 1002 | quota_exceeded | 触发限流，请稍后重试 |
| 1004 | access_denied | 鉴权失败，请检查 API Key |
| 1008 | settlement_failed | 账户余额不足 |
| 1024 | provider_failed | 内部错误，请稍后重试 |
| 1026 | content_violation.safety | 输入检出敏感内容，请修改 |
| 1027 | content_violation.safety | 生成结果检出敏感内容，请修改输入 |
| 1033 | provider_failed | 系统错误，请稍后重试 |
| 1039 | quota_exceeded | 触发 token 限额，请稍后重试 |
| 1041 | quota_exceeded | 连接数超限，请联系支持 |
| 1042 | invalid_parameter | 不可见字符比例超限，请检查输入 |
| 2013 | invalid_parameter | 请求参数无效，请按文档填写 |
| 2049 | access_denied | API Key 无效 |
| 2056 | quota_exceeded | 使用量超限，请等待下一个 5 小时窗口 |

