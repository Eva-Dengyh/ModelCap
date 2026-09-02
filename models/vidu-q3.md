# vidu-q3

> 供应商：shengshu ｜ 版本：q3 ｜ 信息核实日期：2026-09-02
> 来源：[https://platform.vidu.com/docs/model-map](https://platform.vidu.com/docs/model-map)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：官方现役文档已迁移至 platform.vidu.com/docs（旧 docs.platform.vidu.com 停在 Q2 时代）。Q3 档位：viduq3-pro（旗舰，文生/图生/首尾帧，支持音画同步与智能分镜）、viduq3-turbo（更快，另支持参考生视频）、viduq3-pro-fast（仅图生）、viduq3-mix/-drama/-ad（仅参考生视频）。audio 参数默认 true（Q3 专属，直出带声视频，含对白与音效），bgm 对 q3 不可用；movement_amplitude / style(general/anime) 对 q2/q3 无效。成片 24fps。上线：pro 2026-01-27，turbo 2026-02-11，reference2video 系 2026-04-13。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 52428800 字节 |
| 图片格式 | png、jpeg、jpg、webp |
| 图片最小边长 | 128 |
| 图片比例范围 | 0.25 ~ 4 |
| 补充提示词上限 | 5000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 16 秒 |
| 清晰度 | 540p、720p、1080p |
| 画面比例 | 16:9、9:16、3:4、4:3、1:1 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：端点/场景差异（同一 generate 下的子场景，schema 不细分）：text2video 的 q3-pro/turbo 时长 1–16s（默认 5）、分辨率默认 720p 可选 540p/720p/1080p，比例默认 16:9，3:4/4:3 仅 q2/q3 支持；image2video 同 1–16s，pro-fast 仅 720p/1080p；start-end2video（首帧+尾帧 2 图，两图比例须在 0.8~1.25）1–16s；reference2video（仅 mix/turbo/q3 等档，图 1–7 张、每张 ≥128x128）mix 1–16s、turbo/pro 3–16s，参考视频 q3 不支持（仅 viduq2-pro）。i2v 每请求请求体 ≤20MB。audio 默认 true（q3），支持 off-peak 错峰。文档内部有 r2v 页"3:4/4:3 仅 q2"与 t2v 页"q2&q3"的不一致，照录待厂商修正。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 16 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Vidu Q3 Pro | 20 | 1061 | 6 | 17218 | 2026-01 | — | 9.60 |
| AA·图生 | Vidu Q3 Turbo | 24 | 1037 | 9 | 3285 | 2026-02 | — | 3.90 |
| AA·文生 | Vidu Q3 Pro | 23 | 1075 | 5 | 20048 | 2026-01 | — | 9.60 |
| AA·文生 | Vidu Q3 Turbo | 28 | 1031 | 9 | 2969 | 2026-02 | — | 3.90 |
| LMArena·图生 | vidu-q3-pro | 16 | 1363 | 9 | 36684 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 540p | 9 |
| 720p | 20 |
| 1080p | 24 |

> 备注：平台按 credits 计费（1 credit = $0.005）。tiers 为 viduq3-pro 峰值 credits/秒：540P 9($0.045)/720P 20($0.1)/1080P 24($0.12)；off-peak（错峰）约半价（1080P 12 / 720P 10 / 540P 5）。viduq3-turbo：540P 7 / 720P 11 / 1080P 13 credits/秒；pro-fast（仅图生）：720P 20 / 1080P 25。reference2video 档另价（mix 720P 24 / 1080P 29；turbo 4/10/13；q3 7/12/15），错峰任务 48h 内未完成自动取消退款。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| BadRequest | invalid_parameter | 请求格式错误（bad request） |
| FieldLacking | invalid_parameter | 缺少必填字段 |
| FieldUnwanted | invalid_parameter | 包含不允许的字段 |
| FieldItemCountOutOfRange | invalid_parameter | 字段元素数量超出允许范围 |
| FieldInvalid | invalid_parameter | 字段值未通过有效性校验 |
| PageSizeOutOfRange | invalid_parameter | 图片需 <50MB，格式 JPG/PNG/JPEG/WEBP，宽高比不超过 1:4 或 4:1 |
| ImageDownloadFailure | invalid_parameter | 参考图下载失败，请更换可访问的 URL |
| ImageFormatInvalid | invalid_parameter | 图片格式不支持 |
| VideoFormatInvalid | invalid_parameter | 视频格式不支持 |
| ImageSizeInvalid | invalid_parameter | 图片尺寸不符合要求 |
| FaceDetectFailure | invalid_parameter | 人脸检测失败 |
| NoFaceDetected | invalid_parameter | 未检测到人脸 |
| MultiFaceDetected | invalid_parameter | 检测到多张人脸，仅支持单人 |
| AuditSubmitIllegal | content_violation.safety | 输入未通过安全审核 |
| CreationPolicyViolation | content_violation.safety | 生成内容触发策略违规 |
| AuditFailed | content_violation.safety | 内容审核未通过 |
| CreditInsufficient | quota_exceeded | 账户积分不足，请充值 |
| QuotaExceeded | quota_exceeded | 超出配额限制 |
| TooManyRequests | quota_exceeded | 请求过于频繁，请降低频率 |
| SystemThrottling | quota_exceeded | 系统限流，请稍后重试 |
| ModelUnavailable | provider_failed | 请求的模型当前不可用 |
| InternalServiceFailure | provider_failed | 服务内部错误，请稍后重试 |
| OperationInProcess | provider_failed | 操作进行中冲突 |
| Conflict | provider_failed | 资源冲突 |
| Unknown | provider_failed | 未知错误，请稍后重试 |
| UserCancelled | interrupted | 用户取消任务 |
| Unauthorized | access_denied | 未授权，请检查 API Key |
| Forbidden | access_denied | 无权限执行该操作 |
| TaskNotFound | invalid_parameter | 任务不存在 |
| CreationNotFound | invalid_parameter | 生成记录不存在 |
| NotFound | invalid_parameter | 请求的资源不存在 |

