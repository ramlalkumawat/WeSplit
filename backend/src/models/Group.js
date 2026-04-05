const mongoose = require('mongoose')
const { SUPPORTED_CURRENCIES } = require('../constants/finance')

const groupMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
)

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [60, 'Group name cannot exceed 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [220, 'Description cannot exceed 220 characters'],
      default: '',
    },
    currency: {
      type: String,
      default: 'INR',
      enum: SUPPORTED_CURRENCIES,
      uppercase: true,
      maxlength: 3,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [groupMemberSchema],
      validate: {
        validator: (members) => members.length > 0,
        message: 'A group must include at least one member',
      },
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

groupSchema.index({ 'members.user': 1 })
groupSchema.index({ createdBy: 1 })

module.exports = mongoose.model('Group', groupSchema)
