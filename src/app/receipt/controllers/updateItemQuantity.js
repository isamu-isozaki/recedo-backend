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
const { findReceiptByReceiptItemId, updateReceipt } = require('@/app/receipt/repository')
const { updateReceiptItem, findReceiptItemById } = require('@/app/item/receipt/repository')

async function updateItemQuantity (req, res) {
  const { receiptItemId, quantity } = req.body
  // TODO: Delete receipt image in firebase
  if (Math.floor(quantity) !== quantity || quantity <= 0) {
    res.badRequest(`Quantity is invalid. Quantity: ${quantity}`)
    return
  }
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
  const receiptItem = await findReceiptItemById(receiptItemId)
  updateReceipt(receipt, { totalCost: receipt.totalCost + (quantity - receiptItem.quantity) * receiptItem.price })
  await updateReceiptItem(receiptItem, { quantity })

  //  Get receipt Items
  res.success({ receiptItem })
}

module.exports = { updateItemQuantity }
