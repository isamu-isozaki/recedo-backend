/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get receipt
 */
const { findReceiptItems } = require('@/app/item/receipt/repository')
const { findReceiptById } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
async function getReceipt (req, res) {
  const { receiptId } = req.query
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  //  Get receipt Items
  res.success({ receipt: { ...receipt, receiptItems: await findReceiptItems(receipt.receiptItems) } })
}

module.exports = { getReceipt }
