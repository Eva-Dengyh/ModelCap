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

export interface ModelRequest {
  readonly task: Task
  readonly parameters?: Readonly<{
    duration?: number
    resolution?: string
    aspect_ratio?: string
    generate_audio?: boolean
    readonly [name: string]: unknown
  }>
  readonly inputs?: Readonly<{
    reference_images?: readonly Readonly<{
      bytes?: number
      format?: string
      width?: number
      height?: number
    }>[]
    reference_videos?: readonly Readonly<{
      duration_seconds?: number
      format?: string
    }>[]
    reference_audios?: readonly unknown[]
  }>
  readonly additional_prompt?: string
}

export type ValidationIssueCode =
  | 'UNKNOWN_MODEL'
  | 'INVALID_REQUEST'
  | 'INVALID_PARAMETER_TYPE'
  | 'UNSUPPORTED_TASK'
  | 'UNSUPPORTED_PARAMETER'
  | 'PARAMETER_SUPPORT_UNKNOWN'
  | 'CONSTRAINT_UNKNOWN'
  | 'DURATION_SERVER_CONTROLLED'
  | 'DURATION_OUT_OF_RANGE'
  | 'DURATION_STEP_MISMATCH'
  | 'RESOLUTION_NOT_ALLOWED'
  | 'ASPECT_RATIO_NOT_ALLOWED'
  | 'AUDIO_GENERATION_NOT_SUPPORTED'
  | 'INPUT_COUNT_EXCEEDED'
  | 'INPUT_COUNT_OUT_OF_RANGE'
  | 'TOTAL_MATERIALS_EXCEEDED'
  | 'IMAGE_TOO_LARGE'
  | 'IMAGE_FORMAT_NOT_ALLOWED'
  | 'IMAGE_SIDE_TOO_SMALL'
  | 'IMAGE_SIDE_TOO_LARGE'
  | 'IMAGE_RATIO_OUT_OF_RANGE'
  | 'VIDEO_DURATION_OUT_OF_RANGE'
  | 'VIDEO_FORMAT_NOT_ALLOWED'
  | 'PROMPT_TOO_LONG'

export interface ValidationIssue {
  readonly code: ValidationIssueCode
  readonly path: string
  readonly message: string
  readonly expected?: unknown
  readonly actual?: unknown
}

export interface ValidationResult {
  readonly valid: boolean
  readonly errors: readonly ValidationIssue[]
  readonly warnings: readonly ValidationIssue[]
}

export function getModel(modelId: string): ModelEntry | undefined
export function listModels(filter?: ModelFilter): ModelEntry[]
export function validateRequest(modelId: string, request: ModelRequest): ValidationResult
