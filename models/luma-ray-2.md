# luma-ray-2

> 供应商：luma ｜ 版本：ray-2 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/lumalabs/lumaai-api/blob/main/openapi.yaml](https://github.com/lumalabs/lumaai-api/blob/main/openapi.yaml)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：Luma AI Dream Machine（ray-2 / ray-flash-2）。视频生成（text-to-video / image-to-video / keyframes 首尾帧）、延长（keyframes 引用已有 generation 正/反向）、编辑（modify_video 风格迁移/提示词编辑、reframe_video 改比例）；音频由独立 /generations/{id}/audio 接口生成。
## 输入限制

待补充

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 9 秒 |
| 清晰度 | 540p、720p、1080p、4k |
| 画面比例 | 1:1、16:9、9:16、4:3、3:4、21:9、9:21 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 备注：duration 与 resolution 来自 OpenAPI 共享枚举 VideoModelOutputDuration（仅 5s/9s 两档）与 VideoModelOutputResolution（540p/720p/1080p/4k），均为 anyOf 含自由字符串的非硬约束，且非 ray-2 专属。aspect_ratio 共享枚举默认 16:9；keyframes 支持 frame0/frame1（image 或 generation 引用），loop 可选。视频生成请求无音频字段（generate_audio=false），音频由独立 /generations/{id}/audio 接口生成（AudioGenerationRequest 仅 prompt/negative_prompt，无参考音频，故 max_reference_audios 无值；音频额外计费官方文档未提供）。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 待补充 |
| 画面比例 | 1:1、16:9、9:16、4:3、3:4、21:9、9:21 |
| 比例模式 | 待补充 |
| 时长模式 | 待补充 |
| 生成音频 | 不支持 |

> 备注：modify_video（mode adhere_1/2/3、flex_1/2/3、reimagine_1/2/3，风格迁移/提示词编辑）与 reframe_video（aspect_ratio 必填，改比例重构图）请求体均无 duration/resolution/ratio_mode/duration_mode/generate_audio 字段（该接口无此字段）；aspect_ratio 枚举仅 reframe_video 使用（必填，默认 16:9），modify_video 无 aspect_ratio；模型为 ray-2 / ray-flash-2。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 9 秒 |
| 清晰度 | 540p、720p、1080p、4k |
| 画面比例 | 1:1、16:9、9:16、4:3、3:4、21:9、9:21 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 备注：extend 通过 keyframes 将 frame0/frame1 设为已存在 generation 引用（正向/反向延长），复用 /generations/video 的 GenerationRequest，故 duration/resolution 与 generate 同源（共享枚举）。请求无音频字段（generate_audio=false），音频由独立 /generations/{id}/audio 接口生成（无参考音频、音频额外计费官方文档未提供）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 9 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | ray2 | 44 | 1108 | 16 | 9521 | — | — | — |
| LMArena·文生 | ray2 | 44 | 1064 | 17 | 5222 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

待补充（官方文档未提供错误码语义表：OpenAPI 仅定义 Error 对象（detail 字符串，示例 'Invalid API key is provided'）与 default HTTP 响应，未展开具体错误码枚举。）

