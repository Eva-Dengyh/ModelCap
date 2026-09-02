# ltx-2-5

> 供应商：lightricks ｜ 版本：2.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.ltx.io/models/ltx-2-5](https://docs.ltx.io/models/ltx-2-5)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image、audio
- **生成音频**：支持
- **特色能力**：multi-shot、camera-control
- **备注**：官方 API 两档 ltx-2-5-fast / ltx-2-5-pro（榜单行即这两档）；2026-08-11 发布，同时有开放权重（HF Lightricks/LTX-2.5，gated）与官方托管 API（api.ltx.io）。支持文生/图生（含末帧插值 last_frame_uri）/音频驱动（audio-to-video，非 scenes 枚举值，经 inputs.audio 表达）。fast 最高 4K、pro 最高 1080p；生成音频默认开（generate_audio 默认 true，可关）；原生多镜头；camera_motion 参数控制运镜。开放权重：Distilled/DFR 两条本地管线、LTX-2.x Community License（营收 ≥$10M 实体需付费商用授权）、本地最低显存官方两处口径不一致（16GB vs 32GB+）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 2 |
| 参考音频上限（条） | 1 |
| 图片大小上限 | 15728640 字节 |
| 图片格式 | png、jpeg、jpg、webp |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 6 ~ 20 秒 |
| 清晰度 | 720p、1080p、2k、4k |
| 画面比例 | 16:9、9:16 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：时长/分辨率/fps 支持矩阵：fast 在 720p/1080p @24/25fps 支持 6/8/10/12/14/16/18/20s，@48/50fps 与 1440p/4K 下仅 6/8/10s；pro 最高 1080p，720p/1080p @24/25/50fps 仅 6/8/10s（pro 不支持 48fps）。duration:null = auto（模型自选，不超过该档上限；不能与 last_frame_uri 同用）。分辨率只有 16:9/9:16 两种尺寸（fast 至 3840x2160/2160x3840，pro 至 1920x1080/1080x1920）；缺省时按输入图方向决定。generate_audio 默认 true（false=静音视频）。camera_motion：dolly_in/out、dolly_left/right、jib_up/down、static、focus_shift。Replicate 渠道 duration 列表（2~20s）与官方矩阵（6s 起）不一致，以官方为准。开放权重本地：默认 1024x1536@24fps，帧数须满足 8k+1 网格、宽高须被 64 整除（2x 上采样须 128）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 20 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | LTX-2.5 Fast | 23 | 1044 | 9 | 2722 | 2026-08 | 开放权重 | 7.80 |
| AA·图生 | LTX-2.5 Pro | 26 | 1013 | 9 | 2586 | 2026-08 | 开放权重 | 10.20 |
| AA·文生 | LTX-2.5 Fast | 26 | 1060 | 9 | 2726 | 2026-08 | 开放权重 | 7.80 |
| AA·文生 | LTX-2.5 Pro | 27 | 1060 | 9 | 2792 | 2026-08 | 开放权重 | 10.20 |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.09 |
| 1080p | 0.13 |
| 2k | 0.19 |
| 4k | 0.3 |

> 备注：ltx-2-5-fast 按输出视频秒计费（t2v/i2v/a2v 同价；a2v 按输入音轨秒计）：720p $0.09/s、1080p $0.13/s、1440p(2K) $0.19/s、4K $0.30/s。ltx-2-5-pro：720p $0.12/s、1080p $0.17/s（pro 无更高档）。AA 榜单 1080p 每分钟口径 $7.80(fast)/$10.20(pro) 恰为官方单价×60，互证一致。开放权重本地自部署无此价格。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| invalid_request_error | invalid_parameter | 请求参数无效 |
| authentication_error | access_denied | 鉴权失败，请检查 API Key |
| insufficient_funds_error | settlement_failed | 账户余额不足 |
| not_found_error | invalid_parameter | 请求的资源不存在 |
| content_filtered_error | content_violation.safety | 内容被安全策略过滤 |
| concurrency_limit_error | quota_exceeded | 超出并发限制，可重试 |
| rate_limit_error | quota_exceeded | 触发限流，可重试 |
| api_error | provider_failed | 服务内部错误，可重试 |
| service_unavailable | provider_failed | 服务不可用，可重试 |
| overloaded_error | provider_failed | 服务过载，可重试 |

