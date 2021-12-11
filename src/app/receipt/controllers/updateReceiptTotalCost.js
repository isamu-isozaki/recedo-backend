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
const { findReceiptById, updateReceipt } = require('@/app/receipt/repository')
const { findWishlistById } = require('@/app/wishlist/repository')

async function updateReceiptTotalCost (req, res) {
  const { receiptId, totalCost } = req.body
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

  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  await updateReceipt(receipt, { totalCost })
  res.success({ receipt: { ...receipt.toObject(), totalCost } })
}

module.exports = { updateReceiptTotalCost }
