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
const { findReceiptByWishlistId, removeReceipt } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const sanitize = require('mongo-sanitize')

async function deleteWishlist (req, res) {
  sanitize(req.query)
  const { wishlistId } = req.query

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
    if (receipt.finishedTransaction) {
      res.unauthorized('Transaction has already been done')
      return
    }
    removeReceipt(receipt, wishlist, group)
  }
  removeWishlistById(wishlistId)
  res.success({})
}

module.exports = { deleteWishlist }
