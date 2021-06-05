// TODO: For now only allow when there's no receiptItem associated with wishlistItem
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
const { removeWishlistItemById, findWishlistItemById } = require('@/app/item/wishlist/repository')
const { findWishlistById } = require('@/app/wishlist/repository')

const { findReceiptItemByWishlistItemId } = require('@/app/item/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
async function deleteWishlistItem (req, res) {
  const { wishlistId, wishlistItemId } = req.body

  const wishlistItem = await findWishlistItemById(wishlistItemId)
  if (!wishlistItem) {
    res.unauthorized()
    return
  }
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
  const receiptItem = await findReceiptItemByWishlistItemId(wishlistItemId)
  if (receiptItem) {
    res.unauthorized("Can't delete wishlist item when there's a receipt item associated with wishlist")
    return
  }
  removeWishlistItemById(wishlistItemId)
  res.success({})
}

module.exports = { deleteWishlistItem }
