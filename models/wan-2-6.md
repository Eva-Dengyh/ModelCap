# wan-2-6

> 供应商：aliyun ｜ 版本：2.6 ｜ 信息核实日期：2026-09-02
> 来源：[https://help.aliyun.com/zh/model-studio/legacy-wan-text-to-video-api-reference](https://help.aliyun.com/zh/model-studio/legacy-wan-text-to-video-api-reference)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image、audio
- **生成音频**：支持
- **备注**：百炼旧版协议（legacy，2025-12-03 发布）：wan2.6-t2v / wan2.6-i2v（无日期快照后缀；另有 -us/-flash 变体）。只支持生成：文生视频与图生视频-基于首帧（官方 legacy 文档明确"仅支持首帧生视频"，首尾帧/续写属 wan2.7）。参数体系与 2.7 不同：文生用 size="宽*高"、图生用 resolution="720P/1080P" 档位，无 aspect_ratio/duration_mode/generate_audio 等新式字段。默认输出有声视频（自动配音或 input.audio_url）；无声开关仅 wan2.6-i2v-flash 支持。shot_type(single/multi) 仅 wan2.6 系支持且需 prompt_extend=true。task_id 与视频 URL 24h 有效，查询接口 RPS 默认 20。
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
| 时长 | 2 ~ 15 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4 |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：时长 [2,15] 整数默认 5（变体 wan2.6-t2v-us 仅 5/10、wan2.6-i2v-us 仅 5/10/15）。文生 wan2.6-t2v：size 必须是具体像素串且只支持 720P/1080P 两档对应枚举（720P：1280*720、720*1280、960*960、1088*832、832*1088；1080P：1920*1080、1080*1920、1440*1440、1632*1248、1248*1632；默认 1920*1080），无 480P。图生 wan2.6-i2v：resolution 720P/1080P（默认 1080P），输出比例尽量与首帧图一致（长宽须为 16 的倍数会微调）。有声为默认；参数 audio 仅 i2v-flash 支持（audio=true 有声默认/false 无声，优先级 audio > audio_url，无声按无声价计费）。input.audio_url：wav/mp3、3~30s、≤15MB，超长截取、不足后半无声。prompt ≤1500 字（超长自动截断）、negative_prompt ≤500。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | inherit_from_reference_video |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Wan 2.6 | 35 | 893 | 8 | 6393 | 2025-12 | — | 9.00 |
| AA·文生 | Wan 2.6 | 29 | 1028 | 6 | 7747 | 2025-12 | — | 9.00 |
| LMArena·图生 | wan2.6-i2v | 21 | 1311 | 7 | 108068 | — | — | — |
| LMArena·文生 | wan2.6-t2v | 19 | 1329 | 8 | 47267 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.6 |
| 1080p | 1 |

- **价格快照日期**：2026-09-02

- **价格来源**：https://help.aliyun.com/zh/model-studio/legacy-wan-text-to-video-api-reference

> 备注：北京地域价（元/秒），t2v 与 i2v 同价，按 duration 计费（= input_video_duration + output_video_duration，无视频输入故 input 恒 0）；北京有 50 秒免费额度。新加坡 0.733924/1.100886，法兰克福 0.6/1，弗吉尼亚 0.6/1（-us 变体按 0.733924/1.100886）。wan2.6-i2v-flash 分有声/无声档：北京有声 0.3/0.5、无声 0.15/0.25 元/秒。RPM 300（弗吉尼亚 60，us 变体 6000）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InvalidApiKey | access_denied | API Key 错误：填写错误/地域不匹配/套餐 Key 与 Base URL 混用 |
| InvalidParameter | invalid_parameter | 参数不合法，请检查 size/分辨率等取值 |
| Arrearage | settlement_failed | 账户欠费（Access denied, please make sure your account is in good standing） |
| isv.OUT_OF_SERVICE | settlement_failed | 账户余额不足 |
| DataInspectionFailed | content_violation.safety | 输入或输出包含疑似敏感内容，被内容安全拦截 |
| IPInfringementSuspect | content_violation.copyright | 内容涉嫌版权侵权 |
| NOT AUTHORIZED | access_denied | WorkspaceId 无效或非业务空间成员 |
| AccessDenied | access_denied | 未开通/未购买/无模型权限 |
| AccessDenied.Unpurchased | access_denied | 未购买该服务 |
| Model.AccessDenied | access_denied | 无模型访问权限（含异步调用不支持的分支） |
| Throttling | quota_exceeded | 触发 RPS/RPM 限流 |
| Throttling.RateQuota | quota_exceeded | 触发速率配额限制 |

