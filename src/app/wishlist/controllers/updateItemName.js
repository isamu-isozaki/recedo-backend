/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const { createWishlistItem, findWishlistItemByName } = require('@/app/item/wishlist/repository')
const { findWishlistById, updateWishlist } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
const sanitize = require('mongo-sanitize')

async function updateItemName (req, res) {
  sanitize(req.body)
  let { wishlistId, wishlistItemId, newName } = req.body
  newName = newName.lower()
  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist) {
    res.notFound()
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  if (!wishlist.wishlistItemIds.includes(wishlistItemId)) {
    res.unauthorized()
    return
  }
  let wishlistItem = await findWishlistItemByName(newName)
  if (!wishlistItem) {
    wishlistItem = await createWishlistItem({ name: newName })
  }
  const wishlistItemIds = wishlist.wishlistItemIds
  if (wishlistItemIds.includes(wishlistItem._id)) {
    res.success({ wishlistItem })
    return
  }
  updateWishlist(wishlistItem, { wishlistItemIds: [...wishlistItemIds.filter(item => item !== wishlistItemId), wishlistItem._id] })
  res.success({ wishlistItem })
}

module.exports = { updateItemName }
