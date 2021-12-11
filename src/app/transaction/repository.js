const Transaction = require('./model')

function createTransaction (data) {
  return Transaction.create(data)
}

function updateTransaction (transaction, updates) {
  Object.assign(transaction, updates)
  return transaction.save()
}

function updateTransactionById (transactionId, updates) {
  return Transaction.updateOne({ _id: transactionId }, updates)
}

function findAllTransactions () {
  return Transaction.find({})
}

function findTransactionById (transactionId, { fields } = {}) {
  return transactionId && Transaction.findOne({ _id: transactionId }).select(fields)
}

function findTransactionsByFromId (fromId, { fields } = {}) {
  return Transaction.find({ fromId }).select(fields)
}

function findTransactionsByToId (toId, { fields } = {}) {
  return Transaction.find({ toId }).select(fields)
}

function findTransactions ({ ids, fields }) {
  const query = { _id: { $in: ids } }
  return Transaction.find(query).select(fields)
}

async function removeTransactionById (transactionId) {
  return Transaction.deleteOne({ _id: transactionId })
}

module.exports = {
  createTransaction,
  updateTransaction,
  updateTransactionById,
  findAllTransactions,
  findTransactionById,
  findTransactionsByFromId,
  findTransactionsByToId,
  findTransactions,
  removeTransactionById
}
