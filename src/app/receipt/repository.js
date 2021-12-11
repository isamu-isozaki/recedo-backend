const Receipt = require('./model')
const { keyBy } = require('lodash')
const { removeReceiptItemByReceipt, findReceiptItems } = require('@/app/item/receipt/repository')
const { findWishlistsByTimeRangeAndGroupIds, findWishlistsByTimeBeginAndGroupIds } = require('@/app/wishlist/repository')
const { findGroupsByUserId } = require('@/app/group/repository')
const { cancelTaxTransaction, conductTransaction } = require('@/app/transaction/utils')
function createReceipt (data) {
  return Receipt.create(data)
}

function updateReceipt (receipt, updates) {
  Object.assign(receipt, updates)
  return receipt.save()
}

function updateReceiptById (receiptId, updates) {
  return Receipt.updateOne({ _id: receiptId }, updates)
}

function findAllReceipts () {
  return Receipt.find({})
}

function findReceiptById (receiptId, { fields } = {}) {
  return receiptId && Receipt.findOne({ _id: receiptId }).select(fields)
}

function findReceiptByReceiptItemId (receiptItemId, { fields } = {}) {
  return receiptItemId && Receipt.findOne({ receiptItems: receiptItemId }).select(fields)
}

function findReceiptByWishlistId (wishlistId, { fields } = {}) {
  return wishlistId && Receipt.findOne({ wishlistId }).select(fields)
}

function findReceiptsByWishlistIds (wishlistIds, { fields } = {}) {
  return wishlistIds && Receipt.find({ wishlistId: { $in: wishlistIds } }).select(fields)
}

function findReceipts ({ ids, fields }) {
  const query = { _id: { $in: ids } }
  return Receipt.find(query).select(fields)
}

function findReceiptsByGroupIds (groupIds, { fields } = {}) {
  return Receipt.find({ groupId: { $in: groupIds } }).select(fields)
}

async function findReceiptItemsAffectedByPreferenece (timeBegin, timeEnd, userId, wishlistItemId) {
  // Get all groups of user
  // Get all wishlists in range timeBegin to timeEnd and in group
  // Get receipts associated with each wishlist
  // Get all receiptItems
  const groups = await findGroupsByUserId(userId)
  const groupIds = groups.map(group => group._id)
  const outputGroups = keyBy('groupId', groups)
  let wishlists = null
  if (timeEnd === null) {
    wishlists = await findWishlistsByTimeBeginAndGroupIds(timeBegin, groupIds)
  } else {
    wishlists = await findWishlistsByTimeRangeAndGroupIds(timeBegin, timeEnd, groupIds)
  }
  if (!wishlists || wishlists.length === 0) {
    return []
  }
  const wishlistIds = wishlists.map(wishlist => wishlist._id)
  const receipts = await findReceiptsByWishlistIds(wishlistIds)
  let output = []
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i]
    let receiptOutput = []
    const receiptItems = await findReceiptItems(receipts[i].receiptItems)
    let allSet = true
    for (let j = 0; j < receiptItems.length && allSet; j++) {
      const receiptItem = receiptItems[j]
      allSet = receiptItem.wishlistItemSet
    }
    if (!allSet) {
      continue
    }
    for (let j = 0; j < receiptItems.length; j++) {
      const receiptItem = receiptItems[j]
      if (receiptItem.wishlistItemId === wishlistItemId) {
        receiptOutput = [...receiptOutput, receiptItem]
      }
    }
    output = [...output, { wishlist: keyBy(wishlists, '_id')[receipt.wishlistId], group: outputGroups[receipt.groupId], receiptId: receipt._id, payerId: receipt.payerId, receiptItems: receiptOutput }]
  }
  return { receiptItems: keyBy(output, 'receiptId') }
}

async function removeReceipt (receipt, wishlist, group) {
  // Remove receiptItems too
  await removeReceiptItemByReceipt(receipt)
  // Cancel tax transaction
  await cancelTaxTransaction(group, receipt, wishlist)
  // Cancel all transactions within the receipt
  const receiptItems = await findReceiptItems(receipt.receiptItems)

  await conductTransaction(receiptItems, group, receipt.wishlistId, receipt, true)
  return Receipt.deleteOne({ _id: receipt._id })
}

module.exports = {
  createReceipt,
  updateReceipt,
  updateReceiptById,
  findAllReceipts,
  findReceiptById,
  findReceiptByReceiptItemId,
  findReceiptByWishlistId,
  findReceiptsByWishlistIds,
  findReceiptsByGroupIds,
  findReceipts,
  findReceiptItemsAffectedByPreferenece,
  removeReceipt
}
