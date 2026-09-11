#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function collectSources(entries) {
  const collected = new Map()

  const add = (url, modelId, kind) => {
    if (typeof url !== 'string' || !url) return
    const current = collected.get(url) ?? {
      url,
      model_ids: new Set(),
      kinds: new Set(),
    }
    current.model_ids.add(modelId)
    current.kinds.add(kind)
    collected.set(url, current)
  }

  for (const entry of entries) {
    add(entry.source_url, entry.model_id, 'model')
    add(entry.pricing?.source, entry.model_id, 'pricing')
  }

  return [...collected.values()]
    .map((item) => ({
      url: item.url,
      model_ids: [...item.model_ids].sort(),
      kinds: [...item.kinds].sort(),
    }))
    .sort((a, b) => a.url.localeCompare(b.url))
}

async function auditOne(source, fetchImpl, timeoutMs) {
  const checkedAt = new Date().toISOString()
  try {
    const response = await fetchImpl(source.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'ModelCap-source-audit/0.1' },
    })
    const body = Buffer.from(await response.arrayBuffer())
    const status = response.status
    const outcome = status >= 500
      ? 'server_error'
      : status >= 400
        ? 'client_error'
        : response.redirected
          ? 'redirected'
          : 'ok'

    return {
      ...source,
      checked_at: checkedAt,
      outcome,
      status,
      final_url: response.url || source.url,
      etag: response.headers.get('etag'),
      last_modified: response.headers.get('last-modified'),
      body_sha256: createHash('sha256').update(body).digest('hex'),
    }
  } catch (error) {
    const outcome = error?.name === 'TimeoutError' || error?.name === 'AbortError'
      ? 'timeout'
      : 'network_error'
    return {
      ...source,
      checked_at: checkedAt,
      outcome,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function auditUrls(
  sources,
  { fetchImpl = fetch, timeoutMs = 15000, concurrency = 5 } = {},
) {
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError('timeoutMs must be a positive integer')
  }
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new TypeError('concurrency must be a positive integer')
  }

  const ordered = [...sources].sort((a, b) => a.url.localeCompare(b.url))
  const results = new Array(ordered.length)
  let cursor = 0

  async function worker() {
    while (cursor < ordered.length) {
      const index = cursor
      cursor += 1
      results[index] = await auditOne(ordered[index], fetchImpl, timeoutMs)
    }
  }

  const workerCount = Math.min(concurrency, Math.max(ordered.length, 1))
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

function parseArgs(args) {
  const options = { output: undefined, timeoutMs: 15000, concurrency: 5 }
  const names = {
    '--output': 'output',
    '--timeout-ms': 'timeoutMs',
    '--concurrency': 'concurrency',
  }

  for (let index = 0; index < args.length; index += 2) {
    const name = names[args[index]]
    const value = args[index + 1]
    if (!name || value === undefined) {
      throw new TypeError(`invalid argument: ${args[index]}`)
    }
    options[name] = name === 'output' ? value : Number(value)
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new TypeError('--timeout-ms must be a positive integer')
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency <= 0) {
    throw new TypeError('--concurrency must be a positive integer')
  }
  return options
}

function summarize(results) {
  const summary = {
    total: results.length,
    ok: 0,
    redirected: 0,
    client_error: 0,
    server_error: 0,
    network_error: 0,
    timeout: 0,
  }
  for (const result of results) summary[result.outcome] += 1
  return summary
}

async function main(args) {
  const options = parseArgs(args)
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
  const modelDir = join(root, 'models')
  const entries = readdirSync(modelDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(modelDir, name), 'utf8')))
  const sources = await auditUrls(collectSources(entries), options)
  const report = {
    generated_at: new Date().toISOString(),
    summary: summarize(sources),
    sources,
  }
  const json = `${JSON.stringify(report, null, 2)}\n`

  if (options.output) {
    const output = resolve(options.output)
    mkdirSync(dirname(output), { recursive: true })
    writeFileSync(output, json)
    console.log(JSON.stringify(report.summary))
  } else {
    process.stdout.write(json)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
