/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: // Get wishlist, wishlistItemIds
/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Get receipt
 */
const { findWishlistItems } = require('@/app/item/wishlist/repository')
const sanitize = require('mongo-sanitize')

const _keyBy = require('lodash/keyBy')
async function getWishlistItems (req, res) {
  sanitize(req.query)
  const { wishlistItemIds } = req.query

  const wishlistItems = await findWishlistItems(wishlistItemIds)
  res.success({ wishlistItems: _keyBy(wishlistItems, '_id') })
}

module.exports = { getWishlistItems }
