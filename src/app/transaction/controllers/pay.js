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
  const { toId, amount } = req.body
  const to = await findUserById(toId)
  if (!to) {
    res.unauthorized()
    return
  }
  const transaction = await createTransaction({ fromId: req.user._id, toId, amount })
  res.success({ transaction })
}

module.exports = { pay }
