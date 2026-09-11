import { getModel } from './catalog.mjs'
import { validateRequest as validate } from './validate-request.mjs'

export { getModel, listModels } from './catalog.mjs'

export const validateRequest = (modelId, request) => validate(modelId, request, getModel)
