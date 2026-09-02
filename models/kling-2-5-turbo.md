# kling-2-5-turbo

> 供应商：kling ｜ 版本：2.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://kling.ai/document-api/api/video/2-5-turbo/text-to-video](https://kling.ai/document-api/api/video/2-5-turbo/text-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **备注**：官方新接口 POST /text-to-video/kling-2.5-turbo 与 /image-to-video/kling-2.5-turbo（另有 legacy model_name=kling-v2-5-turbo）。榜单名 kling-2.5-turbo-1080p 的 "-1080p" 后缀是榜单侧命名，官方模型就是 kling-2.5-turbo 取 1080p resolution。无声模型（无 audio 字段、native-audio 不支持）；无多镜头/运镜/动作控制/视频参考。i2v 支持仅首帧与首尾帧（首尾帧仅 1080P），不支持仅尾帧。无 4K、无 mode 档位（新接口只有 resolution 720p/1080p）。结果 30 天后清理。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 52428800 字节 |
| 图片格式 | jpg、jpeg、png |
| 图片最小边长 | 300 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 补充提示词上限 | 2500 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：t2v：settings.duration 5/10（默认 5）、resolution 720p/1080p（默认 720p）、aspect_ratio 16:9/9:16/1:1（默认 16:9）。i2v：入参 contents（type ∈ prompt/first_frame/last_frame），无 aspect_ratio 字段（比例随首帧图）；首尾帧仅支持 1080P（settings.resolution 备注原文）。图片 jpg/jpeg/png ≤50MB、≥300px、比例 1:2.5~2.5:1，支持 url 或 base64（不加 data:image 前缀）。prompt ≤2500 字符。watermark_info.enabled 默认 false。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | kling-2.5-turbo-1080p | 25 | 1275 | 12 | 3796 | — | — | — |
| LMArena·文生 | kling-2.5-turbo-1080p | 26 | 1219 | 17 | 2100 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.3 |
| 1080p | 0.5 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://kling.ai/document-api/api/video/2-5-turbo/text-to-video

> 备注：官方价格页（无声，按输出秒）：720P ¥0.3/秒（约 $0.042）、1080P ¥0.5/秒（约 $0.07）。无 4K 档。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 401_1000-1004 | access_denied | 鉴权失败：Authorization 为空/无效/未生效/已过期 |
| 429_1100 | access_denied | 账号状态异常 |
| 429_1101 | settlement_failed | 账号欠费（后付费） |
| 429_1102 | quota_exceeded | 资源包已耗尽或过期（预付费） |
| 403_1103 | access_denied | 无权访问该 API/模型 |
| 400_1200-1201 | invalid_parameter | 请求参数非法（key 错误或 value 非法） |
| 404_1202 | invalid_parameter | 请求方法无效 |
| 404_1203 | invalid_parameter | 请求的资源/模型不存在 |
| 400_1300 | content_violation.safety | 请求被平台策略拦截（语义未细分） |
| 400_1301 | content_violation.safety | 触发平台内容安全策略 |
| 429_1302 | quota_exceeded | 请求过于频繁，触发限流 |
| 429_1303 | quota_exceeded | 并发/QPS 超出预付费资源包限制 |
| 429_1304 | access_denied | 触发平台 IP 白名单策略 |
| 500_5000 | provider_failed | 服务内部错误 |
| 503_5001 | provider_failed | 服务暂时不可用（通常维护中） |
| 504_5002 | timeout | 服务内部超时（任务积压） |

