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

function warnUnknown(warnings, path, message) {
  warnings.push(issue('CONSTRAINT_UNKNOWN', path, message))
}

function validateInputCounts(limits, inputs, errors, hasReferenceVideos) {
  const images = inputs.reference_images
  const videos = inputs.reference_videos
  const audios = inputs.reference_audios
  const checks = [
    ['reference_images', images.length, limits.max_reference_images],
    ['reference_videos', videos.length, limits.max_reference_videos],
    ['reference_audios', audios.length, limits.max_reference_audios],
  ]

  for (const [name, count, max] of checks) {
    if (max != null && count > max) {
      errors.push(issue(
        'INPUT_COUNT_EXCEEDED',
        `$.inputs.${name}`,
        `${name} exceeds the documented maximum`,
        max,
        count,
      ))
    }
  }

  if (hasReferenceVideos && limits.reference_videos) {
    const { min, max } = limits.reference_videos
    if ((min != null && videos.length < min) || (max != null && videos.length > max)) {
      errors.push(issue(
        'INPUT_COUNT_OUT_OF_RANGE',
        '$.inputs.reference_videos',
        'reference video count is outside the documented range',
        { min, max },
        videos.length,
      ))
    }
  }

  const materialCount = images.length + videos.length
  if (
    limits.max_reference_materials != null &&
    materialCount > limits.max_reference_materials
  ) {
    errors.push(issue(
      'TOTAL_MATERIALS_EXCEEDED',
      '$.inputs',
      'image and video material count exceeds the documented maximum',
      limits.max_reference_materials,
      materialCount,
    ))
  }
}

function validateImages(limits, images, errors, warnings) {
  const imageLimits = limits.image
  if (!imageLimits) {
    if (images.length > 0) {
      warnUnknown(
        warnings,
        '$.inputs.reference_images[0]',
        'image limits are not documented',
      )
    }
    return
  }

  images.forEach((image, index) => {
    const base = `$.inputs.reference_images[${index}]`
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        base,
        'reference image metadata must be an object',
        'object',
        image,
      ))
      return
    }

    if (image.bytes != null && (!Number.isFinite(image.bytes) || image.bytes < 0)) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.bytes`,
        'image byte size must be a non-negative finite number',
        'non-negative number',
        image.bytes,
      ))
    } else if (image.bytes == null && imageLimits.max_bytes != null) {
      warnUnknown(warnings, `${base}.bytes`, 'image byte size was not supplied')
    } else if (image.bytes != null && imageLimits.max_bytes == null) {
      warnUnknown(warnings, `${base}.bytes`, 'image byte limit is not documented')
    } else if (image.bytes > imageLimits.max_bytes) {
      errors.push(issue(
        'IMAGE_TOO_LARGE',
        `${base}.bytes`,
        'image exceeds the documented byte limit',
        imageLimits.max_bytes,
        image.bytes,
      ))
    }

    if (image.format != null && typeof image.format !== 'string') {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.format`,
        'image format must be a string',
        'string',
        image.format,
      ))
    } else if (image.format == null && Array.isArray(imageLimits.formats)) {
      warnUnknown(warnings, `${base}.format`, 'image format was not supplied')
    } else if (image.format != null && imageLimits.formats == null) {
      warnUnknown(warnings, `${base}.format`, 'allowed image formats are not documented')
    } else if (
      image.format != null &&
      !imageLimits.formats.includes(String(image.format).toLowerCase())
    ) {
      errors.push(issue(
        'IMAGE_FORMAT_NOT_ALLOWED',
        `${base}.format`,
        'image format is not allowed',
        imageLimits.formats,
        image.format,
      ))
    }

    const widthSupplied = isPresent(image, 'width')
    const heightSupplied = isPresent(image, 'height')
    const invalidWidth = widthSupplied && (!Number.isFinite(image.width) || image.width <= 0)
    const invalidHeight = heightSupplied && (!Number.isFinite(image.height) || image.height <= 0)
    if (invalidWidth) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.width`,
        'image width must be a positive finite number',
        'positive number',
        image.width,
      ))
    }
    if (invalidHeight) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.height`,
        'image height must be a positive finite number',
        'positive number',
        image.height,
      ))
    }

    const hasDimensions =
      Number.isFinite(image.width) && image.width > 0 &&
      Number.isFinite(image.height) && image.height > 0
    const hasDimensionLimits = [
      imageLimits.min_side_px,
      imageLimits.max_side_px,
      imageLimits.min_ratio,
      imageLimits.max_ratio,
    ].some((value) => value != null)

    if (!hasDimensions && hasDimensionLimits && !invalidWidth && !invalidHeight) {
      warnUnknown(warnings, base, 'image dimensions were not supplied')
      return
    }
    if (!hasDimensions) return

    const minSide = Math.min(image.width, image.height)
    const maxSide = Math.max(image.width, image.height)
    const ratio = image.width / image.height
    if (imageLimits.min_side_px != null && minSide < imageLimits.min_side_px) {
      errors.push(issue(
        'IMAGE_SIDE_TOO_SMALL',
        base,
        'image side is below the documented minimum',
        imageLimits.min_side_px,
        minSide,
      ))
    }
    if (imageLimits.max_side_px != null && maxSide > imageLimits.max_side_px) {
      errors.push(issue(
        'IMAGE_SIDE_TOO_LARGE',
        base,
        'image side exceeds the documented maximum',
        imageLimits.max_side_px,
        maxSide,
      ))
    }
    if (
      (imageLimits.min_ratio != null && ratio < imageLimits.min_ratio) ||
      (imageLimits.max_ratio != null && ratio > imageLimits.max_ratio)
    ) {
      errors.push(issue(
        'IMAGE_RATIO_OUT_OF_RANGE',
        base,
        'image ratio is outside the documented range',
        { min: imageLimits.min_ratio, max: imageLimits.max_ratio },
        ratio,
      ))
    }
  })
}

function validateVideos(limits, videos, errors, warnings) {
  const videoLimits = limits.video
  if (!videoLimits) {
    if (videos.length > 0) {
      warnUnknown(
        warnings,
        '$.inputs.reference_videos[0]',
        'reference video limits are not documented',
      )
    }
    return
  }

  videos.forEach((video, index) => {
    const base = `$.inputs.reference_videos[${index}]`
    if (!video || typeof video !== 'object' || Array.isArray(video)) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        base,
        'reference video metadata must be an object',
        'object',
        video,
      ))
      return
    }

    if (
      video.duration_seconds != null &&
      (!Number.isFinite(video.duration_seconds) || video.duration_seconds < 0)
    ) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.duration_seconds`,
        'reference video duration must be a non-negative finite number',
        'non-negative number',
        video.duration_seconds,
      ))
    } else if (
      video.duration_seconds == null &&
      (videoLimits.min_duration_seconds != null || videoLimits.max_duration_seconds != null)
    ) {
      warnUnknown(warnings, `${base}.duration_seconds`, 'reference video duration was not supplied')
    } else if (
      video.duration_seconds != null &&
      videoLimits.min_duration_seconds == null &&
      videoLimits.max_duration_seconds == null
    ) {
      warnUnknown(warnings, `${base}.duration_seconds`, 'reference video duration limits are not documented')
    } else if (
      (videoLimits.min_duration_seconds != null &&
        video.duration_seconds < videoLimits.min_duration_seconds) ||
      (videoLimits.max_duration_seconds != null &&
        video.duration_seconds > videoLimits.max_duration_seconds)
    ) {
      errors.push(issue(
        'VIDEO_DURATION_OUT_OF_RANGE',
        `${base}.duration_seconds`,
        'reference video duration is outside the documented range',
        { min: videoLimits.min_duration_seconds, max: videoLimits.max_duration_seconds },
        video.duration_seconds,
      ))
    }

    if (video.format != null && typeof video.format !== 'string') {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        `${base}.format`,
        'reference video format must be a string',
        'string',
        video.format,
      ))
    } else if (video.format == null && Array.isArray(videoLimits.formats)) {
      warnUnknown(warnings, `${base}.format`, 'reference video format was not supplied')
    } else if (video.format != null && videoLimits.formats == null) {
      warnUnknown(warnings, `${base}.format`, 'allowed reference video formats are not documented')
    } else if (
      video.format != null &&
      !videoLimits.formats
        .map((value) => value.toLowerCase())
        .includes(String(video.format).toLowerCase())
    ) {
      errors.push(issue(
        'VIDEO_FORMAT_NOT_ALLOWED',
        `${base}.format`,
        'reference video format is not allowed',
        videoLimits.formats,
        video.format,
      ))
    }
  })
}

function validatePrompt(limits, prompt, errors, warnings) {
  if (prompt === undefined) return
  const max = limits.additional_prompt?.max_chars
  if (typeof prompt !== 'string') {
    errors.push(issue(
      'INVALID_PARAMETER_TYPE',
      '$.additional_prompt',
      'additional prompt must be a string',
      'string',
      prompt,
    ))
  } else if (max == null) {
    warnUnknown(warnings, '$.additional_prompt', 'additional prompt limit is not documented')
  } else if (prompt.length > max) {
    errors.push(issue(
      'PROMPT_TOO_LONG',
      '$.additional_prompt',
      'additional prompt exceeds the documented character limit',
      max,
      prompt.length,
    ))
  }
}

export function validateModelRequest(model, request) {
  const errors = []
  const warnings = []
  const finish = () => ({
    valid: errors.length === 0,
    errors,
    warnings: [...new Map(
      warnings.map((item) => [`${item.code}:${item.path}`, item]),
    ).values()],
  })

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
  let parameters = {}
  if (isPresent(request, 'parameters')) {
    if (!request.parameters || typeof request.parameters !== 'object' || Array.isArray(request.parameters)) {
      errors.push(issue(
        'INVALID_PARAMETER_TYPE',
        '$.parameters',
        'parameters must be an object',
        'object',
        request.parameters,
      ))
    } else {
      parameters = request.parameters
    }
  }

  if (!rule) {
    warnings.push(issue(
      'CONSTRAINT_UNKNOWN',
      '$.parameters',
      'no task rules are documented',
    ))
  }

  const supported = rule?.supported_parameters
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
    const limit = rule?.duration_seconds
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
    if (rule?.resolution == null) {
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
    if (rule?.aspect_ratio == null) {
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

  if (isPresent(parameters, 'generate_audio') && typeof parameters.generate_audio !== 'boolean') {
    errors.push(issue(
      'INVALID_PARAMETER_TYPE',
      '$.parameters.generate_audio',
      'generate_audio must be a boolean',
      'boolean',
      parameters.generate_audio,
    ))
  } else if (parameters.generate_audio === true && rule?.generate_audio === false) {
    errors.push(issue(
      'AUDIO_GENERATION_NOT_SUPPORTED',
      '$.parameters.generate_audio',
      'audio generation is explicitly unsupported',
      false,
      true,
    ))
  } else if (isPresent(parameters, 'generate_audio') && rule?.generate_audio == null) {
    warnings.push(issue(
      'CONSTRAINT_UNKNOWN',
      '$.parameters.generate_audio',
      'audio-generation support is not documented',
    ))
  }

  const hasInputs = isPresent(request, 'inputs')
  const inputs = hasInputs ? request.inputs : {}
  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) {
    errors.push(issue(
      'INVALID_PARAMETER_TYPE',
      '$.inputs',
      'inputs must be an object',
      'object',
      inputs,
    ))
  } else {
    for (const name of ['reference_images', 'reference_videos', 'reference_audios']) {
      if (isPresent(inputs, name) && !Array.isArray(inputs[name])) {
        errors.push(issue(
          'INVALID_PARAMETER_TYPE',
          `$.inputs.${name}`,
          `${name} must be an array`,
          'array',
          inputs[name],
        ))
      }
    }

    const safeInputs = {
      reference_images: Array.isArray(inputs.reference_images) ? inputs.reference_images : [],
      reference_videos: Array.isArray(inputs.reference_videos) ? inputs.reference_videos : [],
      reference_audios: Array.isArray(inputs.reference_audios) ? inputs.reference_audios : [],
    }
    const limits = model.input_limits ?? {}
    validateInputCounts(
      limits,
      safeInputs,
      errors,
      isPresent(inputs, 'reference_videos'),
    )
    validateImages(limits, safeInputs.reference_images, errors, warnings)
    validateVideos(limits, safeInputs.reference_videos, errors, warnings)
  }
  validatePrompt(model.input_limits ?? {}, request.additional_prompt, errors, warnings)

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
