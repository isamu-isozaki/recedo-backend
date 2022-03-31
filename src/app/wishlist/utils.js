/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: description
Created:  2022-03-14T00:01:06.778Z
Modified: !date!
Modified By: modifier
*/
const { createPreference, updatePreference, findPreferenceByWishlistItemIdAndUserId } = require('@/app/preference/repository')

async function setPreferencesForWishlistItem (group, wishlist, wishlistItem, req) {
  let userPreference
  for (let i = 0; i < group.userIds.length; i++) {
    let preference = await findPreferenceByWishlistItemIdAndUserId(wishlistItem._id, group.userIds[i])
    if (!preference) {
      preference = await createPreference({ userId: group.userIds[i], wishlistItemId: wishlistItem._id, fromTimes: [wishlist.createdAt] })
    } else if (wishlist.createdAt < preference.fromTimes[0]) {
      preference = await updatePreference(preference, { fromTimes: [wishlist.createdAt, ...preference.fromTimes.slice(1)] })
    }
    if (group.userIds[i] === req.user._id) {
      userPreference = preference
    }
  }
  return userPreference
}

module.exports = { setPreferencesForWishlistItem }
