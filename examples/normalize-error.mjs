import { normalizeError } from '../src/index.mjs'

const error = normalizeError('seedance-1-5-pro', 'QuotaExceeded')

console.log(JSON.stringify(error, null, 2))
