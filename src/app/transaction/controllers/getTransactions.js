// Get Balance and who you owe/who owes you
const { findTransactionsByFromId, findTransactionsByToId } = require('@/app/transaction/repository')
const _keyBy = require('lodash/keyBy')

async function getTransactions (req, res) {
  const userId = req.user._id
  const fromTransactions = await findTransactionsByFromId(userId)
  const toTransactions = await findTransactionsByToId(userId)
  res.success({ fromTransactions: _keyBy(fromTransactions, '_id'), toTransactions: _keyBy(toTransactions, '_id') })
}
module.exports = { getTransactions }
