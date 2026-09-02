# kling-2-6

> 供应商：kling ｜ 版本：2.6 ｜ 信息核实日期：2026-09-02
> 来源：[https://kling.ai/document-api/api/video/2-6/text-to-video](https://kling.ai/document-api/api/video/2-6/text-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image、audio
- **生成音频**：支持
- **备注**：官方 Open Platform 无独立 "kling-2.6-pro" 模型 slug：新接口为 kling-2.6（/text-to-video、/image-to-video、/motion-control 端点），legacy V1 接口 model_name=kling-v2-6 + mode:pro/std/4k（"pro"≈1080P 档，为推断映射）。audio= native|off，默认 off，原生音频仅 1080P；i2v 支持音色引用（≤2 个 voice，指定音色时 audio 不能为 off）。motion control 独立端点以参考视频驱动动作（人物朝向按 image/video 分：与视频一致时参考视频 ≤30s，与图一致时 ≤10s）。生成结果 30 天后清理。中国/新加坡两个 API 域名。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 52428800 字节 |
| 图片格式 | jpg、jpeg、png |
| 图片最小边长 | 300 |
| 图片比例范围 | 0.4 ~ 2.5 |
| 参考视频最小时长 | 3 秒 |
| 参考视频最大时长 | 30 秒 |
| 参考视频格式 | mp4、mov |
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
| 生成音频 | 支持 |
| 参考音频上限 | 2 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：t2v：duration 5/10（默认 5）、720p/1080p（默认 720p）、16:9/9:16/1:1（默认 16:9），audio native/off（默认 off，native 仅 1080p）。i2v：首帧必填、尾帧选填（不支持仅尾帧）；请求无 aspect_ratio 字段（输出比例随首帧图，官方未给出原文确认）；首尾帧生成仅支持 1080P；音色引用 ≤2 且此时 audio 不可为 off。motion control：独立端点无 duration 参数（输出可能短于参考视频），character_orientation 必填（image/video），参考视频 mp4/mov ≤100MB、宽高 340~3850px。prompt 统一 ≤2500 字符。新接口无 4K、无 cfg_scale（v2.x 不支持）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Kling 2.6 Pro (January) | 27 | 1002 | 7 | 8041 | 2026-01 | — | 8.40 |
| AA·文生 | Kling 2.6 Pro (January) | 31 | 984 | 7 | 8414 | 2026-01 | — | 8.40 |
| LMArena·图生 | kling-2.6-pro | 24 | 1293 | 8 | 202178 | — | — | — |
| LMArena·文生 | kling-2.6-pro | 27 | 1216 | 7 | 73066 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


- **价格快照日期**：2026-09-02

- **价格来源**：https://kling.ai/document-api/api/video/2-6/text-to-video

> 备注：官方文档未公开具体单价/积分数值；计量机制：按输出视频时长扣减（motion control 明确"积分扣减以输出视频时长为准"），billing 响应含 charge_type=cash/unit、currency=CNY/USD、package_type=video/image/audio、list_price 刊例价。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 401_1000-1004 | access_denied | 鉴权失败：Authorization 为空/无效/未生效/已过期 |
| 429_1100 | access_denied | 账号状态异常 |
| 429_1101 | settlement_failed | 账号欠费（后付费） |
| 429_1102 | quota_exceeded | 资源包已耗尽或过期（预付费） |
| 403_1103 | access_denied | 无权访问该 API/模型 |
| 400_1200-1201 | invalid_parameter | 请求参数非法，见 message 字段 |
| 404_1202 | invalid_parameter | 请求方法无效 |
| 404_1203 | invalid_parameter | 请求的资源（如模型）不存在 |
| 400_1300 | content_violation.safety | 请求被平台策略拦截（语义未细分，官方仅写 strategy 触发） |
| 400_1301 | content_violation.safety | 触发平台内容安全策略 |
| 429_1302 | quota_exceeded | 请求过于频繁，触发限流 |
| 429_1303 | quota_exceeded | 并发/QPS 超出预付费资源包限额 |
| 429_1304 | access_denied | 触发平台 IP 白名单策略 |
| 500_5000 | provider_failed | 服务内部错误 |
| 503_5001 | provider_failed | 服务暂时不可用（通常为维护中） |
| 504_5002 | timeout | 服务内部超时（任务积压） |

