import {
  getModel,
  validateRequest,
  type ModelId,
  type TaskRule,
  type ValidationResult,
} from '../src/index.js'

const modelId: ModelId = 'wan-3.0'
const model = getModel(modelId)

if (model?.rules?.generate && typeof model.rules.generate !== 'string' && typeof model.rules.generate !== 'boolean') {
  const generateRule: TaskRule = model.rules.generate
  console.log(generateRule.duration_seconds)
}

const result: ValidationResult = validateRequest(modelId, {
  task: 'generate',
  parameters: { duration: 5, resolution: '1080p' },
})

console.log(result.valid)
