/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const { createWishlist } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
const sanitize = require('mongo-sanitize')

async function postWishlist (req, res) {
  sanitize(req.body)
  const { name, groupId } = req.body
  const group = await findGroupById(groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }

  // If userId is not invited in the first place, bad request
  const wishlist = await createWishlist({ name, groupId })
  res.success({ wishlist })
}

module.exports = { postWishlist }
