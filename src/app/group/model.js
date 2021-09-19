const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    userIds: {
      type: [mongoose.Schema.Types.String],
      required: true
    },
    invitedUserIds: {
      type: [mongoose.Schema.Types.String],
      default: []
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
)
module.exports = mongoose.model('Group', groupSchema)
