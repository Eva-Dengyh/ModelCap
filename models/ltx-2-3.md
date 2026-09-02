# ltx-2-3

> 供应商：lightricks ｜ 版本：2.3 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.ltx.io/models/ltx-2-3](https://docs.ltx.io/models/ltx-2-3)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image、audio
- **生成音频**：支持
- **备注**：官方 API 两档 ltx-2-3-fast / ltx-2-3-pro，最高都到 4K（这点与 2.5 不同：2.5 pro 只到 1080p）。支持文生/图生（末帧插值 last_frame_uri）/音频驱动（audio-to-video 仅 pro）；pro 另有 retake/extend/reframe/HDR 编辑端点（fast 无）。生成任务自带同步音频（generate_audio 默认 true，可关；官方 2.3 专属页未复述该参数，按共享端点行为）。auto duration（传 null 自选）仅 2.5 支持，2.3 不支持。camera_motion 参数存在于共享端点但 2.3 专属页未单列确认。开放权重适用 LTX-2 Community License（2026-01-05 版，营收 ≥$10M 实体需付费商用授权）。
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

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：时长矩阵：fast 在 720p/1080p @24/25fps 支持 6/8/10/12/14/16/18/20s，@48/50fps 与 1440p/4K 下仅 6/8/10s；pro 各档位 @24/25/48/50fps 均仅 6/8/10s（pro 支持 48/50fps，与 2.5 pro 不同）。分辨率只有 16:9/9:16 两向（fast/pro 均到 4K=3840x2160/2160x3840；官方档名 1440p，仓库用 2k）。fps 24/25/48/50 默认 24。i2v 末帧插值需 last_frame_uri；缺省分辨率按输入图方向。a2v（仅 pro）成片时长=输入音轨时长（720p/1080p 音轨 ≤20s，1440p/4K ≤10s）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 20 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | LTX-2.3 Fast | 31 | 954 | 7 | 11056 | 2026-03 | 开放权重 | 2.40 |
| AA·图生 | LTX-2.3 Pro | 32 | 952 | 7 | 10973 | 2026-03 | 开放权重 | 4.80 |
| AA·文生 | LTX-2.3 Fast | 32 | 978 | 6 | 12780 | 2026-03 | 开放权重 | 2.40 |
| AA·文生 | LTX-2.3 Pro | 33 | 959 | 6 | 12095 | 2026-03 | 开放权重 | 4.80 |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.03 |
| 1080p | 0.06 |
| 2k | 0.12 |
| 4k | 0.24 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://docs.ltx.io/models/ltx-2-3

> 备注：fast 按输出视频秒计费（t2v=i2v）：720p $0.03/s、1080p $0.06/s、1440p(2K) $0.12/s、4K $0.24/s。pro：$0.04/0.08/0.16/0.32/s。a2v（pro）$0.06/0.10/0.18/0.34/s（按输入音轨秒）；retake $0.10/s、extend 段+context 合计 ≤505 帧封顶、HDR $0.20~0.80/s、reframe 0.10/0.20/s（均 1080p 档，pro 独占）。AA 榜 $2.40/min 与官方 fast-1080p($0.06/s→$3.60/min) 不一致，为第三方渠道口径；pro $4.80/min 与官方互证。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| invalid_request_error | invalid_parameter | 请求参数无效 |
| authentication_error | access_denied | 鉴权失败，请检查 API Key |
| insufficient_funds_error | settlement_failed | 账户余额不足 |
| not_found_error | invalid_parameter | 请求的资源/任务不存在 |
| content_filtered_error | content_violation.safety | 内容被安全策略过滤 |
| concurrency_limit_error | quota_exceeded | 超出并发限制，可重试 |
| rate_limit_error | quota_exceeded | 触发限流，可重试 |
| api_error | provider_failed | 服务内部错误，可重试 |
| service_unavailable | provider_failed | 服务不可用，可重试 |
| overloaded_error | provider_failed | 服务过载，可重试 |

