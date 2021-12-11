/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Pay a user
 */
const { findUserById } = require('@/app/user/repository')
const { createTransaction } = require('@/app/transaction/repository')

async function pay (req, res) {
  const { toId, amount, message } = req.body
  const to = await findUserById(toId)
  if (!to) {
    res.unauthorized()
    return
  }
  if (to._id === req.user._id) {
    res.badRequest("Can't pay yourself")
    return
  }
  if (amount <= 0) {
    res.badRequest("Can't pay 0 dollars or less than that")
    return
  }
  const transaction = await createTransaction({ fromId: req.user._id, toId, amount, message })
  res.success({ transaction })
}

module.exports = { pay }
