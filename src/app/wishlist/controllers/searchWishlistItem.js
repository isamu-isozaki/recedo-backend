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
const sanitize = require('mongo-sanitize')

async function searchWishlistItem (req, res) {
  sanitize(req.query)
  const { name } = req.query
  const wishlistItems = await queryWishlistItems(name)
  res.success({ wishlistItems: _keyBy(wishlistItems, '_id') })
}

module.exports = { searchWishlistItem }
