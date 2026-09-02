# kandinsky-5-0

> 供应商：kandinsky ｜ 版本：5.0 ｜ 信息核实日期：2026-09-02
> 来源：[https://github.com/kandinskylab/kandinsky-5](https://github.com/kandinskylab/kandinsky-5)

## 能力
- **任务类型**：generate
- **生成场景**：t2v、i2v-first-frame
- **接受输入**：reference_image
- **生成音频**：不支持
- **特色能力**：camera-control
- **备注**：Sber 官方（kandinskylab/kandinsky-5，即 Kandinsky 5.0）核对：视频生成模型支持文生视频（T2V）与图生视频（I2V，输入图作首帧），时长 5s/10s（T2V）与 5s（I2V）；开源权重；提供镜头控制（Camera control）LoRA；支持英/俄提示词；官方未提及音频生成（视频扩散模型，无声）。原榜单推断 inputs 为空，已据官方补全 i2v。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 1 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 5 ~ 10 秒 |
| 清晰度 | 待补充 |
| 画面比例 | 3:2、5:3 |
| 比例模式 | 待补充 |
| 时长模式 | client_choice |
| 生成音频 | 不支持 |

> 备注：T2V 时长 5s/10s 两档（由所选 checkpoint 决定，非连续区间）；I2V 仅 5s。官方发布 SD（768×512，约 3:2）与 HD（1280×768，约 5:3）两档，非标准清晰度枚举，宽高比随档位固定；官方未提及音频生成。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 10 秒 |

## 榜单数据

| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LMArena·文生 | kandinsky-5.0-t2v-pro | 35 | 1172 | 20 | 2015 | — | 开放权重 | — |
| LMArena·文生 | kandinsky-5.0-t2v-lite | 41 | 1113 | 18 | 1468 | — | 开放权重 | — |

> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。

## 价格


> 备注：开源权重（Hugging Face），本地推理；官方 GitHub 仓库未提供 API 计费信息。

## 错误码

待补充（官方仓库为本地推理，未提供错误码表。）

