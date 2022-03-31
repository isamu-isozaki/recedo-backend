const ReceiptItem = require('./model')
const { createProductName, findProductNameByName } = require('@/app/item/productName/repository')

async function createReceiptItem (data) {
  const name = data.name
  let product = await findProductNameByName(name)
  if (!product) {
    product = await createProductName({ name })
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

function findReceiptItemByName (name, { fields } = {}) {
  return ReceiptItem.find({ name }).select(fields)
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

function findReceiptItemsByIdsAndWishlistItemId (ids, wishlistItemId, fields = {}) {
  const query = { _id: { $in: ids }, wishlistItemId }
  return ReceiptItem.find(query).select(fields)
}

function findReceiptItems (ids, { fields } = {}) {
  const query = { _id: { $in: ids } }
  return ReceiptItem.find(query).select(fields)
}

function removeReceiptItemById (receiptItemId) {
  return ReceiptItem.deleteOne({ _id: receiptItemId })
}

function removeReceiptItemByReceipt (receipt) {
  return ReceiptItem.deleteMany({ _id: { $in: receipt.receiptItems } })
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
  findReceiptItems,
  findReceiptItemByName,
  removeReceiptItemById,
  removeReceiptItemByReceipt
}
