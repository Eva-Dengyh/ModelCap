import {
  getModel,
  listModels,
  normalizeError,
  validateRequest,
  type ConditionalRule,
  type ModelEntry,
  type TaskRule,
  type ValidationIssue,
} from '../src/index.js'

const imageModels: ModelEntry[] = listModels({
  task: 'generate',
  input: 'reference_image',
})

const wan = getModel('wan-3.0')

if (wan?.rules?.generate && typeof wan.rules.generate !== 'string' && typeof wan.rules.generate !== 'boolean') {
  const generateRule: TaskRule = wan.rules.generate
  const condition: ConditionalRule | undefined = generateRule.conditional_rules?.[0]
  const maxTotal: number | null | undefined = condition?.constraints.max_total_video_duration_seconds
  console.log(imageModels.length, maxTotal)
}

const result = validateRequest('wan-3.0', {
  task: 'generate',
  parameters: {
    duration: 12,
    resolution: '1080p',
    aspect_ratio: '16:9',
    generate_audio: true,
  },
  inputs: {
    reference_videos: [{ duration_seconds: 20, format: 'mp4' }],
  },
})

const issue: ValidationIssue | undefined = result.errors[0]
const normalized = normalizeError('wan-3.0', 'InvalidParameter')

console.log(issue?.code, normalized?.standard)
