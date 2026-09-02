# seedance-1-0

> 供应商：volcengine ｜ 版本：1.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.volcengine.com/docs/82379/1520757](https://docs.volcengine.com/docs/82379/1520757)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **备注**：官方模型 doubao-seedance-1-0-pro-250528（另 pro fast = doubao-seedance-1-0-pro-fast-251015，速度最高快约 3 倍、价格直降 72%，首尾帧不支持）。lite 是独立拆分的两个模型 doubao-seedance-1.0-lite-t2v/i2v-250428，已于 2026-05-11 下线（官方建议迁移 doubao-seedance-2.0-fast-260128），其参数文档已从官方删除——本条目参数以 pro 为准，lite 相关字段无法核实。无声输出（generate_audio 仅 2.0/2.5/1.5 支持）；无参考视频/音频；无编辑/延长。frames 参数是 1.0 系列独有（可生成小数秒视频，帧数须为 25+4n、范围 [29,289]）。t2v 的 ratio 不支持 adaptive（i2v 可）。service_tier=flex 离线推理支持（价 50%）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 31457280 字节 |
| 图片格式 | jpeg、png、webp、bmp、tiff、gif |
| 图片最小边长 | 300 |
| 图片最大边长 | 6000 |
| 图片比例范围 | 0.4 ~ 2.5 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 12 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、21:9 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：时长 [2,12] 整数、默认 1080p（480p/720p/1080p，24fps）；不支持 duration=-1（智能时长只属 1.5/2.x）。t2v ratio 只能六档固定且不支持 adaptive（默认 16:9）；i2v 可 adaptive（默认），指定 ratio 与图不一致时居中裁剪、首尾帧不一致以首帧为主裁尾帧。duration 与 frames 二选一（frames 优先级更高，仅 1.0 pro/pro fast 支持）。camera_fixed 1.0 pro 支持但参考图场景不支持；seed ∈ [-1, 2^31-1]；return_last_frame 可选返回尾帧图。prompt 建议：中文 ≤500 字/英文 ≤1000 词。输出像素与 1.5/2.x 不同（如 1080p/16:9 为 1920×1088）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 12 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | seedance-v1-pro | 26 | 1272 | 8 | 34019 | — | — | — |
| LMArena·图生 | seedance-v1-lite | 40 | 1185 | 8 | 33734 | — | — | — |
| LMArena·文生 | seedance-v1-pro | 33 | 1190 | 11 | 12120 | — | — | — |
| LMArena·文生 | seedance-v1-lite | 42 | 1112 | 10 | 16177 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY

- **价格快照日期**：2026-09-02

- **价格来源**：https://docs.volcengine.com/docs/82379/1520757

> 备注：官方按 token 计费：价格 = token 单价 × 用量，用量 ≈ 输出视频时长×宽×高×帧率/1024（无输入视频项；视频生成模型输入 token 为 0）。pro 在线 15 元/百万 token、离线 flex 7.5 元；pro fast 在线 4.2 元、离线 2.1 元。lite 无定价行。仅成功生成的视频计费，审核失败不计费。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| MissingParameter | invalid_parameter | 缺少必填参数 |
| InvalidParameter | invalid_parameter | 参数不合法，请按文档检查 |
| InvalidImageURL | invalid_parameter | 图片 URL 无效 |
| RequestBodyTooLarge | invalid_parameter | 请求体过大（上限 64MB） |
| InputTextSensitiveContentDetected | content_violation.safety | 输入文本检出敏感内容 |
| InputImageSensitiveContentDetected | content_violation.safety | 输入图像可能包含敏感信息 |
| InputImageSensitiveContentDetected.PrivacyInformation | content_violation.real_person | 输入图像含真人，请获取授权或更换素材 |
| InputImageSensitiveContentDetected.PolicyViolation | content_violation.copyright | 输入图像涉及版权侵权 |
| OutputVideoSensitiveContentDetected | content_violation.safety | 生成的视频可能包含敏感信息 |
| OutputVideoSensitiveContentDetected.PolicyViolation | content_violation.copyright | 生成视频涉及版权侵权 |
| RateLimitExceeded.EndpointRPMExceeded | quota_exceeded | 触发接口 RPM 限流 |
| QuotaExceeded | quota_exceeded | 超出配额 |
| RequestCanceled | interrupted | 请求被取消（499） |
| AuthenticationError | access_denied | 鉴权失败 |
| OperationDenied | access_denied | 操作被拒绝 |
| ModelNotOpen | access_denied | 模型未开通 |
| AccountOverdueError | settlement_failed | 账户欠费 |
| OperationDenied.ServiceOverdue | settlement_failed | 服务欠费 |
| InternalServiceError | provider_failed | 服务内部错误，请稍后重试 |

