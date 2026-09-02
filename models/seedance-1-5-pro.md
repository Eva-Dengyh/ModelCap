# seedance-1-5-pro

> 供应商：volcengine ｜ 版本：1.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.volcengine.com/docs/ark/seedance-1-5-pro?lang=zh](https://docs.volcengine.com/docs/ark/seedance-1-5-pro?lang=zh)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：火山方舟模型 doubao-seedance-1-5-pro-251215（官方 2026-01-15 首发）。原生音视频联合生成，支持 文生 / 图生首帧 / 图生首尾帧 三种场景；不支持参考视频/参考音频、不支持编辑/延长（那是 2.5/2.0 能力）。图生场景图片数量：首帧 1 张、首尾帧 2 张。样片（Draft）模式仅 1.5 pro 支持且强制 480p；flex 离线推理价格约为在线一半（1.5 pro 支持，2.5/2.0 不支持）。任务异步，任务 ID 保留 7 天，结果 URL 24h/100 次。有声视频均为单声道。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 31457280 字节 |
| 图片格式 | jpeg、png、webp、bmp、tiff、gif、heic、heif |
| 图片最小边长 | 300 |
| 图片最大边长 | 6000 |
| 图片比例范围 | 0.4 ~ 2.5 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 12 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、21:9、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 0 |
| 音频额外计费 | 是 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：时长 [4,12] 或 -1（智能选择），默认 720p（480p/720p/1080p），ratio 默认 adaptive。图生：首帧 1 图 / 首尾帧 2 图；指定 ratio 与图片不一致时居中裁剪，尾帧与首帧比例不一致时以首帧为主自动裁剪尾帧。camera_fixed 仅文生场景支持（参考图场景不支持）；seed ∈ [-1, 2^31-1]。prompt 建议长度：中文 ≤500 字 / 英文 ≤1000 词（官方为建议非硬上限）。有声/无声分档计费（非 2.x 的同价）。输出无 4K/mov。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 12 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Seedance 1.5 pro | 28 | 1000 | 0 | 11916 | 2025-12 | — | 11.86 |
| AA·文生 | Seedance 1.5 pro | 30 | 1000 | 0 | 13041 | 2025-12 | — | 11.86 |
| LMArena·图生 | seedance-v1.5-pro | 22 | 1307 | 7 | 245243 | — | — | — |
| LMArena·文生 | seedance-v1.5-pro | 20 | 1256 | 7 | 75890 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY

- **价格快照日期**：2026-09-02

- **价格来源**：https://docs.volcengine.com/docs/ark/seedance-1-5-pro?lang=zh

> 备注：官方按 token 计费：价格 = token 单价 × 用量，用量 = (输入视频时长 + 输出视频时长) × 宽 × 高 × 帧率 / 1024；按分辨率（480p/720p/1080p）、是否含声、是否 Draft/flex 分档（Draft 折算系数：无声 0.7 / 有声 0.6；flex 为在线价 50%）。各档位具体 token 单价在官方价格页表格中，公开抓取读不到，未收录。仅成功生成的视频计费。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InputTextSensitiveContentDetected | content_violation.safety | 输入文本检出敏感内容，请修改 |
| SensitiveContentDetected | content_violation.safety | 输入检出敏感内容 |
| InputTextRiskDetection | content_violation.safety | 输入文本触发风险检测 |
| InputImageSensitiveContentDetected | content_violation.safety | 输入图像可能包含敏感信息 |
| InputImageSensitiveContentDetected.PrivacyInformation | content_violation.real_person | 输入图像含真人隐私信息，请获取授权或更换素材 |
| InputImageSensitiveContentDetected.PolicyViolation | content_violation.copyright | 输入图像涉及版权侵权 |
| OutputVideoSensitiveContentDetected | content_violation.safety | 生成的视频可能包含敏感信息 |
| OutputVideoSensitiveContentDetected.PolicyViolation | content_violation.copyright | 生成视频涉及版权侵权 |
| OutputAudioSensitiveContentDetected | content_violation.audio | 生成的音频检出敏感内容 |
| InvalidImageURL | invalid_parameter | 图片 URL 无效 |
| InvalidImageURL.EmptyURL | invalid_parameter | 图片 URL 为空 |
| InvalidImageURL.InvalidFormat | invalid_parameter | 图片 URL 格式非法 |
| InvalidParameter.TosURLInvalid | invalid_parameter | TOS URL 无效 |
| MissingParameter | invalid_parameter | 缺少必填参数 |
| RequestBodyTooLarge | invalid_parameter | 请求体过大（上限 64MB） |
| RateLimitExceeded.EndpointRPMExceeded | quota_exceeded | 触发接口 RPM 限流 |
| RateLimitExceeded.EndpointTPMExceeded | quota_exceeded | 触发接口 TPM 限流 |
| QuotaExceeded | quota_exceeded | 超出配额 |
| ModelAccountRpmRateLimitExceeded | quota_exceeded | 账号级 RPM 限流 |
| AccountRateLimitExceeded | quota_exceeded | 账号级限流 |
| RequestCanceled | interrupted | 请求被取消 |
| ModelNotOpen | access_denied | 模型未开通 |
| OperationDenied | access_denied | 操作被拒绝，请检查权限 |
| InvalidEndpointOrModel | access_denied | Endpoint 或模型无效 |
| OperationDenied.ServiceNotOpen | access_denied | 服务未开通 |
| AccountOverdueError | settlement_failed | 账户欠费，请充值 |
| OperationDenied.ServiceOverdue | settlement_failed | 服务欠费，请续费 |
| InternalServiceError | provider_failed | 服务内部错误，请稍后重试 |
| InternalServerError | provider_failed | 服务端内部错误 |
| ContentSecurityDetectionError | provider_failed | 内容安全检测异常 |

