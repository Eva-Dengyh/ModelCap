# runway-aleph-2-0

> 供应商：runway ｜ 版本：2.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.dev.runwayml.com/guides/models](https://docs.dev.runwayml.com/guides/models)

## 能力
- **任务类型**：edit
- **生成场景**：待补充
- **接受输入**：reference_video、reference_image
- **生成音频**：待补充
- **特色能力**：multi-shot
- **备注**：Runway 的 in-context 视频编辑模型 Aleph 2.0（API 模型串 aleph2；旧 id gen4_aleph 已于 2026-07-30 停用，废弃别名 aleph2_alpha；AA 榜 "Aleph 2.0"、LMArena 榜 runway-gen4-aleph 即此模型）。编辑一帧改动会传播到整段并跨镜头保持背景/光照不变；支持局部时间范围编辑与画幅扩展（expand/outpaint）。不生成新时长（成片时长=源视频时长，≤30s）。音频行为官方未明确（仅 ProRes 输出含 PCM 音轨为间接证据）。编辑所需关键帧图通常由图像模型先生成（另行计费）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考视频数量 | 1 ~ 1 |
| 参考图上限（张） | 5 |
| 参考视频最小时长 | 2 秒 |
| 参考视频最大时长 | 30 秒 |
| 补充提示词上限 | 1000 字 |

## 参数规矩（按任务）

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长模式 | inherit_from_reference_video |

> 备注：Aleph 2.0（aleph2）。输入源视频 2–30s（超 30s 自动裁剪）、480p–1080p、24–30fps、常规画幅、镜头切换 ≤10 个（11+ 会报错）。prompt ≤1000 字符可空；可配 ≤5 个关键帧图（带 seconds 时间戳，0–30s），每条可加 range 做局部编辑（局部编辑输出恒为 MP4）。输出时长与分辨率=输入（≤1080p），无 duration/分辨率参数、不可续写加长；画幅扩展走独立 expand/outpaint（targetAspectRatio：16:9/4:3/3:2/1:1/2:3/3:4/9:16/21:9）。无原生 HDR（可链 SDR→HDR）。seed 可选、contentModeration.publicFigureThreshold 可选。ProRes/PNG 序列/10-bit 输出为加价格式（见 pricing）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 30 秒 |
| 画面比例模式 | inherit_from_reference_video |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·编辑 | Aleph 2.0 | 7 | 1013 | 5 | 20781 | 2026-05 | — | 16.80 |
| LMArena·编辑 | runway-gen4-aleph | 10 | 1182 | 9 | 9818 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| aleph2 | 0.28 |

> 备注：官方 API 28 credits/s、单笔最低 56 credits；credit=$0.01 → $0.28/s ≈ $16.8/分钟（与 AA 榜 price_usd_per_min=16.80 互证一致；单次 ≤30s 封顶 840 credits）。ProRes/PNG 序列 +5 credits/s；10-bit（sdr_rec709_10bit）档 +20 credits/s（>4MP 时 40）。app 内 Edit Studio 关键帧图另计（Gen-4 Image 8/图、Nano Banana Pro 20/图、GPT Image 2 5/图）。web credits 与 API credits 池独立。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 400 | invalid_parameter | 请求体输入有问题（JSON 含 error 字段） |
| 401 | access_denied | API key 无效 |
| 404 | invalid_parameter | 资源不存在 |
| 405 | invalid_parameter | 方法不支持 |
| 429 | quota_exceeded | 请求过频/超限，可重试 |
| 504 | provider_failed | 服务过载，可重试 |
| 502/503 | provider_failed | 服务削峰，可重试 |
| SAFETY.INPUT.* | content_violation.safety | 输入触发安全策略（不退积分） |
| SAFETY.OUTPUT.* | content_violation.safety | 输出触发安全策略 |
| INTERNAL.BAD_OUTPUT.* | output_processing_failed | 输出处理异常，可调整后重试 |
| INPUT_PREPROCESSING.* | provider_failed | 输入预处理内部错误，可重试 |
| ASSET.INVALID | invalid_parameter | 输入素材不符合要求（尺寸/时长/性质） |

