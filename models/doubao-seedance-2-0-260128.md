# doubao-seedance-2-0-260128

> 供应商：volcengine ｜ 版本：2.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.volcengine.com/docs/82379/2291680?lang=zh](https://docs.volcengine.com/docs/82379/2291680?lang=zh)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_video、reference_image、audio
- **生成音频**：支持
- **备注**：Doubao Seedance 2.0 系列主模型。同系列另有 Fast、Mini 降配版（能力基本一致，仅输出分辨率限于 480p/720p，品质与成本取舍不同）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 9 |
| 参考视频上限（条） | 3 |
| 参考音频上限（条） | 3 |
| 图片大小上限 | 31457280 字节 |
| 图片格式 | jpeg、png、webp、bmp、tiff、gif、heic、heif |
| 图片最小边长 | 300 |
| 图片最大边长 | 6000 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 参考视频最小时长 | 2 秒 |
| 参考视频最大时长 | 15 秒 |
| 参考视频格式 | mp4、mov |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 15 秒 |
| 清晰度 | 480p、720p、1080p、4k |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 3 |
| 音频额外计费 | 否 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：全模态参考：可组合文本/图片(0~9)/视频(0~3)/音频(0~3)；不支持“文本+音频”与“纯音频”输入；4k 仅标准版支持（10bit/H.265）；ratio 可选 adaptive（默认值）；生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 15 秒 |
| 清晰度 | 480p、720p、1080p、4k |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 3 |
| 音频额外计费 | 否 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 15 秒 |
| 清晰度 | 480p、720p、1080p、4k |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 3 |
| 音频额外计费 | 否 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：支持向前/向后延长 1 段视频，或最多 3 段视频串联补全过渡；生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Dreamina Seedance 2.0 720p | 2 | 1190 | 6 | 17684 | 2026-03 | — | 9.07 |
| AA·文生 | Dreamina Seedance 2.0 720p | 5 | 1221 | 5 | 24731 | 2026-03 | — | 9.07 |
| AA·编辑 | Dreamina Seedance 2.0 720p | 6 | 1040 | 5 | 23284 | 2026-03 | — | 5.57 |
| LMArena·图生 | dreamina-seedance-2.0-720p | 4 | 1477 | 8 | 110372 | — | — | — |
| LMArena·文生 | dreamina-seedance-2.0-720p | 4 | 1479 | 9 | 51266 | — | — | — |
| LMArena·编辑 | dreamina-seedance-2.0-720p | 5 | 1365 | 14 | 3852 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InputImageSensitiveContentDetected.PrivacyInformation | content_violation.real_person | 输入图片可能包含真人，请您更换后重试。 |
| InputVideoSensitiveContentDetected.PrivacyInformation | content_violation.real_person | 输入视频可能包含真人，请您更换后重试。 |
| InputImageSensitiveContentDetected | content_violation.safety | 输入图像可能包含敏感信息，请您更换后重试。 |
| InputVideoSensitiveContentDetected | content_violation.safety | 输入视频可能包含敏感信息，请您更换后重试。 |
| InputAudioSensitiveContentDetected | content_violation.audio | 输入音频可能包含敏感信息，请您更换后重试。 |
| InputTextSensitiveContentDetected | content_violation.safety | 输入文本可能包含敏感信息，请您更换后重试。 |
| OutputVideoSensitiveContentDetected | content_violation.safety | 生成的视频可能包含敏感信息，请您更换输入内容后重试。 |
| OutputAudioSensitiveContentDetected | content_violation.audio | 生成的音频可能包含敏感信息，请您更换输入内容后重试。 |
| InputImageSensitiveContentDetected.PolicyViolation | content_violation.copyright | 输入图片可能涉及版权限制，请您更换后重试。 |
| InputVideoSensitiveContentDetected.PolicyViolation | content_violation.copyright | 输入视频可能涉及版权限制，请您更换后重试。 |
| InputAudioSensitiveContentDetected.PolicyViolation | content_violation.copyright | 输入音频可能涉及版权限制，请您更换后重试。 |
| OutputVideoSensitiveContentDetected.PolicyViolation | content_violation.copyright | 生成的视频可能涉及版权限制，请您更换输入内容后重试。 |
| OutputAudioSensitiveContentDetected.PolicyViolation | content_violation.copyright | 生成的音频可能涉及版权限制，请您更换输入内容后重试。 |
| InvalidParameter | invalid_parameter | 请求包含非法参数，请查阅 API 文档。 |
| MissingParameter | invalid_parameter | 请求缺少必要参数，请查阅 API 文档。 |
| RateLimitExceeded.EndpointRPMExceeded | quota_exceeded | 请求所关联的推理接入点已超过 RPM 限制，请稍后重试。 |
| AccountRateLimitExceeded | quota_exceeded | 请求超出 RPM/TPM 限制，请稍后重试。 |
| InternalServiceError | provider_failed | 内部系统异常，请您稍后重试。 |

