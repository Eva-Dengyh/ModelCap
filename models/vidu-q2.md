# vidu-q2

> 供应商：shengshu ｜ 版本：q2 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.platform.vidu.com/334383376e0](https://docs.platform.vidu.com/334383376e0)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、r2v
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：生数科技 Vidu Q2（标准版 viduq2）。支持文生视频(Text To Video)与参考生视频(Reference To Video)，时长 1-10s、分辨率 540p/720p/1080p；图生视频(Image To Video)与首尾帧(Start End To Video)任务需用 viduq2-pro / viduq2-turbo / viduq2-pro-fast 变体。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 52428800 字节 |
| 图片格式 | jpeg、png、webp |
| 图片最小边长 | 128 |
| 图片比例范围 | 0.25 ~ 4 |
| 补充提示词上限 | 1500 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 10 秒 |
| 清晰度 | 540p、720p、1080p |
| 画面比例 | 16:9、9:16、3:4、4:3、1:1 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：文生视频时长 1-10s（默认 5s），分辨率默认 720p、可选 540p/720p/1080p；3:4 与 4:3 仅 q2 系列支持。style(general/anime)对 q2 不生效；movement_amplitude 取值 auto/small/medium/large。参考生视频图 1-7 张（图需 ≥128x128px、比例 1:4~4:1、单张 ≤50MB、PNG/JPEG/JPG/WebP）。音频仅 bgm(boolean, 自动配乐) 参数；官方文档未提供参考音频数量上限与音频额外计费（credits 为整次调用消耗积分，未拆分音频档）。变体：viduq2-pro 与 viduq2-turbo 用于图生视频/首尾帧（时长 1-10s/2-8s、540p/720p/1080p），viduq2-pro-fast 更快（1-10s/1-8s、720p/1080p）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | vidu-q2-turbo | 31 | 1243 | 17 | 2509 | — | — | — |
| LMArena·图生 | vidu-q2-pro | 37 | 1223 | 17 | 2614 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| BadRequest | invalid_parameter | 请求无效 |
| FieldLacking | invalid_parameter | 缺少必填字段 |
| FieldUnwanted | invalid_parameter | 含多余字段 |
| FieldItemCountOutOfRange | invalid_parameter | 字段元素数量超限 |
| PageSizeOutOfRange | invalid_parameter | 图片大小/格式/比例不合规（≤50MB、JPG/PNG/JPEG/WEBP、比例 <1:4 或 >4:1） |
| ImageDownloadFailure | invalid_parameter | 图片链接下载失败，请检查 URL 有效性 |
| OperationInProcess | provider_failed | 请求正在处理中，请稍后重试 |
| ImageFormatInvalid | invalid_parameter | 图片格式不符合要求 |
| AuditSubmitIllegal | content_violation.safety | 输入未通过安全审核 |
| CreditInsufficient | quota_exceeded | 积分不足 |
| CreationPolicyViolation | content_violation.safety | 生成内容触发策略违规 |
| ModelUnavailable | provider_failed | 模型不可用，请检查模型类型 |
| UserCancelled | interrupted | 用户手动终止任务 |
| FieldInvalid | invalid_parameter | 传入参数未通过有效性校验 |
| ImageCheckBodyJointsFailed | invalid_parameter | 输入图片人体检测失败，请重新上传 |
| ImageCheckFaceFailed | invalid_parameter | 输入图片人脸检测失败，请重新上传 |
| ImageObjectsUndetected | invalid_parameter | 输入图片人体/人脸遮挡过多，请重新上传 |
| Unauthorized | access_denied | 未授权（Token 无效） |
| Forbidden | access_denied | 请求被禁止 |
| TaskNotFound | invalid_parameter | 任务 ID 不存在 |
| CreationNotFound | invalid_parameter | 成片 ID 不存在 |
| NotFound | invalid_parameter | 请求的资源不存在 |
| Conflict | provider_failed | 资源键冲突 |
| QuotaExceeded | quota_exceeded | 超出并发上限，请联系支持 |
| TooManyRequests | quota_exceeded | 请求过于频繁 |
| SystemThrottling | quota_exceeded | 超出资源限制 |
| Canceled | interrupted | 请求被取消 |
| InternalServiceFailure | provider_failed | 服务端内部错误，请稍后重试 |

