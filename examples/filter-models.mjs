import { listModels } from '../src/index.mjs'

const models = listModels({ task: 'generate', input: 'reference_image' })

console.log(`Found ${models.length} image-to-video capable models.`)
console.log(models.slice(0, 5).map((model) => model.model_id).join('\n'))
