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

async function postReceiptItems (req, res) {
  const { receiptId, receiptItems } = req.body
  // Assume receipt Items is an array of dictionaries with structure {name, price, quantity}
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

  try {
    // If there's duplicate receiptItems within receiptItems return res.badRequest
    for (let i = 0; i < receiptItems.length; i++) {
      for (let j = 0; j < receiptItems.length; j++) {
        if (receiptItems[i].name === receiptItems[j].name) {
          res.badRequest('Multiple instances of same item in sent items.')
          return
        }
      }
    }
    // If there's duplicate receiptItems within current receipt items return res.badRequest
    const currReceiptItems = await findReceiptItems(receipt.receiptItems)
    for (let i = 0; i < currReceiptItems.length; i++) {
      for (let j = 0; j < receiptItems.length; j++) {
        if (currReceiptItems[i].name === receiptItems[j].name) {
          res.badRequest('Receipt item already in receipt.')
          return
        }
      }
    }
    const prevTotalCost = receipt.totalCost
    let additionalCost = 0
    const receiptItemIds = []
    for (let i = 0; i < receiptItems.length; i++) {
      const reqReceiptItem = receiptItems[i]
      additionalCost += reqReceiptItem.price * reqReceiptItem.quantity
      // TODO: Only allow machine read items in receipt items
      const receiptItem = await createReceiptItem(reqReceiptItem)
      receiptItemIds.push(receiptItem._id)
    }

    updateReceipt(receipt, { receiptItems: [...receipt.receiptItemIds, ...receiptItemIds], totalCost: prevTotalCost + additionalCost })
  } catch (error) {
    // Delete receipt items if it's a bad request
    for (let i = 0; i < receiptItems.length; i++) {
      await removeReceiptItemById(receiptItems[i])
    }
    res.badRequest()
    return
  }

  res.success({ receipt })
}

module.exports = { postReceiptItems }
