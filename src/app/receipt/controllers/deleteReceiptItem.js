/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Deletes receipt item
 */
const { removeReceiptItemById, findReceiptItemById } = require('@/app/item/receipt/repository')
const { findReceiptById, updateReceipt } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
async function deleteReceiptItem (req, res) {
  const { receiptId, receiptItemId } = req.query
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  if (receipt.finishedTransaction) {
    res.unauthorized('Transaction has already been done')
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  if (!receipt.receiptItems.includes(receiptItemId)) {
    res.badRequest()
    return
  }
  updateReceipt(receipt, { receiptItems: receipt.receiptItems.filter(receiptItem => receiptItem !== receiptItemId) })
  await removeReceiptItemById(receiptItemId)
  res.success({})
}

module.exports = { deleteReceiptItem }
