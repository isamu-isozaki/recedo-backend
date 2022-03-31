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
const _keyBy = require('lodash/keyBy')
const sanitize = require('mongo-sanitize')

async function getReceipt (req, res) {
  sanitize(req.query)
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
  res.success({ receipt: { ...receipt.toObject(), receiptItems: _keyBy(await findReceiptItems(receipt.receiptItems), '_id') } })
}

module.exports = { getReceipt }
