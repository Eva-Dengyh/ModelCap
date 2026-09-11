import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { validateFiles } from '../skill/scripts/validate-schema.mjs'

const root = new URL('../', import.meta.url).pathname
const modelsDir = join(root, 'models')

test('full schema validation rejects an invalid task value', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'modelcap-schema-'))
  const file = join(tempDir, 'fixture-model.json')
  const entry = JSON.parse(readFileSync(join(modelsDir, 'kling-2-6.json'), 'utf8'))
  entry.model_id = 'fixture-model'
  entry.ability.tasks = ['invalid-task']
  writeFileSync(file, `${JSON.stringify(entry, null, 2)}\n`)

  try {
    const result = validateFiles([file])
    assert.equal(result.valid, false)
    assert.match(result.results[0].errors[0], /\/ability\/tasks\/0/)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('every committed model satisfies the full schema', () => {
  const files = readdirSync(modelsDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => join(modelsDir, name))

  const result = validateFiles(files)

  assert.equal(
    result.valid,
    true,
    result.results
      .filter((item) => !item.valid)
      .map((item) => `${item.file}: ${item.errors.join('; ')}`)
      .join('\n'),
  )
})
