/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get all receipts associated to user in every group
 */
const { findReceiptsByGroupIds } = require('@/app/receipt/repository')
const { findGroupsByUserId } = require('@/app/group/repository')
const { findReceiptItems } = require('@/app/item/receipt/repository')
const _keyBy = require('lodash/keyBy')

async function getReceipts (req, res) {
  // TODO: Limit number of receipts. From certain point don't load the receiptItems
  const groups = await findGroupsByUserId(req.user._id)
  const rawReceipts = await findReceiptsByGroupIds(groups.map(group => group._id))
  const receipts = await Promise.all(
    rawReceipts.map(
      async rawReceipt => {
        const newReceiptItem = { ...rawReceipt.toObject(), receiptItems: await findReceiptItems(rawReceipt.receiptItems) }
        return newReceiptItem
      }
    )
  )

  //  Get receipt Items
  res.success({ receipts: _keyBy(receipts, '_id') })
}

module.exports = { getReceipts }
