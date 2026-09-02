# runway-gen-4-turbo

> 供应商：runway ｜ 版本：4-turbo ｜ 信息核实日期：2026-09-02
> 来源：[https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video](https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video)

## 能力
- **任务类型**：generate
- **生成场景**：i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：Runway 官方没有把 Gen-4 Turbo 当独立基础模型：它是 Gen-4（图生视频）的高速/低成本档位，参数规格与 Gen-4 相同，仅速度更快、单价更低（Turbo 5 credits/s vs Gen-4 12 credits/s；官方建议先用 Turbo 迭代再切 Gen-4）。只支持图生视频（必须有输入图作为首帧），不支持纯文生；时长 5s/10s、24fps。官方该帮助文已标注为 older generation（现主推 Gen-4.5）。榜单模型名 runway-gen4-turbo 即此档位。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 图片格式 | jpg、jpeg、png、webp |
| 补充提示词上限 | 1000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4、21:9 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |

> 支持参数：aspect_ratio、duration

> 备注：时长仅 5s 或 10s。输出原生规格 720p 级（不是 4K），六档像素：16:9=1280x720、9:16=720x1280、1:1=960x960、4:3=1104x832、3:4=832x1104、21:9=1584x672。24fps 固定。选的分辨率与输入图比例不同会触发裁剪。prompt ≤1000 字符；不支持 negative prompt（可能产生相反效果）。音频生成未在官方文档提及。时长决定总 credits（Turbo：5s=25、10s=50）。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·图生 | runway-gen4-turbo | 45 | 1052 | 13 | 6801 | — | — | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格

- **计费单位**：second

- **价格快照日期**：2026-09-02

- **价格来源**：https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video

> 备注：Runway web credits：Gen-4 Turbo 5 credits/s（5s=25、10s=50 total）；Gen-4（非 Turbo）12 credits/s。无公开 credit→USD 官方换算；API 渠道未上架 Turbo（web 与 API credits 池相互独立）。

## 错误码

待补充（官方帮助中心无该档位专属错误码；Runway API 通用错误码仅存于需登录的开发者门户，未收录。）

