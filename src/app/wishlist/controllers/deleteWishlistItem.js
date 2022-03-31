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
const { findWishlistById, updateWishlist } = require('@/app/wishlist/repository')
const { findReceiptByWishlistId } = require('@/app/receipt/repository')


const { findReceiptItemsByIdsAndWishlistItemId, findReceiptItemByWishlistItemId } = require('@/app/item/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const sanitize = require('mongo-sanitize')

async function deleteWishlistItem (req, res) {
  sanitize(req.query)
  const { wishlistId, wishlistItemId } = req.query
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
  if (!wishlist.wishlistItemIds.includes(wishlistItemId)) {
    res.unauthorized('Wishlist item not included in wishlist')
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const receipt = await findReceiptByWishlistId(wishlist._id)
  if (receipt) {
    if (receipt.finishedTransaction) {
      res.unauthorized('Transaction has already been done')
      return
    }
    const receiptItems = await findReceiptItemsByIdsAndWishlistItemId(receipt.receiptItems, wishlistItemId)
    let receiptItemLinkedToWishlist = false
    receiptItems.forEach(receiptItem => {
      if (receiptItem.wishlistItemId === wishlistItemId) {
        receiptItemLinkedToWishlist = true
      }
    })
    if (receiptItemLinkedToWishlist) {
      res.unauthorized("Can't delete wishlist item when there's a receipt item associated with wishlist")
      return
    }
  }
  const wishlistItemIds = wishlist.wishlistItemIds.filter(wishlistItem => wishlistItem !== wishlistItemId)
  updateWishlist(wishlist, { wishlistItemIds })
  res.success({ wishlist })
}

module.exports = { deleteWishlistItem }
