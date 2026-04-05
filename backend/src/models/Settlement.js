const mongoose = require('mongoose')

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Settlement amount must be greater than zero'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [240, 'Settlement note cannot exceed 240 characters'],
      default: '',
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

settlementSchema.index({ group: 1, createdAt: -1 })
settlementSchema.index({ paidBy: 1 })
settlementSchema.index({ receivedBy: 1 })

module.exports = mongoose.model('Settlement', settlementSchema)
