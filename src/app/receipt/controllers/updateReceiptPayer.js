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
const { findReceiptById } = require('@/app/receipt/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { updateReceiptAndTaxTransaction } = require('@/app/transaction/utils')
const { updateReceipt } = require('@/app/receipt/repository')

async function updateReceiptPayer (req, res) {
  const { receiptId, payerId } = req.body
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  const wishlist = await findWishlistById(receipt.wishlistId)
  if (!wishlist) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }

  if (!group || !group.userIds.includes(payerId) || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  if (receipt.payerId === payerId) {
    res.badRequest()
    return
  }
  await updateReceiptAndTaxTransaction(group, receipt, wishlist, { payerId })
  await updateReceipt(receipt, { payerId })
  res.success({ receipt: { ...receipt.toObject(), payerId } })
}

module.exports = { updateReceiptPayer }
