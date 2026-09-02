# pixverse-v5-6

> 供应商：aishi ｜ 版本：5.6 ｜ 信息核实日期：2026-09-02
> 来源：[https://docs.platform.pixverse.ai/text-to-video-generation-13016634e0](https://docs.platform.pixverse.ai/text-to-video-generation-13016634e0)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：支持
- **备注**：官方 model 值 v5.6（2026-01-26 发布；fusion 参考生视频版 2026-02-12）。无独立模型页，规格以通用 API 参考内的 v5.6 行与 Pricing 表为准。支持 t2v / i2v（单图）/ transition 首尾帧（2 图）/ fusion 参考生视频（image_references 1–7 张，type=subject/background，prompt 内 @ref_name）。只出单镜头（multi-clip 开关对 v5.6 无效，v5.5/v6 才有）。extend 不支持 v5.6（extend API model 枚举不含 v5.6）。inline 音频生成开关 generate_audio_switch 支持 v5.5/5.6/v6/c1（默认 false，有声额外计费）；sound_effect/lip-sync 参数只属 v5 及以下，v5.6 不支持。运镜 camera 参数官方未把 v5.6 列入（示例中为注释）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | png、webp、jpeg、jpg |
| 图片最大边长 | 10000 |
| 补充提示词上限 | 5000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 360p、540p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 0 |
| 音频额外计费 | 是 |

> 支持参数：aspect_ratio、duration、generate_audio、reference_audio、resolution

> 备注：各 generate 子任务统一档位：duration 5/8/10（1080p 不能用 10s）；quality=360p/540p/720p/1080p。t2v/fusion 可指定比例（5 档，无 2:3/3:2/21:9 那些是 v6/c1）；i2v/transition 接口无比例参数（随输入图）。generate_audio_switch 默认 false（无声），true 有声并额外扣 credits；无音频参考输入。seed ∈ [0, 2^31-1]。官方文档内部不一致已照录：extend API 的 duration 注释行含 v5.6 但 model 枚举不含；能力矩阵写 legacy v5.5+ 支持 multi-clip 但接口 schema 与计费表表明 v5.6 单镜头；400018/19 错误码描述说 2048 字符与接口 maxLength=5000 矛盾。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AA·图生 | PixVerse V5.6 | 29 | 959 | 7 | 6547 | 2026-02 | — | — |
| AA·图生 | PixVerse V5.6 (January) | 30 | 956 | 7 | 7883 | 2026-01 | — | 14.62 |
| AA·文生 | PixVerse V5.6 | 34 | 949 | 7 | 6987 | 2026-02 | — | — |
| AA·文生 | PixVerse V5.6 (January) | 35 | 946 | 7 | 8356 | 2026-01 | — | 14.62 |
| LMArena·图生 | pixverse-v5.6 | 23 | 1299 | 7 | 126770 | — | — | — |
| LMArena·文生 | pixverse-v5.6 | 24 | 1240 | 11 | 32296 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **计费单位**：request

- **价格快照日期**：2026-09-02

- **价格来源**：https://docs.platform.pixverse.ai/text-to-video-generation-13016634e0

> 备注：PixVerse 平台 credits 计费（v5.6 按条数与时长档固定扣费，非 v6 的按秒）。V5.6 single clip 无音频档：360p 5/8/10s=35/70/77、540p=35/70/77、720p=45/90/99、1080p 5/8s=75/150 credits；含音频档：360p=80/115/122、540p=90/115/122、720p=80/135/144、1080p=150/195 credits（540p·5s·含音频在 Pricing 主表与 Fusion 子表一处不一致：90 vs 80，照录）。官方无 v5.6 的美元单价；AA $14.62/分钟为第三方口径。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 99999 | provider_failed | 未知错误 |
| 400011 | invalid_parameter | 缺少参数 |
| 400012 | access_denied | 账号无效 |
| 400013 | invalid_parameter | 参数类型或取值错误 |
| 400017 | invalid_parameter | 参数无效 |
| 400018 | invalid_parameter | prompt 超长 |
| 400019 | invalid_parameter | negative prompt 超长 |
| 400032 | invalid_parameter | 图片 ID 无效 |
| 500008 | invalid_parameter | 请求的数据不存在 |
| 500020 | access_denied | 无权限执行该操作 |
| 500030 | invalid_parameter | 图片超过 20MB / 10000px |
| 500031 | provider_failed | 获取图片信息失败 |
| 500032 | invalid_parameter | 图片格式无效 |
| 500033 | invalid_parameter | 图片宽高无效 |
| 500041 | provider_failed | 图片上传失败 |
| 500044 | quota_exceeded | 达到并发生成上限 |
| 500054 | content_violation.safety | 内容审核未通过 |
| 500060 | quota_exceeded | 月度特效激活次数达上限 |
| 500063 | content_violation.safety | 视频/图片/文本审核未通过 |
| 500069 | provider_failed | 系统负载高，请稍后重试 |
| 500090 | quota_exceeded | 账户余额不足 |
| 500100 | provider_failed | 数据库错误 |

