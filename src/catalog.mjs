import { readFileSync } from 'node:fs'

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  for (const child of Object.values(value)) deepFreeze(child)
  return Object.freeze(value)
}

const catalogUrl = new URL('../dist/catalog.json', import.meta.url)
const catalog = deepFreeze(JSON.parse(readFileSync(catalogUrl, 'utf8')))
const byId = new Map(catalog.map((model) => [model.model_id, model]))

export function getModel(modelId) {
  return byId.get(modelId)
}

export function listModels(filter = {}) {
  return catalog.filter((model) =>
    (!filter.provider || model.provider === filter.provider) &&
    (!filter.task || model.ability?.tasks?.includes(filter.task)) &&
    (!filter.input || model.ability?.inputs?.includes(filter.input)) &&
    (!filter.capability || model.ability?.capabilities?.includes(filter.capability)))
}
