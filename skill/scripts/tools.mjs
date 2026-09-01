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
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ============ validate ============

const TASKS = ['generate', 'edit', 'extend']
const INPUTS = ['reference_video', 'reference_image', 'model_reference', 'audio']
const SCENES = ['t2v', 'i2v-first-frame', 'i2v-first-last-frame', 'i2v-middle-frame', 'r2v']
const CAPABILITIES = ['lip-sync', 'portrait', 'multi-shot', 'camera-control']
const STANDARD_ERRORS = [
  'content_violation.real_person', 'content_violation.safety', 'content_violation.audio',
  'content_violation.copyright', 'invalid_parameter', 'quota_exceeded', 'timeout',
  'interrupted', 'access_denied', 'provider_failed', 'output_processing_failed', 'settlement_failed',
]
const RATIO_MODES = ['inherit_from_reference_video', 'client_choice']
const DURATION_MODES = ['inherit_from_reference_video', 'client_choice', 'explicit']

function validateProblems(entry) {
  const out = []
  // 骨架模式：顶层带 _missing 数组，说明字段待补全，此时只查结构、不报必填缺失
  const isSkeleton = Array.isArray(entry._missing)

  if (!isSkeleton) {
    for (const field of ['model_id', 'provider', 'version', 'fetched_at', 'source_url', 'ability', 'input_limits', 'rules', 'errors']) {
      if (entry[field] === undefined || entry[field] === null) out.push(`缺少必填字段: ${field}`)
    }
  }

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

  if (entry.rules && typeof entry.rules === 'object') {
    for (const [task, rule] of Object.entries(entry.rules)) {
      // _missing / note 是元数据标记，不是任务条目
      if (task.startsWith('_') || task === 'note') continue
      if (!TASKS.includes(task)) out.push(`rules 非法任务键: ${task}`)
      if (rule && rule.ratio_mode && !RATIO_MODES.includes(rule.ratio_mode)) out.push(`rules.${task}.ratio_mode 非法: ${rule.ratio_mode}`)
      if (rule && rule.duration_mode && !DURATION_MODES.includes(rule.duration_mode)) out.push(`rules.${task}.duration_mode 非法: ${rule.duration_mode}`)
    }
  }

  if (entry.pricing && entry.pricing.unit && !['second', 'request'].includes(entry.pricing.unit)) {
    out.push(`pricing.unit 非法: ${entry.pricing.unit}`)
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
    const issues = validateProblems(entry)
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
  pushRange('模特图数量', l.model_reference)
  pushRange('服装参考图数量', l.garment_references)
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
  if (!isMissing(o.max_file_bytes)) rows.push(['文件大小上限', `${o.max_file_bytes} 字节`])
  if (rows.length === 0) return ''
  const out = ['## 输出限制', '', '| 项目 | 限制 |', '| --- | --- |']
  for (const [k, v] of rows) out.push(`| ${k} | ${v} |`)
  return out.join('\n') + '\n'
}

function mdPricing(entry) {
  const p = entry.pricing || {}
  if (Object.keys(p).length === 0 || (isMissing(p.unit) && !p.tiers)) return '## 价格\n\n待补充\n'
  const out = ['## 价格', '']
  out.push(`- **币种**：${cell(p.currency)}`)
  out.push(`- **计费单位**：${cell(p.unit)}`)
  if (p.tiers && Object.keys(p.tiers).length > 0) {
    out.push('', '| 清晰度 | 单价（积分/秒） |', '| --- | --- |')
    for (const [k, v] of Object.entries(p.tiers)) out.push(`| ${k} | ${v} |`)
  }
  if (!isMissing(p.extra_audio_charge)) out.push('', `- 生成音频额外：${p.extra_audio_charge} 积分/条`)
  if (!isMissing(p.min_charge)) out.push('', `- 最低消费：${p.min_charge}`)
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
