export type { ModelId } from './model-ids.js'

export type Task = 'generate' | 'edit' | 'extend'
export type InputType = 'reference_video' | 'reference_image' | 'audio'
export type Capability = 'lip-sync' | 'multi-shot' | 'camera-control'
export type Resolution = '360p' | '480p' | '540p' | '720p' | '768p' | '1080p' | '2k' | '4k'
export type RatioMode = 'inherit_from_reference_video' | 'client_choice'
export type DurationMode = 'inherit_from_reference_video' | 'client_choice' | 'explicit'
export type StandardError =
  | 'content_violation.real_person'
  | 'content_violation.safety'
  | 'content_violation.audio'
  | 'content_violation.copyright'
  | 'invalid_parameter'
  | 'quota_exceeded'
  | 'timeout'
  | 'interrupted'
  | 'access_denied'
  | 'provider_failed'
  | 'output_processing_failed'
  | 'settlement_failed'

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
  readonly input_limits?: InputLimits
  readonly rules?: Readonly<Record<
    string,
    TaskRule | string | boolean
  >>
  readonly output_limits?: OutputLimits | null
  readonly pricing?: Readonly<{
    currency?: 'CNY' | 'USD'
    unit?: string
    tiers?: Readonly<Record<string, number>>
    observed_at?: string
    source?: string
    note?: string
  }> | null
  readonly errors?: Readonly<Record<string, Readonly<{
    standard?: StandardError
    user_message?: string
  }> | string | boolean>>
}

export interface NumericRange {
  readonly min?: number | null
  readonly max?: number | null
  readonly step?: number | null
}

export interface InputCountRange {
  readonly min?: number | null
  readonly max?: number | null
}

export interface MediaLimits {
  readonly max_bytes?: number | null
  readonly formats?: readonly string[] | null
  readonly min_side_px?: number | null
  readonly max_side_px?: number | null
  readonly min_ratio?: number | null
  readonly max_ratio?: number | null
  readonly min_duration_seconds?: number | null
  readonly max_duration_seconds?: number | null
}

export interface InputLimits {
  readonly reference_videos?: InputCountRange
  readonly max_reference_images?: number | null
  readonly max_reference_videos?: number | null
  readonly max_reference_audios?: number | null
  readonly max_reference_materials?: number | null
  readonly image?: MediaLimits
  readonly video?: MediaLimits
  readonly additional_prompt?: Readonly<{ max_chars?: number | null }>
  readonly _missing?: boolean | readonly string[]
  readonly note?: string
  readonly [name: string]: unknown
}

export interface AudioRule {
  readonly max_reference_audios?: number | null
  readonly extra_charge?: boolean | null
}

export interface ConditionalRule {
  readonly when: Readonly<{
    readonly parameters?: Readonly<Record<string, readonly unknown[] | unknown>>
    readonly inputs?: Readonly<Record<
      'reference_images' | 'reference_videos' | 'reference_audios',
      Readonly<{ min_count?: number | null; max_count?: number | null }>
    >>
  }>
  readonly constraints: TaskRuleConstraints
  readonly note?: string
}

export interface TaskRuleConstraints {
  readonly duration_seconds?: NumericRange | -1 | null
  readonly resolution?: readonly Resolution[] | null
  readonly aspect_ratio?: readonly string[] | null
  readonly ratio_mode?: RatioMode | null
  readonly duration_mode?: DurationMode | null
  readonly generate_audio?: boolean | null
  readonly audio?: AudioRule
  readonly max_total_video_duration_seconds?: number | null
  readonly forbidden_parameters?: readonly string[]
}

export interface TaskRule extends TaskRuleConstraints {
  readonly supported_parameters?: readonly string[]
  readonly conditional_rules?: readonly ConditionalRule[]
  readonly note?: string
  readonly [name: string]: unknown
}

export interface OutputLimits {
  readonly max_duration_seconds?: number | null
  readonly aspect_ratio_mode?: 'inherit_from_reference_video' | 'client_choice' | null
  readonly [name: string]: unknown
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
  | 'PARAMETER_NOT_ALLOWED_IN_CONTEXT'
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
  | 'TOTAL_VIDEO_DURATION_EXCEEDED'
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

export interface NormalizedProviderError {
  readonly provider_code: string
  readonly standard: StandardError
  readonly user_message?: string
}

export function getModel(modelId: string): ModelEntry | undefined
export function listModels(filter?: ModelFilter): ModelEntry[]
export function validateRequest(modelId: string, request: ModelRequest): ValidationResult
export function normalizeError(
  modelId: string,
  providerCode: string | number,
): NormalizedProviderError | undefined
