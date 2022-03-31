/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const { createWishlistItem, findWishlistItemByName } = require('@/app/item/wishlist/repository')
const { findWishlistById, updateWishlist } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
const {setPreferencesForWishlistItem} = require('@/app/wishlist/utils')
const sanitize = require('mongo-sanitize')

async function postWishlistItem (req, res) {
  sanitize(req.body)
  let { wishlistId, name } = req.body
  if (!name || name === '') {
    res.badRequest()
    return
  }
  name = name.toLowerCase()
  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist) {
    res.notFound()
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const wishlistItem = await createWishlistItem({ name })
  const userPreference = await setPreferencesForWishlistItem(group, wishlist, wishlistItem, req)
  const wishlistItemIds = wishlist.wishlistItemIds
  if (wishlistItemIds.includes(wishlistItem._id)) {
    res.success({ wishlistItem })
    return
  }
  await updateWishlist(wishlist, { wishlistItemIds: [...wishlistItemIds, wishlistItem._id] })

  res.success({ wishlistItem, preference: userPreference })
}

module.exports = { postWishlistItem }
