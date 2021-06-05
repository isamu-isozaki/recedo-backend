/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get receipt
 */

const { findGroupById } = require('@/app/group/repository')
const { findReceiptByReceiptItemId } = require('@/app/receipt/repository')
const { findWishlistItemById } = require('@/app/item/wishlist/repository')
const { updateReceiptItemById, findReceiptItems } = require('@/app/item/receipt/repository')
const { conductTransaction } = require('@/app/transaction/utils')

async function setWishlistItem (req, res) {
  const { receiptItemId, wishlistItemId } = req.body
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptByReceiptItemId(receiptItemId)
  if (!receipt) {
    res.notFound()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const wishlistItem = await findWishlistItemById(wishlistItemId)
  if (!wishlistItem) {
    res.notFound()
    return
  }
  const receiptItem = await updateReceiptItemById(receiptItemId, { wishlistItemId, wishlistItemSet: true })
  //  Get receipt Items. If all receiptItems are set, then proceed to make all transactions.
  const receiptItems = await findReceiptItems(receipt.receiptItems)

  const transaction = await conductTransaction(receiptItems, group, receipt.wishlistId, receipt)
  if (!transaction) {
    res.badRequest("At least one item didn't have someone paying for it")
    return
  }
  res.success({ receiptItem })
}

module.exports = { setWishlistItem }
