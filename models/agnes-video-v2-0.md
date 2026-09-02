# agnes-video-v2-0

> 供应商：sapiens ｜ 版本：v2.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://wiki.agnes-ai.com/en/docs/agnes-video-v20](https://wiki.agnes-ai.com/en/docs/agnes-video-v20)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：官方文档托管于 Agnes AI 文档站（wiki.agnes-ai.com；AA 榜单标注厂商为 Sapiens AI）。支持文生视频、图生视频（首帧）、关键帧动画；音频生成官方未记载。时长由 num_frames/frame_rate 推导（非固定秒数）。图片需公网 URL，格式/大小/边长官方未给出。定价与错误码另见 pricing.md / code.md 页。
## 输入限制

待补充

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 待补充 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4 |
| 比例模式 | client_choice |

> 支持参数：aspect_ratio、duration、resolution

> 备注：时长由 seconds=num_frames/frame_rate 推导：num_frames 上限 441（须满足 8n+1 规则），frame_rate 1~60；官方示例 81/24≈3s、121/24≈5s、241/24≈10s、441/24≈18s，未给秒级固定上下限。默认请求尺寸 1152x768，输出会归一到最近标准档（480p/720p/1080p）。图片需公网 URL；图片格式/大小/边长、提示词字数上限官方未给出。

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | Agnes-Video-V2.0 | 34 | 921 | 8 | 5749 | 2026-05 | — | 0.30 |
| AA·文生 | Agnes-Video-V2.0 | 38 | 919 | 8 | 5382 | 2026-05 | — | 0.30 |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **币种**：USD
- **计费单位**：second

- **价格快照日期**：2026-09-02

- **价格来源**：https://wiki.agnes-ai.com/en/docs/agnes-video-v20

> 备注：挂牌价 $0.005/秒（当前促销价 $0/秒），不分分辨率档。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 400 | invalid_parameter | 请求参数不合法 |
| 401 | access_denied | API Key 无效或未授权 |
| 402 | settlement_failed | 账户余额或配额不足 |
| 404 | invalid_parameter | 任务或视频不存在 |
| 500 | provider_failed | 服务内部错误 |
| 503 | provider_failed | 服务繁忙 |

