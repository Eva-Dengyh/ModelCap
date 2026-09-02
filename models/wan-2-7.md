# wan-2-7

> 供应商：aliyun ｜ 版本：2.7 ｜ 信息核实日期：2026-09-02
> 来源：[https://help.aliyun.com/zh/model-studio/text-to-video-api-reference](https://help.aliyun.com/zh/model-studio/text-to-video-api-reference)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_image、reference_video、audio
- **生成音频**：支持
- **备注**：百炼无单一总页，按任务 4 篇：文生 text-to-video-api-reference（wan2.7-t2v / wan2.7-t2v-2026-06-12）、图生 image-to-video-general-api-reference（wan2.7-i2v-2026-04-25：首帧/首尾帧/首段续写）、参考生视频 wan-video-to-video-api-reference（wan2.7-r2v，图+视频+音色）、视频编辑 wan-video-editing-api-reference（wan2.7-videoedit）。全异步（创建任务+轮询），任务/结果链接 24h 有效，任务过期返回 task_status=UNKNOWN；查询 RPS 20；缺 X-DashScope-Async 头报错。有声为默认且不可关（无 audio 开关）；不再支持 size（改用 resolution+ratio）与 shot_type；无 duration=-1 智能时长（那是 Wan 3.0）。北京/新加坡两地可选。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 素材合计上限 | 5 |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | jpeg、jpg、png、bmp、webp |
| 图片最小边长 | 240 |
| 图片最大边长 | 8000 |
| 图片比例范围 | 0.125 ~ 8 |
| 参考视频最小时长 | 1 秒 |
| 参考视频最大时长 | 30 秒 |
| 参考视频格式 | mp4、mov |
| 补充提示词上限 | 5000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 15 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：各子任务差异：t2v 时长 [2,15] 默认 5；i2v（首帧/首尾帧）同样 [2,15] 默认 5，但无 ratio 参数、输出比例尽量与首帧/首段视频一致；r2v 含参考视频时时长 [2,10]、不含 [2,15]（默认 5），参考图+参考视频合计 ≤5 且至少 1 个，首帧图最多 1 张，含首帧图时忽略 ratio。i2v 首帧图仅支持单一角色；多镜头靠 prompt，无 shot_type。图片格式 JPEG/JPG/PNG(不支持透明)/BMP/WEBP、≤20MB、单边 240~8000px、比例 1:8~8:1；音频 wav/mp3、2~30s、≤15MB；negative_prompt ≤500 字。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 10 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4 |
| 时长模式 | inherit_from_reference_video |
| 生成音频 | 支持 |

> 备注：wan2.7-videoedit。duration 默认 0/不传 = 沿用输入视频时长；传值时从原视频 0 秒起截取到该长度（[2,10]），即显式截断而非续写。不传 ratio 时按输入视频比例输出，传 ratio 按指定比例。参考图最多 4 张；输入视频有且仅 1 个（mp4/mov、2~10s、≤100MB）。audio_setting：auto（默认，按 prompt 智能判断是否重生成音频）/ origin（保留输入原声）。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 15 秒 |
| 清晰度 | 720p、1080p |
| 比例模式 | inherit_from_reference_video |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 备注：即 i2v 视频续写（first_clip，可选加尾帧 first_clip+last_frame），每种素材 type 最多一次。注意此 duration 是续写后的输出总时长并按总时长计费：如输入首段 3s、duration=15，则续写 12s、成片 15s 按 15s 计费；首段视频本身 2~10s。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 15 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·文生 | Wan2.7-260612 | 6 | 1157 | 6 | 19399 | 2026-06 | — | 9.00 |
| AA·文生 | Wan 2.7 | 10 | 1106 | 7 | 6098 | 2026-04 | — | 9.00 |
| AA·图生 | Wan 2.7 | 11 | 1084 | 7 | 5592 | 2026-04 | — | 9.00 |
| AA·编辑 | Wan 2.7 | 5 | 1078 | 5 | 19212 | 2026-04 | — | 16.90 |
| LMArena·图生 | wan2.7-i2v | 9 | 1427 | 5 | 66184 | — | — | — |
| LMArena·文生 | wan2.7-t2v | 15 | 1344 | 8 | 20882 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 0.6 |
| 1080p | 1 |

> 备注：北京地域非快照版价格（元/秒），t2v/i2v/r2v/videoedit 同价；新加坡 720P 0.733924 / 1080P 1.100886，东京 0.086012 / 0.143353；快照版（-2026-06-12 等）新加坡价不同（720P 0.74942 / 1080P 1.12413）。RPM 300。无 480P 档。续写按输出总时长计费。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InvalidApiKey | access_denied | API Key 无效或缺失（如 No API-key provided） |
| InvalidParameter | invalid_parameter | 参数不合法，请检查 size/ratio 等字段 |

