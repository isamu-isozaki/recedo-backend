// Get wishlist, wishlistItemIds
/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get receipt
 */
const { findWishlistsByGroupIds } = require('@/app/wishlist/repository')
const _keyBy = require('lodash/keyBy')

const { findGroupsByUserId } = require('@/app/group/repository')
async function getWishlists (req, res) {
  const groups = await findGroupsByUserId(req.user._id)
  const wishlists = await findWishlistsByGroupIds(groups.map(group => group._id))

  //  Get receipt Items
  res.success({ wishlists: _keyBy(wishlists, '_id') })
}

module.exports = { getWishlists }
