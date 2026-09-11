export type Task = 'generate' | 'edit' | 'extend'
export type InputType = 'reference_video' | 'reference_image' | 'audio'
export type Capability = 'lip-sync' | 'multi-shot' | 'camera-control'

export interface ModelEntry {
  readonly model_id: string
  readonly provider: string
  readonly version: string
  readonly fetched_at: string
  readonly source_url: string
  readonly ability: Readonly<{
    tasks?: readonly Task[]
    inputs?: readonly InputType[]
    scenes?: readonly string[]
    capabilities?: readonly Capability[]
    audio?: boolean | null
    note?: string
  }>
  readonly input_limits?: Readonly<Record<string, unknown>>
  readonly rules?: Readonly<Record<string, Readonly<Record<string, unknown>>>>
  readonly output_limits?: Readonly<Record<string, unknown>> | null
  readonly pricing?: Readonly<{
    currency?: 'CNY' | 'USD'
    unit?: string
    tiers?: Readonly<Record<string, number>>
    observed_at?: string
    source?: string
    note?: string
  }> | null
  readonly errors?: Readonly<Record<string, Readonly<{
    standard?: string
    user_message?: string
  }> | string | boolean>>
}

export interface ModelFilter {
  readonly provider?: string
  readonly task?: Task
  readonly input?: InputType
  readonly capability?: Capability
}

export function getModel(modelId: string): ModelEntry | undefined
export function listModels(filter?: ModelFilter): ModelEntry[]
