const mongoose = require('mongoose')
const Schema = mongoose.Schema
const transactionSchema = new Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    toId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    amount: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    message: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
)
module.exports = mongoose.model('Transaction', transactionSchema)
