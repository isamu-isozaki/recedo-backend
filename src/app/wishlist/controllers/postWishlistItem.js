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
const { createPreference, updatePreference, findPreferenceByWishlistItemIdAndUserId } = require('@/app/preference/repository')

async function postWishlistItem (req, res) {
  const { wishlistId, name } = req.body
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
  let wishlistItem = await findWishlistItemByName(name)
  if (!wishlistItem) {
    wishlistItem = await createWishlistItem({ name })
  }
  for (let i = 0; i < group.userIds.length; i++) {
    const preference = await findPreferenceByWishlistItemIdAndUserId(wishlistId, group.userIds[i])
    if (!preference) {
      await createPreference({ userId: group.userIds[i], wishlistItemId: wishlistItem._id, fromTimes: [wishlist.createdAt] })
    }
    if (wishlist.createdAt < preference.fromTimes[0]) {
      await updatePreference(preference, { fromTimes: [wishlist.createdAt, ...preference.fromTimes.slice(1)] })
    }
  }
  const wishlistItems = wishlist.wishlistItems
  if (wishlistItems.includes(wishlistItem._id)) {
    res.success({ wishlistItem })
    return
  }
  updateWishlist(wishlist, { wishlistItems: [...wishlistItems, wishlistItem._id] })
  res.success({ wishlistItem })
}

module.exports = { postWishlistItem }
