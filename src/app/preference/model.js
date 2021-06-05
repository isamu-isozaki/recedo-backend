const mongoose = require('mongoose')
const Schema = mongoose.Schema

const preferenceSchema = new Schema(
  {
    wishlistItemId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    fromTimes: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    initWant: {
      type: mongoose.Schema.Types.Boolean,
      default: true
    },
    freq: {
      type: mongoose.Schema.Types.String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
)

module.exports = mongoose.model('Preference', preferenceSchema)
