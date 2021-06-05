const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Eventually put receiptId here.
const receiptItemSchema = new Schema(
  {
    wishlistItemId: {
      type: mongoose.Schema.Types.String,
      default: ''
    },
    wishlistItemSet: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    productNameId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    quantity: {
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
receiptItemSchema.index({ name: 'text' })

module.exports = mongoose.model('ReceiptItem', receiptItemSchema)
