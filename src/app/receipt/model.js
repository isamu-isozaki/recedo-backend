const mongoose = require('mongoose')
const Schema = mongoose.Schema
// The textIds hold the ids for each language
// Author ids are directly taken from story
// Tax/service fees/delivery fees will be divided among all group members for now
const receiptSchema = new Schema(
  {
    payerId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    wishlistId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    receiptUrls: {
      type: [mongoose.Schema.Types.String],
      required: true
    },
    finishedTransaction: {
      type: Boolean,
      default: false
    },
    receiptItems: {
      type: [mongoose.Schema.Types.String],
      default: []
    },
    totalCost: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    tax: {
      type: mongoose.Schema.Types.Number,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
)
module.exports = mongoose.model('Receipt', receiptSchema)
