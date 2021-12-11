const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    nameFirst: {
      type: mongoose.Schema.Types.String
    },
    nameMiddle: {
      type: mongoose.Schema.Types.String,
      default: ''
    },
    nameLast: {
      type: mongoose.Schema.Types.String
    },
    purchased: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    country: {
      type: mongoose.Schema.Types.String,
      default: 'us'
    },
    birth: {
      type: mongoose.Schema.Types.String,
      required: false
    },
    followers: {
      type: [mongoose.Schema.Types.String],
      default: []
    },
    languages: {
      type: [mongoose.Schema.Types.String],
      default: ['en']
    },
    isRegistered: {
      type: mongoose.Schema.Types.Boolean,
      default: true
    },
    deleted: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
)

userSchema.index({ email: 'text' })

module.exports = mongoose.model('User', userSchema)
