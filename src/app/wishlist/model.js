const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlistSchema = new Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    wishlistItems: {
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

module.exports = mongoose.model('Wishlist', wishlistSchema)
