# doubao-seedance-2-5-260628

> 供应商：volcengine ｜ 版本：2.5 ｜ 信息核实日期：2026-09-01
> 来源：[https://docs.volcengine.com/docs/82379/2607688?lang=zh](https://docs.volcengine.com/docs/82379/2607688?lang=zh)

## 能力
- **任务类型**：generate、edit、extend
- **接受输入**：reference_video、reference_image、audio
- **生成音频**：支持
- **备注**：新一代视频创作模型：单次生成 30 秒并支持多轮延长，单次参考多模态素材上限 50 个（30 图 + 10 视频 + 10 音频），支持纯音频参考，新增 mov 输出与原生多语言。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 30 |
| 参考视频上限（条） | 10 |
| 参考音频上限（条） | 10 |
| 素材合计上限 | 50 |
| 图片大小上限 | 31457280 字节 |
| 图片格式 | jpeg、png、webp、bmp、tiff、gif、heic、heif |
| 图片最小边长 | 300 |
| 图片最大边长 | 6000 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 参考视频最小时长 | 2 秒 |
| 参考视频最大时长 | 30 秒 |
| 参考视频格式 | mp4、mov |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 30 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 10 |
| 音频额外计费 | 否 |

> 备注：首帧/首尾帧子任务 ratio 必须 adaptive（自动保持与首帧图一致）；duration 支持 [4,30] 或 -1；生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 固定 -1（由服务端决定，客户端禁止自定义） |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | adaptive |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | inherit_from_reference_video |
| 生成音频 | 支持 |
| 参考音频上限 | 10 |
| 音频额外计费 | 否 |

> 备注：编辑任务 duration 强制 -1、ratio 强制 adaptive（自动保持与待编辑视频一致）；参考视频时长须在 [4,30]s，输出时长误差不超过 0.4s；生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 30 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | adaptive |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 10 |
| 音频额外计费 | 否 |

> 备注：延长任务 ratio 必须 adaptive（自动保持与待延长视频一致）；duration 支持 [4,30] 或 -1；生成音频不额外计费（价格按分辨率与输入是否含视频区分，有声/无声同价）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 30 秒 |
| 画面比例模式 | client_choice |

## 价格

待补充

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InvalidParameter.TaskTypeMismatch | invalid_parameter | 实际判定的任务类型与指定的 omni_reference_task_type 不一致，请调整提示词写法或任务类型参数 |
| InvalidParameter.TaskTypeConstraint | invalid_parameter | 参数配置与任务类型不兼容，请按任务类型调整 ratio/duration/参考素材 |
| 429 Too Many Requests | quota_exceeded | 触发限流，请降低请求频率或稍后重试 |

