import { getModel } from './catalog.mjs'
import { normalizeModelError } from './normalize-error.mjs'
import { validateRequest as validate } from './validate-request.mjs'

export { getModel, listModels } from './catalog.mjs'

export const validateRequest = (modelId, request) => validate(modelId, request, getModel)

export const normalizeError = (modelId, providerCode) =>
  normalizeModelError(getModel(modelId), providerCode)
