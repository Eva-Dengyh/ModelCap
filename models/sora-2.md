# sora-2

> 供应商：openai ｜ 版本：2 ｜ 信息核实日期：2026-09-02
> 来源：[https://platform.openai.com/docs/api-reference/videos/create](https://platform.openai.com/docs/api-reference/videos/create)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：⚠️ 官方 SDK 标注：Sora API 将于 2026-09-24 永久下线（"scheduled to permanently shut down on September 24, 2026"，openai SDK 视频方法 @deprecated），集成前务必确认。官方文档页当前不可达（403），本条目字段按官方 openai-node SDK（v7.9.0，与官方 OpenAPI spec 同源）核实。API 模型值：sora-2 / sora-2-pro（另快照 sora-2-2025-10-06 / sora-2-pro-2025-10-06 / sora-2-2025-12-08，即榜单所谓 Sora 2 (December)）。端点：POST /videos（生成）、/videos/edits（编辑）、/videos/extensions（延长）、/videos/{id}/remix、/videos/characters（角色）。全部为异步 job（status: queued/in_progress/completed/failed）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 12 秒 |

> 备注：duration 仅允许 {4,8,12}，默认 4。无"分辨率字符串"参数，而是固定尺寸 size：允许 720x1280（默认）/1280x720/1024x1792/1792x1024（对应 9:16 / 16:9 / ≈4:7 / ≈7:4）。图生：单个 input_reference（file_id 或 image_url）。无 aspect_ratio/duration_mode/ratio_mode/generate_audio 等参数。SDK 未暴露音频生成参数。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| — | 待补充 |

> 备注：POST /videos/edits：prompt + 源视频（已完成视频 id 或文件上传），无时长/尺寸参数。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 4 ~ 20 秒 |

> 备注：POST /videos/extensions：在已完成视频后追加；新增段时长仅允许 {4,8,12,16,20}；返回体 seconds 为拼接后总时长。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 12 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·文生 | Sora 2 (December) | 14 | 1093 | 9 | 4910 | 2025-12 | — | 6.00 |
| AA·文生 | Sora 2 Pro | 22 | 1077 | 9 | 4937 | 2025-09 | — | 30.00 |
| LMArena·文生 | sora-2-pro | 9 | 1365 | 7 | 48782 | — | — | — |
| LMArena·文生 | sora-2 | 17 | 1341 | 6 | 65433 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


> 备注：官方定价页（platform.openai.com）不可达（403），无法核实官方计费；AA 榜单的 $6/分钟（Sora 2）、$30/分钟（Sora 2 Pro）为第三方测算口径，非官方计费，不在此填入。

## 错误码

待补充（官方错误码表不可达（platform.openai.com 403）。SDK 仅见 job 四态 status（queued/in_progress/completed/failed）与 Video.error{code,message} 结构，未枚举/映射具体错误码到标准语义。）

