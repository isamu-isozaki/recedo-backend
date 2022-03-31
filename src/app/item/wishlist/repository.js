const WishlistItem = require('./model')
const { findWishlistById } = require('@/app/wishlist/repository')

async function createWishlistItem ({ name }) {
  const wishlistItem = await findWishlistItemByName(name)
  if (!wishlistItem) {
    return await WishlistItem.create({ name })
  }
  return wishlistItem
}

function updateWishlistItem (wishlistItem, updates) {
  Object.assign(wishlistItem, updates)
  return wishlistItem.save()
}

function updateWishlistItemById (wishlistItemId, updates) {
  return WishlistItem.updateOne({ _id: wishlistItemId }, updates)
}

function findAllWishlistItems () {
  return WishlistItem.find({})
}

function findWishlistItemById (wishlistItemId, { fields } = {}) {
  return WishlistItem.findOne({ _id: wishlistItemId }).select(fields)
}

function findWishlistItemByName (name, { fields } = {}) {
  return WishlistItem.findOne({ name }).select(fields)
}

async function findWishlistItemsByWishlistId (wishlistId, { fields } = {}) {
  const wishlist = await findWishlistById(wishlistId)
  return findWishlistItems(wishlist.WishlistItems)
}

function findWishlistItems (ids, { fields } = {}) {
  return WishlistItem.find({ _id: { $in: ids } }).select(fields)
}

async function removeWishlistItemById (wishlistItemId) {
  return WishlistItem.deleteOne({ _id: wishlistItemId })
}

function queryWishlistItems (name) {
  return WishlistItem.find({ $text: { $search: name } }).limit(20)
}

module.exports = {
  createWishlistItem,
  updateWishlistItem,
  updateWishlistItemById,
  findAllWishlistItems,
  findWishlistItemByName,
  findWishlistItemsByWishlistId,
  findWishlistItemById,
  findWishlistItems,
  removeWishlistItemById,
  queryWishlistItems
}
