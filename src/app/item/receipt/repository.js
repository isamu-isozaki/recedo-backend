const ReceiptItem = require('./model')
const { keyBy } = require('lodash')
const { createProductName, findProductNameByName } = require('@/app/item/productName/repository')
const { findWishlistsByTimeRangeAndGroupIds, findWishlistsByTimeBeginAndGroupIds } = require('@/app/wishlist/repository')
const { findReceiptsByWishlistIds } = require('@/app/receipt/repository')
const { findGroupsByUserId } = require('@/app/group/repository')

async function createReceiptItem (data) {
  const name = data.name
  let product = await findProductNameByName(name)
  if (!product) {
    product = await createProductName(name)
  }
  return ReceiptItem.create({ ...data, productNameId: product._id })
}

function updateReceiptItem (receiptItem, updates) {
  Object.assign(receiptItem, updates)
  return receiptItem.save()
}

function updateReceiptItemById (receiptItemId, updates) {
  return ReceiptItem.updateOne({ _id: receiptItemId }, updates)
}

function findAllReceiptItems () {
  return ReceiptItem.find({})
}

function findReceiptItemById (receiptItemId, { fields } = {}) {
  return ReceiptItem.findOne({ _id: receiptItemId }).select(fields)
}

function findReceiptItemByIds (receiptItemIds, { fields } = {}) {
  return ReceiptItem.find({ _id: { $in: receiptItemIds } }).select(fields)
}

function findReceiptItemByWishlistItemId (wishlistItemId, { fields } = {}) {
  return ReceiptItem.findOne({ wishlistItemId }).select(fields)
}

// function findReceiptItemByPriceRange (low, high, { fields } = {}) {
//   return ReceiptItem.find({ authorId: receiptItem }).select(fields)
// }

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
    let allSet = true
    for (let j = 0; j < receipt.receiptItems.length && allSet; j++) {
      allSet = receipt.receiptItems[j].wishlistItemSet
    }
    if (!allSet) {
      continue
    }
    for (let j = 0; j < receipt.receiptItems.length; j++) {
      const receiptItem = receipt.receiptItems[j]
      if (receiptItem.wishlistItemId === wishlistItemId) {
        receiptOutput = [...receiptOutput, receiptItem]
      }
    }
    output = [...output, { group: outputGroups[receipt.groupId], receiptId: receipt._id, payerId: receipt.payerId, receiptItems: receiptOutput }]
  }
  return { receiptItems: keyBy('receiptId', output) }
}

function findReceiptItemsByIdsAndWishlistItemId ({ ids, wishlistItemId, fields }) {
  const query = { _id: { $in: ids }, wishlistItemId }
  return ReceiptItem.find(query).select(fields)
}

function findReceiptItems ({ ids, fields }) {
  const query = { _id: { $in: ids } }
  return ReceiptItem.find(query).select(fields)
}

async function removeReceiptItemById (receiptItemId) {
  return ReceiptItem.deleteOne({ _id: receiptItemId })
}

module.exports = {
  createReceiptItem,
  updateReceiptItem,
  updateReceiptItemById,
  findAllReceiptItems,
  findReceiptItemById,
  findReceiptItemByIds,
  findReceiptItemByWishlistItemId,
  findReceiptItemsByIdsAndWishlistItemId,
  findReceiptItemsAffectedByPreferenece,
  findReceiptItems,
  removeReceiptItemById
}
