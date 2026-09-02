# jimeng

> 供应商：bytedance ｜ 版本：3.0 ｜ 信息核实日期：2026-09-01
> 来源：[https://www.volcengine.com/docs/85621/1792707](https://www.volcengine.com/docs/85621/1792707)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **特色能力**：camera-control
- **备注**：即梦视频3.0（字节剪映/即梦同源），经火山引擎视觉智能(visual.volcengineapi.com)提供。支持文生视频、图生视频-首帧、图生视频-首尾帧、图生视频-运镜四种生成方式；720P / 1080P 两档清晰度；5s / 10s 时长。文档未提及音频生成能力（无音频参考参数）。同系列 3.0 Pro 为更高档（1 元/秒）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 2 |
| 图片大小上限 | 4928307 字节 |
| 图片格式 | jpeg、png |
| 图片最小边长 | 320 |
| 图片最大边长 | 4096 |
| 图片比例范围 | 0.333 ~ 3 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、21:9 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |

> 支持参数：aspect_ratio、duration、resolution

> 备注：24fps，总帧数 = 24*n+1，n∈{5,10}（frames∈{121,241}）。aspect_ratio 默认 16:9。prompt 建议 ≤400 字、上限 800 字。720P / 1080P 为独立 req_key（jimeng_t2v_v30 等）。首尾帧任务需 2 张图且尾帧与首帧同比例。图片原文约束：最大 4.7MB、最大 4096×4096、最短边 ≥320、长边:短边 ≤3。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 价格

- **币种**：CNY
- **计费单位**：second

| 档位 | 单价 |
| --- | --- |
| 720p | 28 |
| 1080p | 63 |
| 1080p-pro | 100 |

- **价格快照日期**：2026-09-01

- **价格来源**：https://www.volcengine.com/docs/85621/1792707

> 备注：按秒计费：720P 0.28 元/秒、1080P 0.63 元/秒、3.0 Pro 1.00 元/秒；tiers 整数单位为分/秒（1 元=100 分）。并发：免费状态 1、付费状态 2。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 50411 | content_violation.safety | 输入图片前审核未通过 |
| 50413 | content_violation.safety | 输入文本含敏感词、版权词等审核不通过 |
| 50429 | quota_exceeded | QPS 超限，请降低请求频率 |
| 50430 | quota_exceeded | 并发超限 |
| 50500 | provider_failed | 内部错误 |
| 50501 | provider_failed | 内部算法错误 |
| 50518 | content_violation.copyright | 输入版权图前审核未通过 |

