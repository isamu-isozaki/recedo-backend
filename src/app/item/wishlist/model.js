const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * When checking preferences get preference of item with name with user id for all members of the group
 * Changed reference to wishlist from here to array in wishlist link to wishlistItems
 */
const wishlistItemSchema = new Schema(
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
wishlistItemSchema.index({ name: 'text' })

module.exports = mongoose.model('WishlistItem', wishlistItemSchema)
