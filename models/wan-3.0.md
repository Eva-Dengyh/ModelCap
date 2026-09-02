# wan-3.0

> 供应商：aliyun ｜ 版本：3.0 ｜ 信息核实日期：2026-09-01
> 来源：[https://help.aliyun.com/zh/model-studio/wan3-video-generation-api-reference](https://help.aliyun.com/zh/model-studio/wan3-video-generation-api-reference)

## 能力
- **任务类型**：generate、edit、extend
- **生成场景**：t2v、i2v-first-frame、i2v-first-last-frame、r2v
- **接受输入**：reference_video、reference_image、audio
- **生成音频**：支持
- **备注**：阿里云万相 Wan 3.0（模型名 wan3.0-video，另有高速版 wan3.0-video-prime）。支持文生视频、图生视频（首帧/首尾帧）、参考生视频（参考图/视频/音频混合），以及视频编辑、视频延长；原生 30 秒，带声音（默认 audio=true）。
## 输入限制

| 项目 | 限制 |
| --- | --- |
| 参考图上限（张） | 10 |
| 参考视频上限（条） | 5 |
| 参考音频上限（条） | 5 |
| 图片大小上限 | 20971520 字节 |
| 图片格式 | jpeg、jpg、png、webp、bmp |
| 图片最小边长 | 240 |
| 图片最大边长 | 8000 |
| 图片比例范围 | 0.125 ~ 8 |
| 参考视频最小时长 | 1 秒 |
| 参考视频最大时长 | 15 秒 |
| 参考视频格式 | mp4、mov |
| 补充提示词上限 | 20000 字 |

## 参数规矩（按任务）

### 任务：generate

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 30 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 5 |
| 音频额外计费 | 否 |

> 备注：分辨率默认 1080P；ratio 默认 adaptive；duration 默认 5s，无视频输入 2~30s、有视频输入时输入总时长+输出 ≤30s，-1 为智能时长；输出 30fps；图片格式另支持 jpg/bmp（无透明 PNG）、单边 240~8000px、比例 ≤8:1、≤20MB；参考视频 mp4/mov 单条 1~15s、总 ≤15s、单边 240~4096px、≤100MB；参考音频 wav/mp3 单条 1~15s、总 ≤15s、≤15MB；first_frame/last_frame 各最多 1 张，且不能与 reference_xx/file/link 混用；提示词 ≤20000 字；seed 0~2147483647。

### 任务：edit

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 30 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | 16:9、4:3、1:1、3:4、9:16、adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 5 |
| 音频额外计费 | 否 |

> 备注：视频编辑：传入 reference_video 配合 prompt 指令编辑视频内容；duration 默认 5s、可 -1（智能时长），有视频输入时输入总时长+输出 ≤30s；ratio 默认 adaptive，可选 16:9/4:3/1:1/3:4/9:16；分辨率默认 1080P。

### 任务：extend

| 参数 | 取值/约束 |
| --- | --- |
| 时长 | 2 ~ 30 秒 |
| 清晰度 | 480p、720p、1080p |
| 画面比例 | adaptive |
| 比例模式 | client_choice |
| 时长模式 | client_choice |
| 生成音频 | 支持 |
| 参考音频上限 | 5 |
| 音频额外计费 | 否 |

> 备注：视频延长：传入 reference_video 配合含延长意图的 prompt 向后延长；ratio 必须设为 adaptive（继承原视频比例）；duration 默认 5s、可 -1，输入总时长+输出 ≤30s；分辨率默认 1080P。

## 输出限制

| 项目 | 限制 |
| --- | --- |
| 成片最大时长 | 30 秒 |
| 画面比例模式 | client_choice |

## 价格

- **币种**：CNY
- **计费单位**：second

> 备注：按分辨率与地域每秒计费（百炼列表价）：北京 480P 0.30 元/秒、720P 0.60 元/秒、1080P 1.20 元/秒；新加坡 480P 0.05 美元/秒、720P 0.10 美元/秒、1080P 0.20 美元/秒（活动价曾低至 0.21/0.42/0.84 元/秒）。生成音频不额外收费（开关声音价格相同）。

## 错误码

| 私有错误码 | 标准语义 | 给用户的话 |
| --- | --- | --- |
| InvalidApiKey | access_denied | 未提供有效 API Key，请检查 Authorization 头 |
| InvalidParameter | invalid_parameter | 参数冲突：reference_xx 与 first_frame/last_frame 不能同时传入 |

