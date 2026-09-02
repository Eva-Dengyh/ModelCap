# flux-3-video

> 供应商：black-forest-labs ｜ 版本：3 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.bfl.ai/flux_3/flux3_video](https://docs.bfl.ai/flux_3/flux3_video)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image、reference_video
- **生成音频**：支持
- **特色能力**：multi-shot、lip-sync
- **备注**：BFL 官方 API（POST api.bfl.ai/v1/flux-3-video）preview 模型（博客 2026-08-04）。mode 由请求显式指定：t2v（仅 prompt）/ i2v（1–10 张 keyframes，可钉首/尾/中间任意时刻，3+ 张需设 duration）/ v2v（视频续写，start_video，mp4）/ draft_enhance（用 draft_cache 全质量复现同一次生成）。编辑与 Omni Reference（图+视频）官方说 coming soon。原生生成同步音频默认开（多语言语音+强口型同步+音效），generate_audio=false 可关；无二次模型/二次 pass。单请求内支持多场景多机位。官方文档当前只有 version="latest"，榜单里的日期版 flux-3-video-20260811 官方未发布。draft 快预演结果只出 hd。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 10 |
| 参考视频上限（条） | 1 |
| 参考视频格式 | mp4 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 20 秒 |
| 生成音频 | 支持 |

> 支持参数：duration、generate_audio

> 备注：duration 整数 5–20（t2v/i2v）或 5–15（v2v），或 "auto"（默认，按内容自动定长；keyframes 带 [秒,图] 定时时 auto 跑到最后一对时间向上取整，20s 上限）。resolution 为 hd（默认）/fhd 两级（fhd 经 upsampler，精确像素随宽高比，16:9 下 fhd=1920×1088），未用 schema 的档位枚举。aspect_ratio：auto（默认）/21:9/2:1/16:9/4:3/1:1/3:4/9:16。generate_audio 默认 true（false=无声片）。safety_tolerance 0–4 默认 2（0 最严）。draft=true 返回 draft_cache。异步任务 + polling_url，鉴权头 x-key；结果 signed .mp4 URL 约 2 小时过期。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 20 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | flux-3-video-20260811 | 7 | 1447 | 6 | 14087 | — | — | — |
| LMArena·文生 | flux-3-video | 3 | 1495 | 17 | 1287 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| t2v/i2v·hd | 0.17 |
| t2v/i2v·fhd | 0.29 |
| v2v·hd | 0.43 |
| v2v·fhd | 0.54 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://docs.bfl.ai/flux_3/flux3_video

> 备注：官方按输出秒计费：t2v 与 i2v 5–20s 为 $0.17/s(hd)/$0.29/s(fhd)；v2v 视频续写 5–15s 为 $0.43/s(hd)/$0.54/s(fhd)；draft 约 $0.06/s（约为全量渲染 1/3）。API 响应 cost 字段为 credits（美元换算关系未公开）。

## 错误码

待补充（官方无数值型错误码表；HTTP 422 为参数校验错误（schema 会把每个 mode 展开校验）；轮询状态 Request Moderated / Content Moderated（内容审核拒绝）/ Ready / Error。）

