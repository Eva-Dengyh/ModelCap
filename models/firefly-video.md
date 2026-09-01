# firefly-video

> 供应商：adobe ｜ 版本：3.0 ｜ 信息核实日期：2026-09-01
> 来源：[https://developer.adobe.com/firefly-services/docs/firefly-api/getting-started/usage-notes/](https://developer.adobe.com/firefly-services/docs/firefly-api/getting-started/usage-notes/)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：Adobe Firefly Video Model，经 Firefly API /v3/videos/generate 提供文生视频，并可用图片作为首帧(position 0)或尾帧(position 1)关键帧引导生成。输出固定 5 秒。OpenAPI 规范中无 audio 字段，未提及音频生成。端点 /v3/videos/generate 详情见 static/firefly-api.json（GitHub: AdobeDocs/ffs-firefly-api）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |
| 图片大小上限 | 15728640 字节 |
| 图片格式 | jpeg、png、webp、tiff |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 5 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1 |
| 比例模式 | client_choice |
| 时长模式 | explicit |

> 备注：时长固定 5 秒（接口描述「Generate a five second video」，无 duration 参数）。sizes 按宽高指定：16:9(1920x1080 / 1280x720 / 960x540)、9:16(1080x1920 / 720x1280 / 540x960)、1:1(1080x1080 / 720x720 / 540x540)，最高 1080P；另有 960x540（约 540P）档位，超出目录清晰度枚举。seeds 恰好 1 个；bitRateFactor 0-63（默认 18，建议 17-23）；videoSettings 支持运镜(8)、风格(10)、机位(5)、景别(5)。限流 4 RPM / 9000 RPD（按组织）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 5 秒 |
| 画面比例模式 | client_choice |

## 价格

待补充

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| validation_error | invalid_parameter | 请求参数校验失败，请检查参数取值 |
| bad_request | invalid_parameter | 请求格式错误，请检查请求体 |
| invalid_content_type | invalid_parameter | 不支持的媒体类型 |
| empty_input_body | invalid_parameter | 请求体为空 |
| rate_limited | quota_exceeded | 触发限流（默认 4 次/分钟），请降低频率或稍后重试 |
| timeout_error | timeout | 任务处理超时 |
| access_error | access_denied | 无权访问，请检查凭证与权限 |
| runtime_error | provider_failed | 服务端运行错误 |
| cai_assertion_violation_error | content_violation.safety | 内容断言违规（可能涉及内容政策） |

