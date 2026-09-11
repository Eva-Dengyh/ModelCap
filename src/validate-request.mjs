function issue(code, path, message, expected, actual) {
  return {
    code,
    path,
    message,
    ...(expected === undefined ? {} : { expected }),
    ...(actual === undefined ? {} : { actual }),
  }
}

function isPresent(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function matchesStep(value, origin, step) {
  if (!Number.isFinite(step) || step <= 0) return true
  const steps = (value - origin) / step
  return Math.abs(steps - Math.round(steps)) <= 1e-9
}

export function validateModelRequest(model, request) {
  const errors = []
  const warnings = []
  const finish = () => ({ valid: errors.length === 0, errors, warnings })

  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    errors.push(issue('INVALID_REQUEST', '$', 'request must be an object'))
    return finish()
  }

  const task = request.task
  if (!model.ability?.tasks?.includes(task)) {
    errors.push(issue(
      'UNSUPPORTED_TASK',
      '$.task',
      'task is not supported',
      model.ability?.tasks,
      task,
    ))
    return finish()
  }

  const rule = model.rules?.[task]
  const parameters = request.parameters ?? {}
  if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters)) {
    errors.push(issue(
      'INVALID_PARAMETER_TYPE',
      '$.parameters',
      'parameters must be an object',
      'object',
      parameters,
    ))
    return finish()
  }

  if (!rule) {
    warnings.push(issue(
      'CONSTRAINT_UNKNOWN',
      '$.parameters',
      'no task rules are documented',
    ))
    return finish()
  }

  const supported = rule.supported_parameters
  for (const name of Object.keys(parameters)) {
    if (Array.isArray(supported) && !supported.includes(name)) {
      errors.push(issue(
        'UNSUPPORTED_PARAMETER',
        `$.parameters.${name}`,
        'parameter is not supported',
        supported,
        name,
      ))
    } else if (!Array.isArray(supported)) {
      warnings.push(issue(
        'PARAMETER_SUPPORT_UNKNOWN',
        `$.parameters.${name}`,
        'supported parameter list is not documented',
      ))
    }
  }

  if (isPresent(parameters, 'duration')) {
    const value = parameters.duration
    const limit = rule.duration_seconds
    if (limit === undefined || limit === null) {
      warnings.push(issue(
        'CONSTRAINT_UNKNOWN',
        '$.parameters.duration',
        'duration constraint is not documented',
      ))
    } else if (limit === -1) {
      errors.push(issue(
        'DURATION_SERVER_CONTROLLED',
        '$.parameters.duration',
        'duration is controlled by the provider',
        'omit duration',
        value,
      ))
    } else if (!Number.isFinite(value)) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        '$.parameters.duration',
        'duration must be a finite number',
        'number',
        value,
      ))
    } else if (
      (limit.min != null && value < limit.min) ||
      (limit.max != null && value > limit.max)
    ) {
      errors.push(issue(
        'DURATION_OUT_OF_RANGE',
        '$.parameters.duration',
        'duration is outside the documented range',
        limit,
        value,
      ))
    } else if (limit.step != null && !matchesStep(value, limit.min ?? 0, limit.step)) {
      errors.push(issue(
        'DURATION_STEP_MISMATCH',
        '$.parameters.duration',
        'duration does not match the documented step',
        limit,
        value,
      ))
    }
  }

  if (isPresent(parameters, 'resolution')) {
    if (rule.resolution == null) {
      warnings.push(issue(
        'CONSTRAINT_UNKNOWN',
        '$.parameters.resolution',
        'resolution choices are not documented',
      ))
    } else if (!rule.resolution.includes(parameters.resolution)) {
      errors.push(issue(
        'RESOLUTION_NOT_ALLOWED',
        '$.parameters.resolution',
        'resolution is not allowed',
        rule.resolution,
        parameters.resolution,
      ))
    }
  }

  if (isPresent(parameters, 'aspect_ratio')) {
    if (rule.aspect_ratio == null) {
      warnings.push(issue(
        'CONSTRAINT_UNKNOWN',
        '$.parameters.aspect_ratio',
        'aspect-ratio choices are not documented',
      ))
    } else if (!rule.aspect_ratio.includes(parameters.aspect_ratio)) {
      errors.push(issue(
        'ASPECT_RATIO_NOT_ALLOWED',
        '$.parameters.aspect_ratio',
        'aspect ratio is not allowed',
        rule.aspect_ratio,
        parameters.aspect_ratio,
      ))
    }
  }

  if (parameters.generate_audio === true && rule.generate_audio === false) {
    errors.push(issue(
      'AUDIO_GENERATION_NOT_SUPPORTED',
      '$.parameters.generate_audio',
      'audio generation is explicitly unsupported',
      false,
      true,
    ))
  } else if (isPresent(parameters, 'generate_audio') && rule.generate_audio == null) {
    warnings.push(issue(
      'CONSTRAINT_UNKNOWN',
      '$.parameters.generate_audio',
      'audio-generation support is not documented',
    ))
  }

  return finish()
}

export function validateRequest(modelId, request, findModel) {
  const model = findModel(modelId)
  if (!model) {
    return {
      valid: false,
      errors: [issue(
        'UNKNOWN_MODEL',
        '$.model_id',
        'model is not in the catalog',
        undefined,
        modelId,
      )],
      warnings: [],
    }
  }
  return validateModelRequest(model, request)
}
