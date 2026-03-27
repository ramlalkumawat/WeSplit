const Joi = require('joi')

const objectId = Joi.string().length(24).hex()

const validate = (schema, data) =>
  schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
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
})

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
  }),
})

const createGroupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages({
    'string.empty': 'Group name is required',
    'string.min': 'Group name must be at least 2 characters',
  }),
  description: Joi.string().trim().max(220).allow('').default(''),
  memberEmails: Joi.array()
    .items(Joi.string().trim().lowercase().email())
    .max(20)
    .default([]),
})

const addMemberSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Member email is required',
    'string.email': 'Please provide a valid email',
  }),
})

const createExpenseSchema = Joi.object({
  title: Joi.string().trim().min(2).max(80).required().messages({
    'string.empty': 'Expense title is required',
    'string.min': 'Expense title must be at least 2 characters',
  }),
  description: Joi.string().trim().max(240).allow('').default(''),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a valid number',
    'number.positive': 'Amount must be greater than zero',
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
})

const validateRegister = (data) => validate(registerSchema, data)
const validateLogin = (data) => validate(loginSchema, data)
const validateCreateGroup = (data) => validate(createGroupSchema, data)
const validateAddMember = (data) => validate(addMemberSchema, data)
const validateCreateExpense = (data) => validate(createExpenseSchema, data)

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateGroup,
  validateAddMember,
  validateCreateExpense,
}
