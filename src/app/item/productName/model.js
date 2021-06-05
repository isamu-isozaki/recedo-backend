const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productNameSchema = new Schema(
  {
    name: {
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
productNameSchema.index({ name: 'text' })
module.exports = mongoose.model('ProductName', productNameSchema)
