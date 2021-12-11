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
const { createPreference, updatePreference, findPreferenceByWishlistItemIdAndUserId, findPreferenceByUserId } = require('@/app/preference/repository')

async function postWishlistItem (req, res) {
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
  let wishlistItem = await findWishlistItemByName(name)
  if (!wishlistItem) {
    wishlistItem = await createWishlistItem({ name })
  }
  let userPreference
  console.log({userIds: group.userIds})
  for (let i = 0; i < group.userIds.length; i++) {
    let preference = await findPreferenceByWishlistItemIdAndUserId(wishlistItem._id, group.userIds[i])
    if (!preference) {
      preference = await createPreference({ userId: group.userIds[i], wishlistItemId: wishlistItem._id, fromTimes: [wishlist.createdAt] })
    } else if (wishlist.createdAt < preference.fromTimes[0]) {
      preference = await updatePreference(preference, { fromTimes: [wishlist.createdAt, ...preference.fromTimes.slice(1)] })
    }
    console.log({preference})
    if (group.userIds[i] === req.user._id) {
      userPreference = preference
    }
  }
  const wishlistItemIds = wishlist.wishlistItemIds
  if (wishlistItemIds.includes(wishlistItem._id)) {
    res.success({ wishlistItem })
    return
  }
  await updateWishlist(wishlist, { wishlistItemIds: [...wishlistItemIds, wishlistItem._id] })

  res.success({ wishlistItem, preference: userPreference })
}

module.exports = { postWishlistItem }
