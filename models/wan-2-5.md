# wan-2-5

> 供应商：aliyun ｜ 版本：2.5 ｜ 信息核实日期：2026-09-02
> 来源：[https://help.aliyun.com/zh/model-studio/wan2-5-t2v](https://help.aliyun.com/zh/model-studio/wan2-5-t2v)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image、audio
- **生成音频**：支持
- **备注**：百炼 2.5 系列只有带 -preview 的两个 id：wan2.5-t2v-preview / wan2.5-i2v-preview（preview 即正式对外 API 名，无日期快照、无 -us/-flash 变体）。只支持文生与图生首帧（旧版协议，仅首帧生视频）。北京地域默认生成有声视频（自动配音或传 input.audio_url）；新加坡地域无声输出（仅 Text/Image→Video）。无 shot_type（多镜头仅 wan2.6）、无声开关不支持（那是 2.6-i2v-flash）。i2v 北京支持模型调优，新加坡不支持。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | jpeg、jpg、png、bmp、webp |
| 图片最小边长 | 240 |
| 图片最大边长 | 8000 |
| 补充提示词上限 | 1500 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4 |
| 生成音频 | 支持 |

> 备注：t2v 与 i2v 的 duration 均只支持 5/10（默认 5）。t2v 用 size="宽*高"（默认 1920*1080=1080P），可选 480P/720P/1080P 全档：480P 档 832*480/480*832/624*624（仅 16:9/9:16/1:1），720P 与 1080P 档含 16:9/9:16/1:1/4:3/3:4 像素组合。i2v 用 resolution 480P/720P/1080P（默认 1080P），输出比例尽量随输入图（长宽须为 16 倍数会微调）。北京默认有声+自动配音，audio_url：wav/mp3、3–30s、≤15MB、1 条（超长截取、不足后半无声）；新加坡无声输出。prompt ≤1500（自动截断）、negative_prompt ≤500；prompt_extend 默认 true；watermark 默认 false；seed ∈ [0, 2^31-1]。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | wan2.5-i2v-preview | 20 | 1321 | 10 | 16913 | — | — | — |
| LMArena·文生 | wan2.5-t2v-preview | 23 | 1247 | 9 | 30497 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 480p | 0.3 |
| 720p | 0.6 |
| 1080p | 1 |

> 备注：北京价（元/秒），t2v 与 i2v 同价、仅按分辨率档：480P 0.3 / 720P 0.6 / 1080P 1。新加坡（国际）480P 0.366962 / 720P 0.733924 / 1080P 1.100886（官方两页小数末位略有出入，按 ×1.2232 关系标注）。RPM 300；新用户免费额度 50 秒。无有声/无声分档（无声仅 2.6-i2v-flash）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InvalidApiKey | access_denied | API Key 无效或缺失 |
| NOT AUTHORIZED | access_denied | WorkspaceId 无效或非业务空间成员 |
| AccessDenied | access_denied | 无权限（含异步接口缺 X-DashScope-Async 头的同步调用报错） |
| AccessDenied.Unpurchased | access_denied | 未开通百炼服务 |
| Model.AccessDenied | access_denied | 无模型访问权限 |
| InvalidParameter | invalid_parameter | 参数不合法（如 size 值错误） |
| InvalidImage | invalid_parameter | 图片输入不合法 |
| DataInspectionFailed | content_violation.safety | 输入/输出含疑似敏感内容被拦截 |
| IPInfringementSuspect | content_violation.copyright | 输入内容涉嫌知识产权侵权 |
| Arrearage | settlement_failed | 账户欠费 |
| Throttling | quota_exceeded | 触发 RPS/RPM 限流 |
| InternalError | provider_failed | 服务内部错误 |

