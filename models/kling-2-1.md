# kling-2-1

> 供应商：kling ｜ 版本：2.1 ｜ 信息核实日期：2026-09-02
> 来源：[https://kling.ai/document-api/api/video/2-1-master/text-to-video](https://kling.ai/document-api/api/video/2-1-master/text-to-video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **备注**：⚠️ 官方已宣布该模型（含 master 与 2.1）将于 2026-09-15 下线，请提前迁移到主力模型。只有 legacy V1 接口（POST /v1/videos/text2video、/image2video）：文生仅 kling-v2-1-master 支持（官方 t2v 枚举无 plain kling-v2-1）；i2v 同时有 kling-v2-1 与 kling-v2-1-master。榜单 kling-v2.1-standard ≈ 官方 kling-v2-1（仅 i2v，推断）、kling-v2.1-master = kling-v2-1-master（推断已标注）。master 只出单镜头；plain 支持首尾帧（image_tail，仅 1080P）；仅尾帧两档都不支持。两档均无声（native-audio 不支持，sound 恒 off）；无多镜头/运镜/动作控制/视频参考/主体控制。时长与分辨率按能力地图为 5s/10s、720P/1080P（无 4K）。生成结果 30 天后清理。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 10485760 字节 |
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

> 备注：能力地图口径 5s/10s（legacy schema 枚举 3~15 为全模型共享，按版本而异，已以能力地图为准）、720P/1080P（无 4K，mode 只能 std/pro）。t2v：aspect_ratio 16:9/9:16/1:1；i2v：请求无 aspect_ratio 字段（比例随首帧图），image 与 image_tail 至少其一，首尾帧仅 plain kling-v2-1 支持且仅 1080P。cfg_scale 对 v2.x 不支持。prompt/negative_prompt ≤2500 字符。图片 jpg/jpeg/png ≤10MB、最小边 300px、比例 1:2.5~2.5:1。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | kling-v2.1-master | 32 | 1234 | 8 | 29824 | — | — | — |
| LMArena·图生 | kling-v2.1-standard | 34 | 1228 | 8 | 29957 | — | — | — |
| LMArena·文生 | kling-v2.1-master | 38 | 1162 | 10 | 14048 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.4 |
| 1080p | 0.7 |

> 备注：官方价格页按输出秒计费（无声档）：Kling 2.1（standard）720P ¥0.4/秒、1080P ¥0.7/秒（约 $0.056/$0.098）；Kling 2.1 Master 价格页仅 1080P ¥2.0/秒（$0.28）、720P 显示 "-"（推断 Master 只按 1080P 计费）。资源包扣减规则，响应含 final_unit_deduction 与 final_balance_deduction(quota/list_price)。

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

