#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const root = new URL('../../', import.meta.url)

function readText(path) {
  return readFileSync(new URL(path, root), 'utf8')
}

function readJson(path) {
  return JSON.parse(readText(path))
}

function fail(message) {
  console.error(`✗ ${message}`)
  process.exitCode = 1
}

const pkg = readJson('package.json')
const changelog = readText('CHANGELOG.md')
const releaseDoc = readText('docs/RELEASE.md')

const versionHeading = new RegExp(`^## ${pkg.version} - \\d{4}-\\d{2}-\\d{2}$`, 'm')
if (!versionHeading.test(changelog)) {
  fail(`CHANGELOG.md must contain a release heading for package version ${pkg.version}`)
}

if (!pkg.bin?.modelcap) {
  fail('package.json must expose the modelcap CLI binary')
}

for (const requiredScript of ['ci', 'pack:check', 'release:check']) {
  if (!pkg.scripts?.[requiredScript]) {
    fail(`package.json must define npm run ${requiredScript}`)
  }
}

for (const requiredFile of ['CHANGELOG.md', 'DATA_LICENSE.md', 'docs/RELEASE.md', 'README.md']) {
  if (!pkg.files?.includes(requiredFile)) {
    fail(`package.json files must include ${requiredFile}`)
  }
}

for (const requiredPhrase of [
  'npm run release:check',
  'npm publish --provenance',
  'git tag v',
  'GitHub Release',
]) {
  if (!releaseDoc.includes(requiredPhrase)) {
    fail(`docs/RELEASE.md must mention ${requiredPhrase}`)
  }
}

if (!process.exitCode) {
  console.log(`✓ release metadata is consistent for ${pkg.name}@${pkg.version}`)
}
