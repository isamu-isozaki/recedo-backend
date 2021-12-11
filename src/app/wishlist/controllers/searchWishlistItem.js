/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const { queryWishlistItems } = require('@/app/item/wishlist/repository')
const _keyBy = require('lodash/keyBy')

async function searchWishlistItem (req, res) {
  const { name } = req.query
  const wishlistItems = await queryWishlistItems(name)
  res.success({ wishlistItems: _keyBy(wishlistItems, '_id') })
}

module.exports = { searchWishlistItem }
