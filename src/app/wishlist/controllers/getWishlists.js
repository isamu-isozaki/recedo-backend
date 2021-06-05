// Get wishlist, wishlistItems
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
const { findWishlistItems } = require('@/app/item/wishlist/repository')

const { findGroupsByUserId } = require('@/app/group/repository')
async function getWishlists (req, res) {
  const groups = await findGroupsByUserId(req.user._id)
  const rawWishlists = await findWishlistsByGroupIds(groups.map(group => group._id))
  const wishlists = await Promise.all(
    rawWishlists.map(
      async rawWishlist => {
        return { ...rawWishlist, wishlistItems: await findWishlistItems(rawWishlist.wishlistItems) }
      }
    )
  )

  //  Get receipt Items
  res.success({ wishlists })
}

module.exports = { getWishlists }
