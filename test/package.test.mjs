import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const root = new URL('../', import.meta.url).pathname

test('npm package contains the supported public surface only', () => {
  const cache = mkdtempSync(join(tmpdir(), 'modelcap-npm-cache-'))
  try {
    const result = spawnSync('npm', ['pack', '--dry-run', '--json'], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, npm_config_cache: cache },
    })
    assert.equal(result.status, 0, result.stderr)
    const [packed] = JSON.parse(result.stdout)
    const paths = packed.files.map((file) => file.path)

    assert.equal(packed.name, 'modelcap-catalog')
    assert.equal(packed.version, '0.1.0')
    for (const required of [
      'src/index.mjs',
      'src/index.d.ts',
      'dist/catalog.json',
      'dist/index.json',
      'src/model-ids.d.ts',
      'LICENSE',
      'DATA_LICENSE.md',
      'CHANGELOG.md',
      'docs/API.md',
      'docs/VERSIONING.md',
      'examples/filter-models.mjs',
      'examples/validate-request.mjs',
      'examples/normalize-error.mjs',
      'examples/typescript-consumer.ts',
      'README.md',
      'README.zh-CN.md',
    ]) {
      assert.ok(paths.includes(required), `missing package file: ${required}`)
    }
    assert.equal(paths.some((path) => path.startsWith('models/')), false)
    assert.equal(paths.some((path) => path.startsWith('test/')), false)
    assert.equal(paths.some((path) => path.startsWith('.github/')), false)
    assert.equal(paths.some((path) => path.startsWith('.zcode/')), false)
  } finally {
    rmSync(cache, { recursive: true, force: true })
  }
})

test('package defines the complete reproducible CI gate', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

  assert.equal(pkg.scripts.test, 'node --test test/*.test.mjs')
  assert.equal(pkg.scripts.typecheck, 'tsc --noEmit')
  assert.equal(pkg.scripts['examples:check'], 'node examples/filter-models.mjs && node examples/validate-request.mjs && node examples/normalize-error.mjs')
  assert.equal(pkg.scripts['build:check'], 'npm run build && git diff --exit-code -- dist src/model-ids.d.ts')
  assert.equal(
    pkg.scripts.ci,
    'npm test && npm run typecheck && npm run examples:check && npm run validate:catalog && npm run validate:schema && npm run check:fresh && npm run build:check && npm run pack:check',
  )
})
