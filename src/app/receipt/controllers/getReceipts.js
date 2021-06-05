/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get all receipts associated to user in every group
 */
const { findReceiptItems } = require('@/app/item/receipt/repository')
const { findReceiptsByGroupIds } = require('@/app/receipt/repository')
const { findGroupsByUserId } = require('@/app/group/repository')
async function getReceipts (req, res) {
  // TODO: Limit number of receipts. From certain point don't load the receiptItems
  const groups = await findGroupsByUserId(req.user._id)
  const rawReceipts = await findReceiptsByGroupIds(groups.map(group => group._id))
  const receipts = await Promise.all(
    rawReceipts.map(
      async rawReceipt => {
        return { ...rawReceipt, receiptItems: await findReceiptItems(rawReceipt.receiptItems) }
      }
    )
  )

  //  Get receipt Items
  res.success({ receipts })
}

module.exports = { getReceipts }
