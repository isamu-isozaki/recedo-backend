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
const sanitize = require('mongo-sanitize')

async function deleteReceipt (req, res) {
  sanitize(req.query)

  const { receiptId } = req.query
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.unauthorized()
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
  removeReceiptById(receiptId)
  res.success({})
}

module.exports = { deleteReceipt }
