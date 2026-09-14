import { validateRequest } from '../src/index.mjs'

const result = validateRequest('wan-3.0', {
  task: 'generate',
  parameters: {
    duration: 12,
    resolution: '1080p',
  },
  inputs: {
    reference_videos: [{ duration_seconds: 20, format: 'mp4' }],
  },
})

console.log(JSON.stringify(result, null, 2))
