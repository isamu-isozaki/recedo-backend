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

async function updateItemName (req, res) {
  const { wishlistId, wishlistItemId, newName } = req.body
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
  if (!wishlist.wishlistItems.includes(wishlistItemId)) {
    res.unauthorized()
    return
  }
  let wishlistItem = await findWishlistItemByName(newName)
  if (!wishlistItem) {
    wishlistItem = await createWishlistItem({ name: newName })
  }
  const wishlistItems = wishlist.wishlistItems
  if (wishlistItems.includes(wishlistItem._id)) {
    res.success({ wishlistItem })
    return
  }
  updateWishlist(wishlistItem, { wishlistItems: [...wishlistItems.filter(item => item !== wishlistItemId), wishlistItem._id] })
  res.success({ wishlistItem })
}

module.exports = { updateItemName }
