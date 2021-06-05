// Get Balance and who you owe/who owes you
const { findTransactionsByFromId, findTransactionsByToId } = require('@/app/transaction/repository')

async function getTransactions (req, res) {
  const userId = req.user._id
  const fromTransactions = await findTransactionsByFromId(userId)
  const toTransactions = await findTransactionsByToId(userId)
  res.success({ fromTransactions, toTransactions })
}
module.exports = { getTransactions }
