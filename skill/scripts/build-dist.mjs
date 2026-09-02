#!/usr/bin/env node
/**
 * build-dist.mjs —— 把所有 models/*.json 合并成统一产物，供下游程序直接 import：
 *   dist/catalog.json   完整目录（数组，按 model_id 排序）
 *   dist/index.json     索引（model_id → provider/version/fetched_at）
 *   dist/catalog.d.ts   精简 TS 类型
 *
 * 用法：node skill/scripts/build-dist.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const MODELS_DIR = join(ROOT, 'models')
const DIST_DIR = join(ROOT, 'dist')

function main() {
  const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.json')).sort()
  const catalog = files.map((f) => JSON.parse(readFileSync(join(MODELS_DIR, f), 'utf8')))
  catalog.sort((a, b) => a.model_id.localeCompare(b.model_id))

  const index = {}
  for (const d of catalog) {
    index[d.model_id] = { provider: d.provider, version: d.version, fetched_at: d.fetched_at }
  }

  mkdirSync(DIST_DIR, { recursive: true })
  writeFileSync(join(DIST_DIR, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n')
  writeFileSync(join(DIST_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n')
  writeFileSync(join(DIST_DIR, 'catalog.d.ts'), tsTypes())
  console.log(`✓ 已生成 dist/catalog.json（${catalog.length} 条）、dist/index.json、dist/catalog.d.ts`)
}

function tsTypes() {
  return `// 由 build-dist.mjs 生成，勿手改。ModelCap 目录的精简 TS 类型。
export interface ModelEntry {
  model_id: string
  provider: string
  version: string
  fetched_at: string
  source_url: string
  ability: {
    tasks?: string[]
    inputs?: string[]
    scenes?: string[]
    capabilities?: string[]
    audio?: boolean | null
    note?: string
  }
  input_limits?: Record<string, unknown>
  rules?: Record<string, Record<string, unknown>>
  output_limits?: Record<string, unknown> | null
  pricing?: {
    currency?: 'CNY' | 'USD'
    unit?: string
    tiers?: Record<string, number>
    observed_at?: string
    source?: string
    note?: string
  } | null
  errors?: Record<string, { standard: string; user_message?: string }>
  rankings?: Array<{
    board: string
    label: string
    rank?: number | null
    score: number
    ci?: number | null
    samples?: number | null
    release_date?: string | null
    open_weights?: boolean | null
    price_usd_per_min?: number | null
    as_of: string
    url: string
  }>
}
`
}

main()
