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
const sanitize = require('mongo-sanitize')

async function updateItemPrice (req, res) {
  sanitize(req.body)
  const { receiptItemId, price } = req.body
  // TODO: Delete receipt image in firebase
  if (price <= 0) {
    res.badRequest(`Price is invalid. Price: ${price}`)
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
  updateReceipt(receipt, { totalCost: receipt.totalCost + (price - receiptItem.price) * receiptItem.quantity })
  await updateReceiptItem(receiptItem, { price })

  //  Get receipt Items
  res.success({ receiptItem })
}

module.exports = { updateItemPrice }
