#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const schemaPath = join(scriptDir, '../schema/model.schema.json')
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)
const validateModel = ajv.compile(schema)

function formatSchemaError(error) {
  const path = error.instancePath || '/'
  return `${path} ${error.message}`
}

function validateFile(file) {
  let entry
  try {
    entry = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    return {
      file,
      valid: false,
      errors: [`/ invalid JSON: ${error.message}`],
    }
  }

  const errors = []
  if (!validateModel(entry)) {
    errors.push(...(validateModel.errors ?? []).map(formatSchemaError))
  }

  const expectedId = basename(file, '.json')
  if (entry.model_id !== expectedId) {
    errors.push(`/model_id must match filename ${expectedId}`)
  }

  return { file, valid: errors.length === 0, errors }
}

export function validateFiles(files) {
  const results = files.map(validateFile)
  return { valid: results.every((result) => result.valid), results }
}

function main(files) {
  if (files.length === 0) {
    console.error('Usage: node skill/scripts/validate-schema.mjs models/*.json')
    process.exitCode = 1
    return
  }

  const result = validateFiles(files)
  for (const item of result.results) {
    if (item.valid) {
      console.log(`✓ ${item.file}`)
      continue
    }
    console.error(`✗ ${item.file}`)
    for (const error of item.errors) console.error(`    - ${error}`)
  }
  if (!result.valid) process.exitCode = 1
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2))
}
