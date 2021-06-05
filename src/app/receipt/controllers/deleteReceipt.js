/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Deletes receipt
 */
const { removeReceiptById, findReceiptById } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')

async function deleteReceipt (req, res) {
  const { receiptId } = req.body
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  removeReceiptById(receiptId)
  res.success({})
}

module.exports = { deleteReceipt }
