const Joi = require('joi')
const { EXPENSE_CATEGORIES, SUPPORTED_CURRENCIES } = require('../constants/finance')

const stripPlainTextMarkup = (value, helpers) => {
  if (typeof value !== 'string') {
    return value
  }

  const sanitizedValue = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (sanitizedValue.length === 0 && value.trim().length > 0 && helpers?.state?.path?.length) {
    return ''
  }

  return sanitizedValue
}

const safeString = () => Joi.string().custom(stripPlainTextMarkup, 'plain-text sanitization')
const objectId = Joi.string().length(24).hex()

const authSchemas = {
  signup: {
    body: Joi.object({
      name: safeString().min(2).max(50).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
      }),
      email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
      password: Joi.string().min(8).max(128).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
      }),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
      password: Joi.string().min(8).max(128).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
      }),
    }),
  },
}

const groupSchemas = {
  createGroup: {
    body: Joi.object({
      name: safeString().min(2).max(60).required().messages({
        'string.empty': 'Group name is required',
        'string.min': 'Group name must be at least 2 characters',
      }),
      description: safeString().max(220).allow('').default(''),
      currency: Joi.string()
        .trim()
        .uppercase()
        .valid(...SUPPORTED_CURRENCIES)
        .default('INR')
        .messages({
          'any.only': 'Please select a supported currency',
        }),
      memberEmails: Joi.array()
        .items(Joi.string().trim().lowercase().email())
        .max(20)
        .default([]),
    }),
  },
  addMember: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Member email is required',
        'string.email': 'Please provide a valid email',
      }),
    }),
  },
  groupParams: {
    params: Joi.object({
      groupId: objectId.required().messages({
        'string.length': 'A valid group is required',
      }),
    }),
  },
  groupMemberParams: {
    params: Joi.object({
      groupId: objectId.required().messages({
        'string.length': 'A valid group is required',
      }),
      memberId: objectId.required().messages({
        'string.length': 'A valid group member is required',
      }),
    }),
  },
  createSettlement: {
    body: Joi.object({
      paidByUserId: objectId.required().messages({
        'string.length': 'A valid settling member is required',
      }),
      receivedByUserId: objectId.required().messages({
        'string.length': 'A valid receiving member is required',
      }),
      amount: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Settlement amount must be a valid number',
        'number.positive': 'Settlement amount must be greater than zero',
      }),
      note: safeString().max(240).allow('').default(''),
    }),
  },
}

const expenseSchemas = {
  createExpense: {
    body: Joi.object({
      title: safeString().min(2).max(80).required().messages({
        'string.empty': 'Expense title is required',
        'string.min': 'Expense title must be at least 2 characters',
      }),
      description: safeString().max(240).allow('').default(''),
      amount: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Amount must be a valid number',
        'number.positive': 'Amount must be greater than zero',
      }),
      category: Joi.string()
        .trim()
        .valid(...EXPENSE_CATEGORIES)
        .default('other')
        .messages({
          'any.only': 'Please select a valid expense category',
        }),
      paidByUserId: objectId.required().messages({
        'string.length': 'A valid payer is required',
      }),
      participantUserIds: Joi.array().items(objectId).min(1).required().messages({
        'array.min': 'Select at least one participant',
      }),
      splitType: Joi.string().valid('equal', 'custom').required(),
      splits: Joi.array()
        .items(
          Joi.object({
            userId: objectId.required(),
            share: Joi.number().min(0).precision(2).required(),
          }),
        )
        .default([]),
    }),
  },
}

const authLegacyErrors = {
  registerSchema: authSchemas.signup.body,
  loginSchema: authSchemas.login.body,
}

const legacyValidators = {
  validateRegister: (data) => authLegacyErrors.registerSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
  validateLogin: (data) => authLegacyErrors.loginSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
  validateCreateGroup: (data) => groupSchemas.createGroup.body.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
  validateAddMember: (data) => groupSchemas.addMember.body.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
  validateCreateExpense: (data) => expenseSchemas.createExpense.body.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
  validateCreateSettlement: (data) => groupSchemas.createSettlement.body.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }),
}

module.exports = {
  authSchemas,
  expenseSchemas,
  groupSchemas,
  ...legacyValidators,
}
