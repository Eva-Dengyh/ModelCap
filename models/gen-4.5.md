# gen-4.5

> 供应商：runway ｜ 版本：4.5 ｜ 信息核实日期：2026-09-01
> 来源：[https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5](https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5)

## 能力
- **任务类型**：generate
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：Runway Gen-4.5，支持文生视频（Text）与图生视频（Image）；更多输入类型即将支持。文档未提及音频生成能力。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 10 秒 |
| 清晰度 | 720p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4、21:9 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |

> 备注：Text to Video 仅 16:9(1280x720)；Image to Video 支持 6 种比例；输出 720p；FPS 24/25；12 credits/秒。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |
| 画面比例模式 | client_choice |

## 价格

- **币种**：待补充
- **计费单位**：second

| 清晰度 | 单价（积分/秒） |
| --- | --- |
| 720p | 12 |

> 备注：计费单位为 Runway credits（非 CNY/USD）；12 credits/秒；ProRes/PNG 序列导出另加 5 credits/秒。

## 错误码

待补充（帮助文档未提供错误码。）

