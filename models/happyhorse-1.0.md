# happyhorse-1.0

> 供应商：alibaba ｜ 版本：1.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://happy-horse.art/zh/](https://happy-horse.art/zh/)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **特色能力**：lip-sync
- **备注**：HappyHorse 快乐小马 1.0（阿里巴巴 ATH/淘天，开源）。支持文生视频与图生视频（首帧）；原生音视频协同 + 7 语言口型同步（中/英/粤/日/韩/德/法）。本条目为开源 1.0 版；参考生视频与视频编辑属百炼 HappyHorse 1.1 / happyhorse-1.0-video-edit 能力（见 developer.aliyun.com/article/1743772），1.0 开源模型卡未覆盖。约 15B 参数单流 Transformer。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 12 秒 |
| 清晰度 | 720p、1080p、2k |
| 画面比例 | 16:9、9:16、4:3、3:4、21:9、1:1 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |

> 支持参数：aspect_ratio、duration、generate_audio、resolution

> 备注：时长口径各来源不一：生成器默认 4s、教程 5~8s、FAQ 5~12s（此处取 4~12s）；百炼 1.1 版为 3~15s。分辨率 720p/1080p/2k（官网 FAQ 明确原生 2K 输出），官网播放器默认档 480p（标准）。图生视频首帧图硬约束（格式/大小/边长）开源模型卡未给出；百炼 1.1 为 jpeg/jpg/png/webp ≤20MB、单边 ≥300px、比例 2:5~5:2。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 12 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | HappyHorse-1.0 | 8 | 1087 | 7 | 8828 | 2026-04 | — | 13.20 |
| AA·文生 | HappyHorse-1.0 | 8 | 1122 | 6 | 9711 | 2026-04 | — | 13.20 |
| AA·编辑 | HappyHorse-1.0 | 4 | 1088 | 5 | 23465 | 2026-04 | — | 27.04 |
| LMArena·图生 | happyhorse-1.0 | 8 | 1442 | 10 | 70699 | — | — | — |
| LMArena·文生 | happyhorse-1.0 | 8 | 1428 | 13 | 22112 | — | — | — |
| LMArena·编辑 | happyhorse-1.0 | 6 | 1307 | 14 | 3116 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

待补充

## 错误码

待补充（开源模型无 API 错误码（本无）。）

