const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const AUTH_INITIAL_VALUES = {
  login: {
    email: '',
    password: '',
  },
  signup: {
    name: '',
    email: '',
    password: '',
  },
}

const passwordError = (password) => {
  if (!password.trim()) {
    return 'Password is required.'
  }

  if (password.trim().length < 8) {
    return 'Password must be at least 8 characters.'
  }

  return ''
}

export const validateLoginValues = ({ email, password }) => {
  const errors = {}
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  const passwordValidationError = passwordError(password)

  if (passwordValidationError) {
    errors.password = passwordValidationError
  }

  return errors
}

export const validateSignupValues = ({ name, email, password }) => {
  const errors = validateLoginValues({ email, password })
  const normalizedName = name.trim()

  if (!normalizedName) {
    errors.name = 'Full name is required.'
  } else if (normalizedName.length < 2) {
    errors.name = 'Full name must be at least 2 characters.'
  } else if (normalizedName.length > 50) {
    errors.name = 'Full name cannot exceed 50 characters.'
  }

  return errors
}

export const normalizeAuthValues = (mode, values) => ({
  ...(mode === 'signup' ? { name: values.name.trim() } : {}),
  email: values.email.trim().toLowerCase(),
  password: values.password,
})

export const mapAuthServerError = (error) => {
  const fieldErrors = {}
  const detailMessages = []

  for (const message of error.fieldMessages || []) {
    const normalizedMessage = message.toLowerCase()

    if (normalizedMessage.includes('name') && !fieldErrors.name) {
      fieldErrors.name = message
      continue
    }

    if (normalizedMessage.includes('email') && !fieldErrors.email) {
      fieldErrors.email = message
      continue
    }

    if (normalizedMessage.includes('password') && !fieldErrors.password) {
      fieldErrors.password = message
      continue
    }

    detailMessages.push(message)
  }

  return {
    detailMessages,
    fieldErrors,
    formError: error.message || 'Something went wrong. Please try again.',
  }
}
