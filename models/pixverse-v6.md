# pixverse-v6

> 供应商：aishi ｜ 版本：6 ｜ 信息核实日期：2026-09-01
> 来源：[https://docs.platform.pixverse.ai/v6-2056814m0](https://docs.platform.pixverse.ai/v6-2056814m0)

## 能力
- **任务类型**：generate、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_video、reference_image
- **生成音频**：支持
- **特色能力**：multi-shot
- **备注**：爱诗科技 PixVerse V6。支持文生视频、图生视频、首尾帧转场、参考生视频(Fusion)、视频延长；quality 360p/540p/720p/1080p，duration 1-15s；支持 inline 音频生成(generate_audio_switch)与多镜头(generate_multi_clip_switch)。视频编辑(Modify/Restyle/Swap)走独立 endpoint，不属于 V6 模型本体。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | jpeg、png、webp |
| 图片最大边长 | 10000 |
| 参考视频最大时长 | 30 秒 |
| 参考视频格式 | mp4、mov |
| 补充提示词上限 | 5000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 15 秒 |
| 清晰度 | 360p、540p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、2:3、3:2、21:9 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 音频额外计费 | 是 |

> 备注：文生视频(t2v)/Fusion 支持 aspect_ratio 枚举；图生视频(i2v, img_id 单图)、首尾帧转场(transition, first_frame_img+last_frame_img 双图)、Fusion 用 image_references 多图(未标注上限)，这些子任务不传 aspect_ratio（继承参考图）。音频为 inline 生成(generate_audio_switch 开关)，无参考音频参数，官方文档未提供 max_reference_audios。seed 0-2147483647。视频输入(extend/fusion)限 mp4/mov、≤1920px、≤50MB、≤30s。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 1 ~ 15 秒 |
| 清晰度 | 360p、540p、720p、1080p |
| 画面比例 | 待补充 |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 音频额外计费 | 是 |

> 备注：延长任务官方文档明确不支持 aspect_ratio（参数表标 ❌，自动继承待延长视频）。音频为 inline 生成，无参考音频参数，官方文档未提供 max_reference_audios。输入视频限 mp4/mov、≤1920px、≤50MB、≤30s。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 价格

- **币种**：USD
- **计费单位**：second

| 清晰度 | 单价（积分/秒） |
| --- | --- |
| 360p | 5 |
| 540p | 7 |
| 720p | 9 |
| 1080p | 18 |

> 备注：积分/秒（无音频档）。含音频档 360p:7 / 540p:9 / 720p:12 / 1080p:23；Fusion 输入含 video_references 时翻倍（如 720p 无音频 18、含音频 24）。$1≈5 条 720p/5s/无音频（Starter 包）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 99999 | provider_failed | 未知错误 |
| 400011 | invalid_parameter | 参数为空 |
| 400012 | access_denied | 账号无效 |
| 400013 | invalid_parameter | 参数绑定无效：类型或值不正确 |
| 400017 | invalid_parameter | 参数无效 |
| 400018 | invalid_parameter | 提示词/负向提示词超长 |
| 400019 | invalid_parameter | 提示词/负向提示词超长 |
| 400032 | invalid_parameter | 图片 ID 无效 |
| 500008 | invalid_parameter | 请求的数据不存在 |
| 500020 | access_denied | 用户无此操作权限 |
| 500030 | invalid_parameter | 图片大小超过 20M/10000px |
| 500031 | provider_failed | 获取图片信息失败 |
| 500032 | invalid_parameter | 图片格式无效 |
| 500033 | invalid_parameter | 图片宽高无效 |
| 500041 | provider_failed | 图片上传失败 |
| 500042 | invalid_parameter | 图片路径无效 |
| 500044 | quota_exceeded | 并发生成数已达上限 |
| 500054 | content_violation.safety | 图片内容不合规，请更换图片 |
| 500060 | quota_exceeded | 本月特效激活额度用尽 |
| 500063 | content_violation.safety | 视频/图片/文本审核不通过，请重新输入 |
| 500064 | invalid_parameter | 内容已删除 |
| 500069 | provider_failed | 系统高负载，请稍后重试 |
| 500070 | invalid_parameter | 当前模板未激活 |
| 500071 | invalid_parameter | 该特效不支持 720p/1080p |
| 500090 | quota_exceeded | 余额不足，请充值积分 |
| 500100 | provider_failed | 服务端内部错误 |

