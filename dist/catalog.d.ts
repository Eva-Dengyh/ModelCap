// 由 build-dist.mjs 生成，勿手改。ModelCap 目录的精简 TS 类型。
export interface ModelEntry {
  model_id: string
  provider: string
  version: string
  fetched_at: string
  source_url: string
  ability: {
    tasks?: string[]
    inputs?: string[]
    scenes?: string[]
    capabilities?: string[]
    audio?: boolean | null
    note?: string
  }
  input_limits?: Record<string, unknown>
  rules?: Record<string, Record<string, unknown>>
  output_limits?: Record<string, unknown> | null
  pricing?: {
    currency?: 'CNY' | 'USD'
    unit?: string
    tiers?: Record<string, number>
    observed_at?: string
    source?: string
    note?: string
  } | null
  errors?: Record<string, { standard: string; user_message?: string }>
  rankings?: Array<{
    board: string
    label: string
    rank?: number | null
    score: number
    ci?: number | null
    samples?: number | null
    release_date?: string | null
    open_weights?: boolean | null
    price_usd_per_min?: number | null
    as_of: string
    url: string
  }>
}
