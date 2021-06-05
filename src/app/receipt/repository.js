const Receipt = require('./model')
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

function findReceiptsByGroupIds ({ groupIds, fields }) {
  return Receipt.find({ groupId: { $in: groupIds } }).select(fields)
}

async function removeReceiptById (receiptId) {
  return Receipt.deleteOne({ _id: receiptId })
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
  removeReceiptById
}
