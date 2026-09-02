#!/usr/bin/env node
/**
 * tools.mjs —— model-catalog 的 JSON 工具：校验 + 渲染 markdown。
 *
 * 用法：
 *   node scripts/tools.mjs validate models/xxx.json        # 校验是否符合 schema
 *   node scripts/tools.mjs render   models/xxx.json        # 渲染出 xxx.md
 *   node scripts/tools.mjs validate models/*.json          # 批量校验
 *
 * 说明：
 *   - 校验：必填字段、枚举值、缺失打标（骨架模式只查结构不查必填）。
 *   - 渲染：JSON 是唯一事实源，md 是生成视图；json 改完重新 render 即可。
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ============ schema：唯一权威，枚举一律从这里派生，禁止手抄 ============

const schema = JSON.parse(readFileSync(join(__dirname, '../schema/model.schema.json'), 'utf8'))
const deep = (obj, ...segments) => segments.reduce((o, s) => (o == null ? undefined : o[s]), obj)
const TASKS = deep(schema, 'properties', 'ability', 'properties', 'tasks', 'items', 'enum')
const INPUTS = deep(schema, 'properties', 'ability', 'properties', 'inputs', 'items', 'enum')
const SCENES = deep(schema, 'properties', 'ability', 'properties', 'scenes', 'items', 'enum')
const CAPABILITIES = deep(schema, 'properties', 'ability', 'properties', 'capabilities', 'items', 'enum')
const RESOLUTIONS = deep(schema, 'properties', 'rules', 'additionalProperties', 'properties', 'resolution', 'items', 'enum')
const ASPECT_RATIO_PATTERN = deep(schema, 'properties', 'rules', 'additionalProperties', 'properties', 'aspect_ratio', 'items', 'pattern')
const RATIO_MODES = deep(schema, 'properties', 'rules', 'additionalProperties', 'properties', 'ratio_mode', 'enum')
const DURATION_MODES = deep(schema, 'properties', 'rules', 'additionalProperties', 'properties', 'duration_mode', 'enum')
const IMAGE_FORMATS = deep(schema, 'properties', 'input_limits', 'properties', 'image', 'properties', 'formats', 'items', 'enum')
const UNITS = deep(schema, 'properties', 'pricing', 'properties', 'unit', 'enum')
const CURRENCIES = deep(schema, 'properties', 'pricing', 'properties', 'currency', 'enum')
const STANDARD_ERRORS = deep(schema, 'properties', 'errors', 'additionalProperties', 'properties', 'standard', 'enum')
const BOARDS = deep(schema, 'properties', 'rankings', 'items', 'properties', 'board', 'enum')
const BOARD_LABEL = {
  'aa-i2v': 'AA·图生',
  'aa-t2v': 'AA·文生',
  'aa-video-edit': 'AA·编辑',
  'lmarena-i2v': 'LMArena·图生',
  'lmarena-t2v': 'LMArena·文生',
  'lmarena-video-edit': 'LMArena·编辑',
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD
const YEARMONTH_RE = /^\d{4}-\d{2}(-\d{2})?$/ // 榜单日期可能只给到年月
const URL_RE = /^https?:\/\/\S+$/

function validateProblems(entry, fileName) {
  const out = []
  // 骨架模式：顶层带 _missing 数组，说明字段待补全，此时只查结构、不报必填缺失
  const isSkeleton = Array.isArray(entry._missing)

  if (!isSkeleton) {
    for (const field of ['model_id', 'provider', 'version', 'fetched_at', 'source_url', 'ability', 'input_limits', 'rules', 'errors']) {
      if (entry[field] === undefined || entry[field] === null) out.push(`缺少必填字段: ${field}`)
    }
  }

  // model_id 必须等于文件名（render 靠 model_id 决定输出哪个 .md）
  if (fileName) {
    const expect = basename(fileName).replace(/\.json$/i, '')
    if (entry.model_id !== expect) out.push(`model_id 与文件名不一致: ${entry.model_id} != ${expect}`)
  }
  if (entry.fetched_at && !DATE_RE.test(entry.fetched_at)) out.push(`fetched_at 应为 YYYY-MM-DD: ${entry.fetched_at}`)
  if (entry.source_url && !URL_RE.test(entry.source_url)) out.push(`source_url 应为 http(s) 网址: ${entry.source_url}`)

  if (entry.ability) {
    for (const task of entry.ability.tasks || []) {
      if (!TASKS.includes(task)) out.push(`ability.tasks 非法枚举: ${task}`)
    }
    for (const input of entry.ability.inputs || []) {
      if (!INPUTS.includes(input)) out.push(`ability.inputs 非法枚举: ${input}`)
    }
    for (const scene of entry.ability.scenes || []) {
      if (!SCENES.includes(scene)) out.push(`ability.scenes 非法枚举: ${scene}`)
    }
    for (const cap of entry.ability.capabilities || []) {
      if (!CAPABILITIES.includes(cap)) out.push(`ability.capabilities 非法枚举: ${cap}`)
    }
  }

  if (entry.input_limits && typeof entry.input_limits === 'object') {
    const formats = entry.input_limits.image && entry.input_limits.image.formats
    if (Array.isArray(formats)) {
      for (const f of formats) {
        if (!IMAGE_FORMATS.includes(f)) out.push(`input_limits.image.formats 非法枚举: ${f}`)
      }
    }
  }

  if (entry.rules && typeof entry.rules === 'object') {
    for (const [task, rule] of Object.entries(entry.rules)) {
      // _missing / note 是元数据标记，不是任务条目
      if (task.startsWith('_') || task === 'note') continue
      if (!TASKS.includes(task)) out.push(`rules 非法任务键: ${task}`)
      if (!rule || typeof rule !== 'object') continue
      if (rule.ratio_mode && !RATIO_MODES.includes(rule.ratio_mode)) out.push(`rules.${task}.ratio_mode 非法: ${rule.ratio_mode}`)
      if (rule.duration_mode && !DURATION_MODES.includes(rule.duration_mode)) out.push(`rules.${task}.duration_mode 非法: ${rule.duration_mode}`)
      for (const res of rule.resolution || []) {
        if (!RESOLUTIONS.includes(res)) out.push(`rules.${task}.resolution 非法枚举: ${res}`)
      }
      if (ASPECT_RATIO_PATTERN) {
        const re = new RegExp(ASPECT_RATIO_PATTERN)
        for (const ratio of rule.aspect_ratio || []) {
          if (typeof ratio === 'string' && !re.test(ratio)) out.push(`rules.${task}.aspect_ratio 非法值: ${ratio}`)
        }
      }
    }
  }

  if (entry.pricing && typeof entry.pricing === 'object') {
    if (entry.pricing.unit && !UNITS.includes(entry.pricing.unit)) {
      out.push(`pricing.unit 非法: ${entry.pricing.unit}`)
    }
    if (entry.pricing.currency && !CURRENCIES.includes(entry.pricing.currency)) {
      out.push(`pricing.currency 非法: ${entry.pricing.currency}`)
    }
  }

  if (Array.isArray(entry.rankings)) {
    for (let i = 0; i < entry.rankings.length; i++) {
      const r = entry.rankings[i]
      if (!r || typeof r !== 'object') { out.push(`rankings[${i}] 必须是对象`); continue }
      for (const field of ['board', 'label', 'score', 'as_of', 'url']) {
        if (r[field] === undefined || r[field] === null) out.push(`rankings[${i}] 缺少必填字段: ${field}`)
      }
      if (r.board && !BOARDS.includes(r.board)) out.push(`rankings[${i}].board 非法: ${r.board}`)
      if (r.score !== undefined && r.score !== null && typeof r.score !== 'number') out.push(`rankings[${i}].score 必须是数字`)
      if (r.as_of && !DATE_RE.test(r.as_of)) out.push(`rankings[${i}].as_of 应为 YYYY-MM-DD: ${r.as_of}`)
      if (r.release_date && !YEARMONTH_RE.test(r.release_date)) out.push(`rankings[${i}].release_date 应为 YYYY-MM 或 YYYY-MM-DD: ${r.release_date}`)
      if (r.url && !URL_RE.test(r.url)) out.push(`rankings[${i}].url 应为 http(s) 网址: ${r.url}`)
    }
  }

  if (entry.errors && typeof entry.errors === 'object') {
    for (const [code, e] of Object.entries(entry.errors)) {
      // _missing / note 是元数据标记，不是错误码条目
      if (code.startsWith('_') || code === 'note') continue
      if (!e || typeof e !== 'object') {
        out.push(`errors.${code} 必须是对象`)
        continue
      }
      if (!e.standard) out.push(`errors.${code} 缺少 standard`)
      else if (!STANDARD_ERRORS.includes(e.standard)) out.push(`errors.${code}.standard 非法: ${e.standard}`)
    }
  }

  return out
}

function cmdValidate(files) {
  if (files.length === 0) {
    console.error('用法: node scripts/tools.mjs validate models/*.json')
    process.exit(1)
  }
  let failed = false
  for (const file of files) {
    let entry
    try {
      entry = JSON.parse(readFileSync(file, 'utf8'))
    } catch (err) {
      console.error(`✗ ${file}: JSON 解析失败 (${err.message})`)
      failed = true
      continue
    }
    const issues = validateProblems(entry, file)
    if (issues.length === 0) {
      console.log(`✓ ${file}`)
    } else {
      failed = true
      console.error(`✗ ${file}`)
      for (const issue of issues) console.error(`    - ${issue}`)
    }
  }
  return failed ? 1 : 0
}

// ============ render ============

const MISSING = '待补充'

function isMissing(value) {
  return value === null || value === undefined || value === ''
}

function cell(value) {
  if (isMissing(value)) return MISSING
  if (Array.isArray(value)) return value.join('、') || MISSING
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function fmt(value) {
  return cell(value)
}

function mdHeader(entry) {
  const id = fmt(entry.model_id)
  const version = fmt(entry.version)
  const provider = fmt(entry.provider)
  const fetched = fmt(entry.fetched_at)
  const source = entry.source_url ? `[${entry.source_url}](${entry.source_url})` : MISSING

  return [
    `# ${id}`,
    '',
    `> 供应商：${provider} ｜ 版本：${version} ｜ 信息核实日期：${fetched}`,
    `> 来源：${source}`,
    '',
  ].join('\n')
}

function mdAbility(entry) {
  const a = entry.ability || {}
  const tasks = cell(a.tasks)
  const inputs = cell(a.inputs)
  const scenes = cell(a.scenes)
  const capabilities = cell(a.capabilities)
  const audio = isMissing(a.audio) ? MISSING : a.audio ? '支持' : '不支持'
  const note = cell(a.note)

  return [
    '## 能力',
    '',
    `- **任务类型**：${tasks}`,
    `- **生成场景**：${scenes}`,
    `- **接受输入**：${inputs}`,
    `- **生成音频**：${audio}`,
    capabilities && capabilities !== MISSING ? `- **特色能力**：${capabilities}` : '',
    note && note !== MISSING ? `- **备注**：${note}` : '',
    '',
  ].filter(Boolean).join('\n')
}

function mdInputLimits(entry) {
  const l = entry.input_limits || {}
  const rows = []

  const pushRange = (label, obj) => {
    if (!obj) return
    const min = cell(obj.min)
    const max = cell(obj.max)
    rows.push([label, min === MISSING && max === MISSING ? MISSING : `${min} ~ ${max}`])
  }
  pushRange('参考视频数量', l.reference_videos)

  const add = (label, value) => { if (!isMissing(value)) rows.push([label, fmt(value)]) }
  add('参考图上限（张）', l.max_reference_images)
  add('参考视频上限（条）', l.max_reference_videos)
  add('参考音频上限（条）', l.max_reference_audios)
  add('素材合计上限', l.max_reference_materials)

  if (l.image) {
    add('图片大小上限', l.image.max_bytes ? `${l.image.max_bytes} 字节` : l.image.max_bytes)
    add('图片格式', l.image.formats)
    add('图片最小边长', l.image.min_side_px)
    add('图片最大边长', l.image.max_side_px)
    add('图片比例范围', !isMissing(l.image.min_ratio) || !isMissing(l.image.max_ratio)
      ? `${cell(l.image.min_ratio)} ~ ${cell(l.image.max_ratio)}` : l.image.min_ratio)
  }
  if (l.video) {
    add('参考视频最小时长', l.video.min_duration_seconds ? `${l.video.min_duration_seconds} 秒` : l.video.min_duration_seconds)
    add('参考视频最大时长', l.video.max_duration_seconds ? `${l.video.max_duration_seconds} 秒` : l.video.max_duration_seconds)
    add('参考视频格式', l.video.formats)
  }
  if (l.additional_prompt) {
    add('补充提示词上限', l.additional_prompt.max_chars ? `${l.additional_prompt.max_chars} 字` : l.additional_prompt.max_chars)
  }

  if (rows.length === 0) return '## 输入限制\n\n待补充\n'
  const lines = ['## 输入限制', '', '| 项目 | 限制 |', '| --- | --- |']
  for (const [k, v] of rows) lines.push(`| ${k} | ${v} |`)
  return lines.join('\n') + '\n'
}

function mdRules(entry) {
  const rules = entry.rules || {}
  const tasks = Object.keys(rules).filter((k) => !k.startsWith('_') && k !== 'note')
  if (tasks.length === 0) return '## 参数规矩（按任务）\n\n待补充\n'

  const out = ['## 参数规矩（按任务）', '']
  for (const task of tasks) {
    const r = rules[task]
    out.push(`### 任务：${task}`, '')
    out.push('| 参数 | 取值/约束 |', '| --- | --- |')

    const rows = []
    if (r.duration_seconds !== undefined) {
      if (r.duration_seconds === -1) rows.push(['时长', '固定 -1（由服务端决定，客户端禁止自定义）'])
      else if (isMissing(r.duration_seconds)) rows.push(['时长', MISSING])
      else rows.push(['时长', `${cell(r.duration_seconds.min)} ~ ${cell(r.duration_seconds.max)} 秒`])
    }
    if (r.resolution !== undefined) rows.push(['清晰度', cell(r.resolution)])
    if (r.aspect_ratio !== undefined) rows.push(['画面比例', cell(r.aspect_ratio)])
    if (r.ratio_mode !== undefined) rows.push(['比例模式', cell(r.ratio_mode)])
    if (r.duration_mode !== undefined) rows.push(['时长模式', cell(r.duration_mode)])
    if (r.generate_audio !== undefined) rows.push(['生成音频', r.generate_audio ? '支持' : '不支持'])
    if (r.audio && !isMissing(r.audio.max_reference_audios)) rows.push(['参考音频上限', cell(r.audio.max_reference_audios)])
    if (r.audio && !isMissing(r.audio.extra_charge)) rows.push(['音频额外计费', r.audio.extra_charge ? '是' : '否'])

    if (rows.length === 0) rows.push(['—', '待补充'])
    for (const [k, v] of rows) out.push(`| ${k} | ${v} |`)
    if (r.supported_parameters && r.supported_parameters.length > 0) {
      out.push('', `> 支持参数：${cell(r.supported_parameters)}`)
    }
    if (r.note) out.push('', `> 备注：${r.note}`)
    out.push('')
  }
  return out.join('\n')
}

function mdOutputLimits(entry) {
  const o = entry.output_limits || {}
  if (Object.keys(o).length === 0) return ''
  const rows = []
  if (!isMissing(o.max_duration_seconds)) rows.push(['成片最大时长', `${o.max_duration_seconds} 秒`])
  if (!isMissing(o.aspect_ratio_mode)) rows.push(['画面比例模式', cell(o.aspect_ratio_mode)])
  if (rows.length === 0) return ''
  const out = ['## 输出限制', '', '| 项目 | 限制 |', '| --- | --- |']
  for (const [k, v] of rows) out.push(`| ${k} | ${v} |`)
  return out.join('\n') + '\n'
}

function mdRankings(entry) {
  const rows = entry.rankings || []
  if (rows.length === 0) return ''

  const out = ['## 榜单数据', '']
  out.push('| 榜单 | 榜上名称 | 排名 | 分数 | ±95%CI | 样本/票 | 发布日期 | 开放权重 | API价格(USD/分) |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
  for (const r of rows) {
    const open = r.open_weights === true ? '开放权重' : (r.open_weights === false ? '闭源' : '—')
    out.push(
      `| ${BOARD_LABEL[r.board] || cell(r.board)} | ${cell(r.label)} | ${r.rank == null ? '—' : r.rank} | ${cell(r.score)} | ` +
      `${r.ci == null ? '—' : r.ci} | ${r.samples == null ? '—' : r.samples} | ` +
      `${r.release_date || '—'} | ${open} | ${r.price_usd_per_min == null ? '—' : r.price_usd_per_min.toFixed(2)} |`,
    )
  }
  out.push(
    '',
    '> 分数体系：AA=Elo，LMArena=Arena score，两者不可直接比较；价格是 AA「用创建者 API 默认设置生成 1 分钟 1080p 视频」的口径（同模型跨榜可能不同）。快照日期见各条 `rankings` 的 as_of 与条目 `fetched_at`。',
    '',
  )
  return out.join('\n')
}

function mdPricing(entry) {
  const p = entry.pricing || {}
  const hasTiers = p.tiers && Object.keys(p.tiers).length > 0
  const hasAny = Object.keys(p).length > 0 &&
    (p.currency || p.unit || hasTiers || p.note)
  if (!hasAny) return '## 价格\n\n待补充\n'
  const out = ['## 价格', '']
  if (!isMissing(p.currency)) out.push(`- **币种**：${cell(p.currency)}`)
  if (!isMissing(p.unit)) out.push(`- **计费单位**：${cell(p.unit)}`)
  if (hasTiers) {
    out.push('', '| 档位 | 单价 |', '| --- | --- |')
    for (const [k, v] of Object.entries(p.tiers)) out.push(`| ${k} | ${v} |`)
  }
  if (!isMissing(p.observed_at)) out.push('', `- **价格快照日期**：${cell(p.observed_at)}`)
  if (!isMissing(p.source)) out.push('', `- **价格来源**：${p.source}`)
  if (p.note) out.push('', `> 备注：${p.note}`)
  return out.join('\n') + '\n'
}

function mdErrors(entry) {
  const errors = entry.errors || {}
  // 只统计真正的错误码条目（跳过 _missing / note 元数据）
  const keys = Object.keys(errors).filter((k) => !k.startsWith('_') && k !== 'note')
  if (keys.length === 0) {
    const note = errors.note ? `（${errors.note}）` : ''
    return `## 错误码\n\n待补充${note}\n`
  }
  const out = ['## 错误码', '', '| 私有错误码 | 标准语义 | 给用户的话 |', '| --- | --- | --- |']
  for (const code of keys) {
    const e = errors[code]
    out.push(`| ${code} | ${cell(e.standard)} | ${cell(e.user_message)} |`)
  }
  return out.join('\n') + '\n'
}

function cmdRender(inPath) {
  if (!inPath) {
    console.error('用法: node scripts/tools.mjs render models/{model_id}.json')
    process.exit(1)
  }
  const entry = JSON.parse(readFileSync(inPath, 'utf8'))

  const md = [
    mdHeader(entry),
    mdAbility(entry),
    mdInputLimits(entry),
    mdRules(entry),
    mdOutputLimits(entry),
    mdRankings(entry),
    mdPricing(entry),
    mdErrors(entry),
  ]
    .filter(Boolean)
    .join('\n')

  const outPath = join(dirname(inPath), `${entry.model_id || 'model'}.md`)
  writeFileSync(outPath, md + '\n', 'utf8')
  console.log(`已生成: ${outPath}`)
  return 0
}

// ============ dispatch ============

function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  let code
  switch (cmd) {
    case 'validate':
      code = cmdValidate(rest)
      break
    case 'render':
      code = cmdRender(rest[0])
      break
    case '--help':
    case '-h':
    case undefined:
      console.log(
        '用法:\n' +
        '  node scripts/tools.mjs validate models/*.json   # 校验 JSON\n' +
        '  node scripts/tools.mjs render models/xxx.json   # 渲染出 xxx.md',
      )
      code = 0
      break
    default:
      console.error(`未知命令: ${cmd}（可用: validate / render）`)
      code = 1
  }
  process.exit(code)
}

main()
