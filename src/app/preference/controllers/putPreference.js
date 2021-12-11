const { updatePreference, findPreferenceByWishlistItemIdAndUserId } = require('@/app/preference/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
const { findReceiptItemsAffectedByPreferenece } = require('@/app/receipt/repository')
const { reconductTransactionsFromMultipleReceiptItems } = require('@/app/transaction/utils')

async function putPreference (req, res) {
  const { wishlistId, wishlistItemId, want } = req.body
  const userId = req.user._id
  const preference = await findPreferenceByWishlistItemIdAndUserId(wishlistItemId, req.user._id)
  if (!preference) {
    res.unauthorized()
    return
  }
  if (preference.userId !== req.user._id) {
    res.unauthorized()
    return
  }
  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist.wishlistItemIds.includes(wishlistItemId)) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }

  // Nullify all previous interactions within range
  async function switchPreference (timeBegin, timeEnd, userId, wishlistItemId) {
    const { receiptItems } = await findReceiptItemsAffectedByPreferenece(timeBegin, timeEnd, userId, wishlistItemId)
    console.log('reconducting transation')
    return reconductTransactionsFromMultipleReceiptItems(receiptItems, group, userId, wishlistItemId)
  }

  function validWant (i, initWant, want) {
    if (i % 2 === 0) {
      if (want === initWant) {
        return false
      }
    } else {
      if (want !== initWant) {
        return false
      }
    }
    return true
  }
  const wishlistTime = wishlist.createdAt.getTime()
  const fromTimes = preference.fromTimes.map(fromTime => fromTime.getTime())
  // It will never be the case that wishlistItem will be made before the preferencefromTImes -> Unit test
  if (wishlistTime > fromTimes[fromTimes.length - 1]) {
    // If the preference applies to a wishlist after all the previous preference modifications
    // Check if want is different from last element. If length is even, it's the same as initWant. Otherwise, flip
    if (!validWant(preference.fromTimes.length - 1, preference.initWant, want)) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlist.createdAt, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { fromTimes: [...preference.fromTimes, wishlistTime] })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime === fromTimes[0] && fromTimes.length === 1) {
    // If prefecence applies to the first item and this is the only item in the list
    if (want === preference.initWant) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlist.createdAt, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { initWant: want })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime === fromTimes[preference.fromTimes.length - 1]) {
    // If the preference applies to a wishlist that already had a preference which is the last item
    if (!validWant(preference.fromTimes.length - 1, preference.initWant, want)) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlist.createdAt, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { fromTimes: preference.fromTimes.slice(0, -1) })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime < fromTimes[0]) {
    // If preference is set before the first preference
    res.badRequest('Impossible to have an older preference. Are you a hacker?')
    return
  } else {
    for (let i = 1; i < fromTimes.length - 1; i++) {
      if (wishlistTime === fromTimes[i]) {
        if (!validWant(i, preference.initWant, want)) {
          res.badRequest('Want same as current preference')
          return
        }
        // Delete ith and next fromTimes
        const newFromTimes = preference.fromTimes
        newFromTimes.splice(i, 2)
        const validRequest = await switchPreference(wishlist.createdAt, preference.fromTimes[i + 1], userId, wishlistItemId)
        if (validRequest) {
          await updatePreference(preference, { fromTImes: newFromTimes })
        } else {
          res.badRequest("At least one item didn't have someone paying for it")
        }
      } else if (wishlistTime < fromTimes[i]) {
        // If different, remove preference.fromTimes[i] and replace with wishlistTime
        if (!validWant(i - 1, preference.initWant, want)) {
          res.badRequest('Want same as current preference')
          return
        }
        const newFromTimes = preference.fromTimes
        newFromTimes.splice(i, 1, wishlist.createdAt)
        const validRequest = await switchPreference(wishlist.createdAt, preference.fromTimes[i], userId, wishlistItemId)

        if (validRequest) {
          await updatePreference(preference, { fromTImes: newFromTimes })
        } else {
          res.badRequest("At least one item didn't have someone paying for it")
        }
      }
    }
  }

  res.success({ preference })
}

module.exports = { putPreference }
