const { updatePreference, findPreferenceByWishlistItemIdAndUserId } = require('@/app/preference/repository')
const { findReceiptById } = require('@/app/receipt/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { findGroupById } = require('@/app/group/repository')
const { findReceiptItemsAffectedByPreferenece } = require('@/app/item/receipt/repository')
const { reconductTransactionsFromMultipleReceiptItems } = require('@/app/transaction/utils')

async function putPreference (req, res) {
  const { receiptId, wishlistItemId, want } = req.body
  const userId = req.user._id
  const preference = await findPreferenceByWishlistItemIdAndUserId(wishlistItemId, req.user._id)
  if (!(req.user._id in preference)) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  // If userId is not invited in the first place, bad request
  // Get receipt
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }

  // Nullify all previous interactions within range
  async function switchPreference (timeBegin, timeEnd, userId, wishlistItemId) {
    const { receiptItems } = await findReceiptItemsAffectedByPreferenece(timeBegin, timeEnd, userId, wishlistItemId)
    return reconductTransactionsFromMultipleReceiptItems(receiptItems, userId, wishlistItemId)
  }

  function validWant (i, initWant, want) {
    if ((i + 1) % 2 === 0) {
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
  const wishlist = await findWishlistById(receipt.wishlistId)
  const wishlistTime = wishlist.createdAt

  // It will never be the case that wishlistItem will be made before the preferencefromTImes -> Unit test
  if (wishlistTime > preference.fromTimes[preference.fromTimes.length - 1]) {
    // If the preference applies to a wishlist after all the previous preference modifications
    // Check if want is different from last element. If length is even, it's the same as initWant. Otherwise, flip
    if (!validWant(preference.fromTimes.length - 1, preference.initWant, want)) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlistTime, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { fromTimes: [...preference.fromTimes, wishlistTime] })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime === preference.fromTimes[0] && preference.fromTimes.length === 1) {
    // If prefecence applies to the first item and this is the only item in the list
    if (want === preference.initWant) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlistTime, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { initWant: want })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime === preference.fromTimes[preference.fromTimes.length - 1]) {
    // If the preference applies to a wishlist that already had a preference which is the last item
    if (!validWant(preference.fromTimes.length - 1, preference.initWant, want)) {
      res.badRequest('Want same as current preference')
      return
    }
    const validRequest = await switchPreference(wishlistTime, null, userId, wishlistItemId)
    if (validRequest) {
      await updatePreference(preference, { fromTimes: preference.fromTimes.slice(0, -1) })
    } else {
      res.badRequest("At least one item didn't have someone paying for it")
    }
  } else if (wishlistTime < preference.fromTimes[0]) {
    // If preference is set before the first preference
    res.badRequest('Impossible to have an older preference. Are you a hacker?')
    return
  } else {
    for (let i = 1; i < preference.fromTimes - 1; i++) {
      if (wishlistTime === preference.fromTimes[i]) {
        if (!validWant(i, preference.initWant, want)) {
          res.badRequest('Want same as current preference')
          return
        }
        // Delete ith and next fromTimes
        const newFromTimes = preference.fromTimes
        newFromTimes.splice(i, 2)
        const validRequest = await switchPreference(wishlistTime, preference.fromTimes[i + 1], userId, wishlistItemId)
        if (validRequest) {
          await updatePreference(preference, { fromTImes: newFromTimes })
        } else {
          res.badRequest("At least one item didn't have someone paying for it")
        }
      } else if (wishlistTime < preference.fromTimes[i]) {
        // If different, remove preference.fromTimes[i] and replace with wishlistTime
        if (!validWant(i - 1, preference.initWant, want)) {
          res.badRequest('Want same as current preference')
          return
        }
        const newFromTimes = preference.fromTimes
        newFromTimes.splice(i, 1, wishlistTime)
        const validRequest = await switchPreference(wishlistTime, preference.fromTimes[i], userId, wishlistItemId)

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
