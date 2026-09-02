# agnes-video-2-5

> 供应商：sapiens ｜ 版本：2.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://wiki.agnes-ai.com/en/docs/agnes-video-25](https://wiki.agnes-ai.com/en/docs/agnes-video-25)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_image、reference_video、audio
- **生成音频**：支持
- **备注**：官方文档托管于 Agnes AI 文档站（wiki.agnes-ai.com；AA 榜单标注厂商为 Sapiens AI，二者为同一产品线）。支持文生视频、首帧/首尾帧关键帧控制、多模态参考生视频（图/音频/视频混合，含视频运动/节奏参考）、音视频协同、多输出比例。三种 mode：text（禁传媒体）、keyframe（需 first_frame 或 last_frame）、reference（需至少一个 images/audios/videos）。参考素材均以公网 URL 传入。定价与错误码另见 pricing.md / code.md 页。
## 输入限制

待补充

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 12 秒 |
| 清晰度 | 720p、2k |
| 画面比例 | 21:9、16:9、4:3、1:1、3:4、9:16 |
| 比例模式 | client_choice |

> 支持参数：aspect_ratio、duration、resolution

> 备注：seconds 为字符串 "4"~"12"（默认 "5"），n 固定 1。size 三档 720P/960P/2K（960P 不在 schema resolution 枚举内，故未列入数组）；比例默认 16:9，不支持 auto。text 模式禁传媒体；keyframe 模式需至少 first_frame 或 last_frame、禁 images/audios/videos；reference 模式需至少一个非空 images/audios/videos、禁首尾帧，提示词中 <Picture N>/<Audio N>/<Video N> 各自从 1 独立编号。图片格式/像素/大小上限、提示词字数上限官方未给出。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 12 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Agnes-Video-2.5 | 25 | 1034 | 8 | 5999 | 2026-08 | — | 1.50 |
| AA·文生 | Agnes-Video-2.5 | 21 | 1080 | 9 | 5793 | 2026-08 | — | 1.50 |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.025 |
| 960p | 0.04 |
| 2k | 0.055 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://wiki.agnes-ai.com/en/docs/agnes-video-25

> 备注：按输出分辨率档每秒计费：720P $0.025 / 960P $0.040 / 2K $0.055；输入图前 5 张免费、第 6 张起 $0.005/张；输入视频秒数按所选输出分辨率档计费（无单独输入视频计费项）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 400 | invalid_parameter | 请求参数缺失或不合法，或 mode/媒体组合错误、时长/比例不支持 |
| 401 | access_denied | API Key 无效、过期或未授权 |
| 402 | settlement_failed | 账户余额或配额不足 |
| 403 | access_denied | 无该模型/资源权限，或网络/地域访问被拦截 |
| 404 | invalid_parameter | 任务/视频 ID 不存在（或 API 路径/模型名错误） |
| 429 | quota_exceeded | 触发限流（RPM），请退避重试 |
| 500 | provider_failed | 服务内部错误 |

