#!/usr/bin/env node
/**
 * check-fresh.mjs —— 检查模型条目的新鲜度。
 * fetched_at 超过 --max-days（默认 90）天的条目视为过期（信息会过期，需复核）。
 *
 * 用法：
 *   node skill/scripts/check-fresh.mjs            # 默认 90 天
 *   node skill/scripts/check-fresh.mjs --max-days 180
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MODELS_DIR = join(__dirname, '../../models')

function main() {
  const args = process.argv.slice(2)
  let maxDays = 90
  const i = args.indexOf('--max-days')
  if (i >= 0 && args[i + 1]) maxDays = Number(args[i + 1])

  const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.json'))
  const now = Date.now()
  const stale = []

  for (const f of files) {
    const d = JSON.parse(readFileSync(join(MODELS_DIR, f), 'utf8'))
    const fetched = d.fetched_at
    if (!fetched) {
      stale.push(`${d.model_id || f}: 缺少 fetched_at`)
      continue
    }
    const ageDays = (now - new Date(fetched).getTime()) / 86400000
    if (ageDays > maxDays) {
      stale.push(`${d.model_id || f}: ${fetched}（约 ${Math.round(ageDays)} 天前）`)
    }
  }

  if (stale.length === 0) {
    console.log(`✓ 全部 ${files.length} 个条目新鲜度正常（≤${maxDays} 天）`)
    process.exit(0)
  }
  console.warn(`⚠ ${stale.length} 个条目超过 ${maxDays} 天未复核：`)
  for (const s of stale) console.warn(`  - ${s}`)
  process.exit(1)
}

main()
