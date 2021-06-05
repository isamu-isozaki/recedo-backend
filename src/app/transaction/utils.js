const { createTransaction } = require('@/app/transaction/repository')
const { findPreferencesByWishlistItemIdAndUserIds } = require('@/app/preference/repository')
const { findWishlistItemsByWishlistId } = require('@/app/item/wishlist/repository')
const _ = require('lodash')
// TODO: Limit the number of transactions to 100 by combining the oldest ones.
async function conductTransaction (receiptItems, group, wishlistId, receipt) {
  let allSet = true
  for (let i = 0; i < receiptItems.length && allSet; i++) {
    allSet = receiptItems[i].wishlistItemSet
  }

  if (allSet) {
    // Get wishlist and from that preferences.
    const wishlistItems = await findWishlistItemsByWishlistId(wishlistId)
    const wishlistItemIds = wishlistItems.map(wishlistItem => wishlistItem._id)
    const preferences = _.keyBy('wishlistItemId', await findPreferencesByWishlistItemIdAndUserIds(wishlistItemIds, group.userIds))
    const amountPerUser = {}
    group.userIds.forEach(userId => {
      amountPerUser[userId] = 0
    })

    receiptItems.forEach(item => {
      const wishlistItemId = item.wishlistItemId
      //   assert(wishlistItemId)
      const itemPreferences = preferences[wishlistItemId]
      const itemUsers = []
      for (let i = 0; i < itemPreferences.length; i++) {
        const userId = itemPreferences.userId
        const want = itemPreferences.want
        if (want) {
          itemUsers.append(userId)
        }
      }
      const numUsers = itemUsers.length
      if (numUsers === 0) {
        return false
      }
      const pricePerUser = item.price * item.quantity / numUsers
      for (let i = 0; i < numUsers; i++) {
        amountPerUser[itemUsers[i]] += pricePerUser
      }
    })
    for (let i = 0; i < group.userIds.length; i++) {
      const userId = group.userIds[i]
      if (userId !== receipt.payerId) {
        await createTransaction({ fromId: receipt.payerId, toId: userId, amount: -amountPerUser[userId] })
      }
    }
  }
  return true
}

async function reconductTransactionsFromMultipleReceiptItems (receiptItems, userId, wishlistItemId) {
  for (const receiptId in receiptItems) {
    await reconductTransactionsFromReceiptItems(receiptItems[receiptId], userId, wishlistItemId)
  }
}
async function reconductTransactionsFromReceiptItems (receiptItems, userId, wishlistItemId) {
  const group = receiptItems.group
  const payerId = receiptItems.payerId
  let allSet = true
  for (let i = 0; i < receiptItems.length && allSet; i++) {
    allSet = receiptItems[i].wishlistItemSet
  }
  if (!allSet) {
    return true
  }
  const amountPerUser = {}
  group.userIds.forEach(userId => {
    amountPerUser[userId] = 0
  })
  const preferences = _.keyBy('userId', await findPreferencesByWishlistItemIdAndUserIds(wishlistItemId, group.userIds))
  const itemUsers = []
  for (const key in preferences) {
    if (preferences[key].want) {
      itemUsers.push(key)
    }
  }
  const includesUser = itemUsers.includes(userId)
  const numUsers = itemUsers.length
  if (numUsers === 0) {
    console.log(`Item: ${wishlistItemId} has 0 users who want it.`)
    return false
  }
  let newNumUsers = numUsers
  if (includesUser) {
    newNumUsers -= 1
  } else {
    newNumUsers += 1
  }
  if (newNumUsers === 0) {
    console.log(`Item: ${wishlistItemId} has 0 users who want it.`)
    return false
  }
  // Will be in form userId:
  receiptItems.forEach(item => {
    const pricePerUser = item.price * item.quantity / numUsers
    for (let i = 0; i < numUsers; i++) {
      amountPerUser[itemUsers[i]] += pricePerUser
    }

    const newPricePerUser = item.price * item.quantity / newNumUsers
    for (let i = 0; i < numUsers; i++) {
      if (itemUsers[i] === userId) {
        continue
      }
      amountPerUser[itemUsers[i]] -= newPricePerUser
    }
    if (!includesUser) {
      amountPerUser[userId] -= newPricePerUser
    }
  })
  // Payer ignore own cost but conduct transaction on everyone else
  for (const key in amountPerUser) {
    if (key !== payerId) {
      await createTransaction({ fromId: payerId, toId: key, amount: amountPerUser[key] })
    }
  }
  return true
}

module.exports = { conductTransaction, reconductTransactionsFromMultipleReceiptItems }
