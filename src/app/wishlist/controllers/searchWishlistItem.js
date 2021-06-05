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
async function searchWishlistItem (req, res) {
  const { name } = req.body
  const wishlistItems = await queryWishlistItems(name)
  res.success({ wishlistItems })
}

module.exports = { searchWishlistItem }
