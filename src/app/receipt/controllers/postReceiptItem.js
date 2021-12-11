/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Sends receipt items to receipt
 */

const { findReceiptById, updateReceipt, removeReceiptItemById } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const { createReceiptItem, findReceiptItems } = require('@/app/item/receipt/repository')
const _keyBy = require('lodash/keyBy')

async function postReceiptItem (req, res) {
  let { receiptId, receiptItem } = req.body
  // Assume receipt Items is an array of dictionaries with structure {name, price, quantity}
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

  receiptItem.name = receiptItem.name.toLowerCase()
  let receiptItemIds = []

  try {
    // If there's duplicate receiptItems within current receipt items return res.badRequest
    const currReceiptItems = await findReceiptItems(receipt.receiptItems)
    for (let i = 0; i < currReceiptItems.length; i++) {
      if (currReceiptItems[i].name === receiptItem.name) {
        res.badRequest('Receipt item already in receipt.')
        return
      }
    }

    // TODO: Only allow machine read items in receipt items
    receiptItem = await createReceiptItem(receiptItem)
    receiptItemIds = [receiptItem._id]
    receiptItemIds = [...receipt.receiptItems, ...receiptItemIds]
    await updateReceipt(receipt, { receiptItems: receiptItemIds })
  } catch (error) {
    res.badRequest(error)
    return
  }

  res.success({ receipt: { ...receipt.toObject(), receiptItems: _keyBy(await findReceiptItems(receiptItemIds), '_id') } })
}

module.exports = { postReceiptItem }
