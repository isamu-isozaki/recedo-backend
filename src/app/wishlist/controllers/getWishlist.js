/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get receipt
 */
const { findWishlistItems } = require('@/app/item/wishlist/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
async function getWishlist (req, res) {
  const { wishlistId } = req.body
  // TODO: Delete receipt image in firebase
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
  //  Get receipt Items
  res.success({ receipt: { ...wishlist, wishlistItems: await findWishlistItems(wishlist.wishlistItems) } })
}

module.exports = { getWishlist }