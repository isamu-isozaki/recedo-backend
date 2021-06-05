/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Deletes wishlist
 * TODO: For now only allow when there's no receipt associated with wishlist
 */
const { removeWishlistById, findWishlistById } = require('@/app/wishlist/repository')
const { findReceiptByWishlistId } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
async function deleteWishlist (req, res) {
  const { wishlistId } = req.body

  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const receipt = await findReceiptByWishlistId(wishlistId)
  if (receipt) {
    res.unauthorized("Can't delete wishlist when there's a receipt associated with wishlist")
    return
  }
  removeWishlistById(wishlistId)
  res.success({})
}

module.exports = { deleteWishlist }
