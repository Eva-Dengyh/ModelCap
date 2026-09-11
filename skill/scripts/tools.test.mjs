import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const toolsPath = new URL('./tools.mjs', import.meta.url).pathname
const buildDistPath = new URL('./build-dist.mjs', import.meta.url).pathname
const catalogPath = new URL('../../dist/catalog.json', import.meta.url).pathname
const catalogTypesPath = new URL('../../dist/catalog.d.ts', import.meta.url).pathname

function withFixture(run) {
  const dir = mkdtempSync(join(tmpdir(), 'modelcap-tools-'))
  const file = join(dir, 'example-model.json')
  const entry = {
    model_id: 'example-model',
    provider: 'example',
    version: '1',
    fetched_at: '2026-09-11',
    source_url: 'https://example.com/model',
    ability: { tasks: ['generate'], inputs: [] },
    input_limits: {},
    rules: {},
    errors: {},
    rankings: [{
      board: 'aa-t2v',
      label: 'Example Model',
      rank: 1,
      score: 1234,
      price_usd_per_min: 5,
      as_of: '2026-09-11',
      url: 'https://example.com/leaderboard',
    }],
  }
  writeFileSync(file, JSON.stringify(entry), 'utf8')
  try {
    run({ dir, file })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('validate rejects the removed rankings field', () => {
  withFixture(({ file }) => {
    const result = spawnSync(process.execPath, [toolsPath, 'validate', file], { encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /rankings/)
  })
})

test('render does not expose legacy leaderboard results', () => {
  withFixture(({ dir, file }) => {
    const result = spawnSync(process.execPath, [toolsPath, 'render', file], { encoding: 'utf8' })
    assert.equal(result.status, 0)
    const markdown = readFileSync(join(dir, 'example-model.md'), 'utf8')
    assert.doesNotMatch(markdown, /榜单数据|Example Model|1234|5\.00/)
  })
})

test('distribution artifacts do not expose leaderboard results', () => {
  const result = spawnSync(process.execPath, [buildDistPath], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
  assert.equal(catalog.some((entry) => Object.hasOwn(entry, 'rankings')), false)
  assert.doesNotMatch(readFileSync(catalogTypesPath, 'utf8'), /rankings|price_usd_per_min/)
})
