const Wishlist = require('./model')

function createWishlist (data) {
  return Wishlist.create(data)
}

function updateWishlist (wishlist, updates) {
  Object.assign(wishlist, updates)
  return wishlist.save()
}

function updateWishlistById (wishlistId, updates) {
  return Wishlist.updateOne({ _id: wishlistId }, updates)
}

function findAllWishlists () {
  return Wishlist.find({})
}

function findWishlistById (wishlistId, { fields } = {}) {
  return Wishlist.findOne({ _id: wishlistId }).select(fields)
}

function findWishlists (ids, { fields } = {}) {
  const query = { _id: { $in: ids } }
  return Wishlist.find(query).select(fields)
}

function findWishlistsByGroupId (groupId, { fields } = {}) {
  return Wishlist.find({ groupId }).select(fields)
}

function findWishlistsByGroupIds (groupIds, { fields } = {}) {
  const query = { groupId: { $in: groupIds } }
  return Wishlist.find(query).select(fields)
}

function findWishlistsByTimeRange (timeBegin, timeEnd, { fields } = {}) {
  return Wishlist.find({ createdAt: { $gte: timeBegin, $lte: timeEnd } }).select(fields)
}

function findWishlistsByTimeBegin (timeBegin, { fields } = {}) {
  return Wishlist.find({ createdAt: { $gte: timeBegin } }).select(fields)
}

function findWishlistsByTimeRangeAndGroupIds (timeBegin, timeEnd, groupIds, { fields } = {}) {
  return Wishlist.find({ createdAt: { $gte: timeBegin, $lt: timeEnd }, groupId: { $in: groupIds } }).select(fields)
}

function findWishlistsByTimeBeginAndGroupIds (timeBegin, groupIds, { fields } = {}) {
  return Wishlist.find({ createdAt: { $gte: timeBegin }, groupId: { $in: groupIds } }).select(fields)
}

async function removeWishlistById (wishlistId) {
  return Wishlist.deleteOne({ _id: wishlistId })
}

module.exports = {
  createWishlist,
  updateWishlist,
  updateWishlistById,
  findAllWishlists,
  findWishlistById,
  findWishlists,
  findWishlistsByTimeRange,
  findWishlistsByTimeBegin,
  findWishlistsByTimeRangeAndGroupIds,
  findWishlistsByTimeBeginAndGroupIds,
  findWishlistsByGroupId,
  findWishlistsByGroupIds,
  removeWishlistById,
}
