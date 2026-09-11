import assert from 'node:assert/strict'
import test from 'node:test'
import { getModel, listModels } from '../src/index.mjs'

test('getModel returns a known immutable model', () => {
  const model = getModel('kling-2-6')

  assert.equal(model.model_id, 'kling-2-6')
  assert.equal(Object.isFrozen(model), true)
  assert.equal(Object.isFrozen(model.ability), true)
})

test('getModel returns undefined for an unknown model', () => {
  assert.equal(getModel('does-not-exist'), undefined)
})

test('listModels filters without exposing the internal array', () => {
  const kling = listModels({ provider: 'kling', task: 'generate' })
  assert.ok(kling.length > 0)
  assert.ok(kling.every((model) => model.provider === 'kling'))
  assert.ok(kling.every((model) => model.ability.tasks.includes('generate')))

  const imageModels = listModels({ input: 'reference_image' })
  assert.ok(imageModels.length > 0)
  assert.ok(imageModels.every((model) => model.ability.inputs.includes('reference_image')))

  const lipSync = listModels({ capability: 'lip-sync' })
  assert.ok(lipSync.length > 0)
  assert.ok(lipSync.every((model) => model.ability.capabilities.includes('lip-sync')))

  kling.pop()
  assert.notEqual(listModels({ provider: 'kling', task: 'generate' }).length, kling.length)
})
