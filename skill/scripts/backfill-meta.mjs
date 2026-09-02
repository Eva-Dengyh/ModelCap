#!/usr/bin/env node
/**
 * backfill-meta.mjs —— 回填两个元数据字段（不编造，纯从已有数据推导）：
 *   1. rules.{task}.supported_parameters：从该任务已记录的字段推导支持的参数名。
 *   2. pricing.observed_at / source：价格快照日期与来源，取条目的 fetched_at / source_url。
 *
 * 用法：node skill/scripts/backfill-meta.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MODELS_DIR = join(__dirname, '../../models')

// rules 字段 → 客户端参数名（ratio_mode/duration_mode 是内部语义，归并到对应参数）
const PARAM_OF_FIELD = {
  duration_seconds: 'duration',
  resolution: 'resolution',
  aspect_ratio: 'aspect_ratio',
  generate_audio: 'generate_audio',
}

function deriveSupportedParams(rule) {
  const params = new Set()
  for (const [field, param] of Object.entries(PARAM_OF_FIELD)) {
    if (rule[field] !== undefined) params.add(param)
  }
  if (rule.audio && rule.audio.max_reference_audios != null) {
    params.add('reference_audio')
  }
  return [...params].sort()
}

function main() {
  const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.json'))
  let backfilledParams = 0
  let backfilledPricing = 0

  for (const f of files) {
    const path = join(MODELS_DIR, f)
    const d = JSON.parse(readFileSync(path, 'utf8'))
    let dirty = false

    if (d.rules && typeof d.rules === 'object') {
      for (const [task, rule] of Object.entries(d.rules)) {
        if (task.startsWith('_') || task === 'note') continue
        if (!rule || typeof rule !== 'object') continue
        const params = deriveSupportedParams(rule)
        if (params.length > 0) {
          rule.supported_parameters = params
          backfilledParams++
          dirty = true
        }
      }
    }

    if (d.pricing && typeof d.pricing === 'object' && !d.pricing._missing) {
      if (!d.pricing.observed_at && d.fetched_at) {
        d.pricing.observed_at = d.fetched_at
        dirty = true
        backfilledPricing++
      }
      if (!d.pricing.source && d.source_url) {
        d.pricing.source = d.source_url
        dirty = true
      }
    }

    if (dirty) writeFileSync(path, JSON.stringify(d, null, 2) + '\n')
  }

  console.log(`✓ 回填 supported_parameters：${backfilledParams} 个任务`)
  console.log(`✓ 回填 pricing.observed_at：${backfilledPricing} 个条目（source 同步）`)
}

main()
