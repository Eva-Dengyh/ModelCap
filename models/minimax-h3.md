# minimax-h3

> 供应商：minimax ｜ 版本：h3 ｜ 信息核实日期：2026-09-01
> 来源：[https://platform.minimax.io/docs/api-reference/video-generation-v2-create](https://platform.minimax.io/docs/api-reference/video-generation-v2-create)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、i2v-middle-frame、r2v
- **接受输入**：reference_video、reference_image、audio
- **生成音频**：支持
- **备注**：MiniMax-H3（海螺 H3）。支持文生视频、图生视频（首/中/尾帧）、参考生视频；输出 768P/2K，4-15s。同系列 MiniMax-H3-Max 为快速版（仅 480P/768P、5-15s，无中帧与参考生视频）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 9 |
| 参考视频上限（条） | 3 |
| 参考音频上限（条） | 3 |
| 图片大小上限 | 31457280 字节 |
| 图片格式 | jpeg、png、webp、heic、heif |
| 图片最小边长 | 256 |
| 图片最大边长 | 5760 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 参考视频最小时长 | 2 秒 |
| 参考视频最大时长 | 15 秒 |
| 参考视频格式 | mp4、mov |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 15 秒 |
| 清晰度 | 768p、2k |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 3 |

> 备注：t2v ratio 必填且不可 adaptive；i2v ratio 固定 adaptive（继承输入图）；r2v ratio 可选默认 adaptive；音频通过 reference_audio 参考音色，无独立 generate_audio 开关；音频额外计费官方文档未提供（仅提示使用 Pay-as-you-go API）；视频 ≤50MB、FPS 23.976~60；请求体 ≤64MB。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 价格

待补充

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| bad_request_error | invalid_parameter | 请求参数无效（如 prompt 为空） |
| authorized_error | access_denied | 鉴权失败，请在 Authorization 请求头携带 API Key |
| insufficient_balance_error | settlement_failed | 账户余额不足，请充值后重试 |
| unprocessable_entity_error | content_violation.safety | 视频描述含敏感内容 |
| rate_limit_error | quota_exceeded | 触发限流，请稍后重试 |
| overloaded_error | provider_failed | 服务过载，请稍后重试 |
| server_error | provider_failed | 服务端内部错误 |

