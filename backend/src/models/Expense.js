const mongoose = require('mongoose')

const expenseParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    share: {
      type: Number,
      required: true,
      min: [0, 'Share cannot be negative'],
    },
  },
  {
    _id: false,
  },
)

const expenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      maxlength: [80, 'Expense title cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [240, 'Expense description cannot exceed 240 characters'],
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Expense amount must be greater than zero'],
    },
    splitType: {
      type: String,
      enum: ['equal', 'custom'],
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: {
      type: [expenseParticipantSchema],
      validate: {
        validator: (participants) => participants.length > 0,
        message: 'Expense must include participants',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

expenseSchema.index({ group: 1, createdAt: -1 })
expenseSchema.index({ paidBy: 1 })

module.exports = mongoose.model('Expense', expenseSchema)
