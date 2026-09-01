# kling-v3-omni-video-generation

> 供应商：aliyun ｜ 版本：v3 ｜ 信息核实日期：2026-09-01
> 来源：[https://help.aliyun.com/en/model-studio/kling-video-generation-api-reference/](https://help.aliyun.com/en/model-studio/kling-video-generation-api-reference/)

## 能力
- **任务类型**：generate、edit
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_video、reference_image
- **生成音频**：支持
- **备注**：Kling v3 Omni（可灵 v3），经阿里云百炼 Model Studio 提供。支持文生/首帧/首尾帧/参考生视频与视频编辑。同系列另有 v3（无参考生视频/编辑）、v3-turbo（无 4k、仅首帧）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 7 |
| 参考视频上限（条） | 1 |
| 图片大小上限 | 10485760 字节 |
| 图片格式 | jpeg、png |
| 图片最小边长 | 300 |
| 图片最大边长 | 8000 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 参考视频最小时长 | 3 秒 |
| 参考视频最大时长 | 15 秒 |
| 参考视频格式 | mp4、mov |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 3 ~ 15 秒 |
| 清晰度 | 720p、1080p、4k |
| 画面比例 | 16:9、9:16、1:1 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：mode: std(720P)/pro(1080P)/4k；duration 3~15s（feature 参考视频时 3~10s），默认 5；audio 默认 false（静音）；首帧/首尾帧场景 aspect_ratio 可不设（继承首帧图）；图片 JPEG/JPG/PNG（无 alpha）；视频 3~15.5s、FPS 24~60、≤200MB。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 固定 -1（由服务端决定，客户端禁止自定义） |
| 清晰度 | 720p、1080p、4k |
| 画面比例 | 16:9、9:16、1:1 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | inherit_from_reference_video |
| 生成音频 | 支持 |

> 备注：视频编辑（base）：输出时长/宽高比继承输入视频，duration 参数被忽略；base 1 个视频，refer 参考图+实体 ≤4；传入视频时 audio 只能 false。

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
| InvalidParameter | invalid_parameter | 请求参数不合法，请检查参数取值 |
| InvalidParameter.DataInspection | invalid_parameter | 媒体资源下载失败，请检查图片/视频 URL 是否可访问 |
| DataInspectionFailed | content_violation.safety | 输入或输出含疑似敏感内容被拦截，请修改输入后重试 |
| BadRequest.EmptyInput | invalid_parameter | 缺少必填参数 |
| BadRequest.EmptyModel | invalid_parameter | 缺少模型参数 |
| BadRequest.IllegalInput | invalid_parameter | 请求体需为合法 JSON |
| BadRequest.TooLarge | invalid_parameter | 请求体过大 |
| BadRequest.UnsupportedFileFormat | invalid_parameter | 文件格式不支持 |
| BadRequest.InputDownloadFailed | invalid_parameter | 输入文件下载失败 |
| InvalidFile.Size | invalid_parameter | 文件大小超限（视频 ≤200MB） |
| InvalidFile.Duration | invalid_parameter | 视频/音频时长超限 |
| InvalidFile.Format | invalid_parameter | 文件格式不支持 |
| InvalidFile.FPS | invalid_parameter | 视频 FPS 不合法 |
| InvalidFile.Resolution | invalid_parameter | 图像分辨率不合法 |
| InvalidFile.AspectRatio | invalid_parameter | 文件宽高比不合法 |
| InvalidImage.ImageSize | invalid_parameter | 图片大小超限 |
| InvalidImage.FileFormat | invalid_parameter | 图片格式不支持 |
| InvalidImage.NoHumanFace | invalid_parameter | 未检测到人脸 |
| InvalidFile.NoHuman | invalid_parameter | 输入图/视频无人像 |
| InvalidFile.MultiHuman | invalid_parameter | 输入图含多人像 |
| InvalidURL.ConnectionRefused | invalid_parameter | 下载媒体资源连接被拒绝 |
| InvalidURL.Timeout | invalid_parameter | 下载媒体资源超时 |
| Throttling | quota_exceeded | 触发限流，请稍后重试 |
| Throttling.RateQuota | quota_exceeded | 请求频率超出配额 |
| Throttling.BurstRate | quota_exceeded | 请求增长过快，请平滑请求节奏 |
| Throttling.AllocationQuota | quota_exceeded | 配额已用完 |
| Throttling.Concurrency | quota_exceeded | 并发请求超出上限 |
| InternalError | provider_failed | 服务端内部错误 |
| InternalError.FileUpload | provider_failed | OSS 上传失败 |
| InternalError.Upload | provider_failed | 结果上传失败 |
| InternalError.Algo | provider_failed | 算法推理内部错误 |
| InternalError.Timeout | timeout | 内部执行超时 |
| AccessDenied.Unpurchased | access_denied | 未开通服务或无模型使用权限 |
| Model.AccessDenied | access_denied | 模型访问被拒绝 |
| Arrearage | settlement_failed | 账户欠费，请充值后重试 |
| AllocationQuota.FreeTierOnly | quota_exceeded | 免费额度已用完 |

