# gen-4.5

> 供应商：runway ｜ 版本：4.5 ｜ 信息核实日期：2026-09-01
> 来源：[https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5](https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：待补充
- **备注**：Runway Gen-4.5，支持文生视频（Text）与图生视频（Image）；更多输入类型即将支持。文档未提及音频生成能力。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |
| 图片大小上限 | 16777216 字节 |
| 图片格式 | jpeg、png、webp |
| 图片比例范围 | 0.5 ~ 2 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 10 秒 |
| 清晰度 | 720p |
| 画面比例 | 16:9、9:16、1:1、4:3、3:4、21:9、9:21 |
| 比例模式 | client_choice |
| 时长模式 | client_choice |

> 备注：Text to Video 支持 16:9(1280x720) 与 9:16(720x1280)；Image to Video 支持 7 种比例（含 9:21/672x1584）；输出 720p；FPS 24/25；12 credits/秒。

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

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| 400 | invalid_parameter | 请求输入有误，请检查参数 |
| 401 | access_denied | API Key 无效 |
| 404 | invalid_parameter | 引用的资源不存在 |
| 405 | invalid_parameter | 接口方法不支持 |
| 429 | quota_exceeded | 请求过于频繁，请稍后重试 |
| 502 | provider_failed | 服务负载过高，请稍后重试 |
| 503 | provider_failed | 服务负载过高，请稍后重试 |
| 504 | timeout | 服务超时，请稍后重试 |
| SAFETY.INPUT | content_violation.safety | 输入内容未通过安全审核 |
| SAFETY.OUTPUT | content_violation.safety | 输出内容未通过安全审核 |
| INTERNAL.BAD_OUTPUT | output_processing_failed | 生成结果质量不合格，请调整提示词后重试 |
| INPUT_PREPROCESSING.SAFETY.TEXT | content_violation.safety | 提示词文本未通过安全审核 |
| INPUT_PREPROCESSING.INTERNAL | provider_failed | 内容审核服务异常，请稍后重试 |
| ASSET.INVALID | invalid_parameter | 输入素材不符合要求（尺寸/时长/属性），请更换 |
| THIRD_PARTY.UNAVAILABLE | provider_failed | 第三方模型暂不可用，请稍后重试 |
| INTERNAL | provider_failed | 服务内部错误，请稍后重试 |

