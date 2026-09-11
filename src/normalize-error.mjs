export function normalizeModelError(model, providerCode) {
  const key = String(providerCode)
  if (key === 'note' || key.startsWith('_')) return undefined

  const mapped = model?.errors?.[key]
  if (!mapped || typeof mapped !== 'object' || !mapped.standard) return undefined

  return {
    provider_code: key,
    standard: mapped.standard,
    ...(mapped.user_message ? { user_message: mapped.user_message } : {}),
  }
}
