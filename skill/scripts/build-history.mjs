#!/usr/bin/env node
/**
 * build-history.mjs —— 生成/更新变更审计文件 update-history.json。
 * 对比上一次快照，记录本批 added / changed / removed（按 model_id、version、fetched_at）。
 * 下游无需翻 git log 即可知道「这次变了哪些模型」。
 *
 * 用法：node skill/scripts/build-history.mjs
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const MODELS_DIR = join(ROOT, 'models')
const HISTORY_PATH = join(ROOT, 'update-history.json')

function main() {
  const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.json'))
  const current = {}
  for (const f of files) {
    const d = JSON.parse(readFileSync(join(MODELS_DIR, f), 'utf8'))
    current[d.model_id] = { version: d.version, fetched_at: d.fetched_at }
  }

  const history = existsSync(HISTORY_PATH)
    ? JSON.parse(readFileSync(HISTORY_PATH, 'utf8'))
    : { batches: [] }
  const last = history.batches[history.batches.length - 1]
  const lastSnapshot = last?.snapshot || {}

  const added = Object.keys(current).filter((k) => !(k in lastSnapshot)).sort()
  const removed = Object.keys(lastSnapshot).filter((k) => !(k in current)).sort()
  const changed = Object.keys(current)
    .filter(
      (k) =>
        k in lastSnapshot &&
        (current[k].version !== lastSnapshot[k].version ||
          current[k].fetched_at !== lastSnapshot[k].fetched_at),
    )
    .sort()

  history.batches.push({
    generated_at: new Date().toISOString().slice(0, 10),
    summary: { added: added.length, changed: changed.length, removed: removed.length },
    added,
    changed,
    removed,
    snapshot: current,
  })

  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + '\n')
  console.log(`✓ 已更新 update-history.json：+${added.length} / ~${changed.length} / -${removed.length}`)
}

main()
