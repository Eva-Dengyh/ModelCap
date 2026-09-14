import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const root = new URL('../', import.meta.url).pathname
const cli = join(root, 'bin/modelcap.mjs')

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
  })
}

test('list prints filtered model ids by default', () => {
  const result = run(['list', '--task', 'generate', '--input', 'reference_image'])

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /^agnes-video-2-5$/m)
  assert.match(result.stdout, /^wan-3\.0$/m)
})

test('list prints filtered models as json', () => {
  const result = run(['list', '--provider', 'aliyun', '--json'])

  assert.equal(result.status, 0, result.stderr)
  const models = JSON.parse(result.stdout)
  assert.ok(models.length > 0)
  assert.equal(models.every((model) => model.provider === 'aliyun'), true)
})

test('get prints one model as json', () => {
  const result = run(['get', 'wan-3.0'])

  assert.equal(result.status, 0, result.stderr)
  const model = JSON.parse(result.stdout)
  assert.equal(model.model_id, 'wan-3.0')
})

test('get exits nonzero for an unknown model', () => {
  const result = run(['get', 'does-not-exist'])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unknown model: does-not-exist/)
})

test('validate reads request json and preserves validation issues', () => {
  const dir = mkdtempSync(join(tmpdir(), 'modelcap-cli-'))
  const requestPath = join(dir, 'request.json')
  writeFileSync(requestPath, JSON.stringify({
    task: 'generate',
    parameters: { duration: 12, resolution: '1080p' },
    inputs: { reference_videos: [{ duration_seconds: 20, format: 'mp4' }] },
  }))

  try {
    const result = run(['validate', 'wan-3.0', requestPath])

    assert.equal(result.status, 1)
    const validation = JSON.parse(result.stdout)
    assert.equal(validation.valid, false)
    assert.deepEqual(
      validation.errors.map((issue) => issue.code),
      ['VIDEO_DURATION_OUT_OF_RANGE', 'TOTAL_VIDEO_DURATION_EXCEEDED'],
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('validate exits nonzero for invalid request json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'modelcap-cli-'))
  const requestPath = join(dir, 'request.json')
  writeFileSync(requestPath, '{')

  try {
    const result = run(['validate', 'wan-3.0', requestPath])

    assert.equal(result.status, 1)
    assert.match(result.stderr, /Invalid JSON/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('prints usage for missing command', () => {
  const result = run([])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Usage: modelcap/)
})
