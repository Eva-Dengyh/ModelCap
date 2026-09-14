#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { getModel, listModels, validateRequest } from '../src/index.mjs'

function usage() {
  return `Usage: modelcap <command> [options]

Commands:
  list [--provider value] [--task value] [--input value] [--capability value] [--json]
  get <model_id>
  validate <model_id> <request.json>
`
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2))
}

function fail(message, code = 1) {
  console.error(message)
  process.exitCode = code
}

function parseOptions(args) {
  const options = {}
  const positionals = []
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg.startsWith('--')) {
      const name = arg.slice(2)
      const value = args[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for --${name}`)
      }
      options[name] = value
      index += 1
      continue
    }
    positionals.push(arg)
  }
  return { options, positionals }
}

function commandList(args) {
  const { options } = parseOptions(args)
  const models = listModels({
    provider: options.provider,
    task: options.task,
    input: options.input,
    capability: options.capability,
  })

  if (options.json) {
    printJson(models)
    return
  }

  console.log(models.map((model) => model.model_id).join('\n'))
}

function commandGet(args) {
  const [modelId] = args
  if (!modelId) {
    fail(usage())
    return
  }

  const model = getModel(modelId)
  if (!model) {
    fail(`Unknown model: ${modelId}`)
    return
  }

  printJson(model)
}

function readRequest(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${file}`)
    }
    throw error
  }
}

function commandValidate(args) {
  const [modelId, file] = args
  if (!modelId || !file) {
    fail(usage())
    return
  }

  let request
  try {
    request = readRequest(file)
  } catch (error) {
    fail(error.message)
    return
  }

  const result = validateRequest(modelId, request)
  printJson(result)
  process.exitCode = result.valid ? 0 : 1
}

function main(argv) {
  const [command, ...args] = argv
  try {
    switch (command) {
      case 'list':
        commandList(args)
        return
      case 'get':
        commandGet(args)
        return
      case 'validate':
        commandValidate(args)
        return
      default:
        fail(usage())
    }
  } catch (error) {
    fail(error.message)
  }
}

main(process.argv.slice(2))
