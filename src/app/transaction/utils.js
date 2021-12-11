const { createTransaction } = require('@/app/transaction/repository')
const { findPreferencesByWishlistItemIdsAndUserIds, findAllPreferences } = require('@/app/preference/repository')
const { findWishlistItemById } = require('@/app/item/wishlist/repository')
const { findUserById } = require('@/app/user/repository')
const { findWishlistById } = require('@/app/wishlist/repository')

// TODO: Limit the number of transactions to 100 by combining the oldest ones.
async function conductTransaction (receiptItems, group, wishlistId, receipt, cancel = false) {
  // Conduct transaction only when it hasn't been done before. ONLY ONCE
  let allSet = true
  let totalCost = 0
  for (let i = 0; i < receiptItems.length && allSet; i++) {
    allSet = receiptItems[i].wishlistItemSet
    totalCost += receiptItems[i].price * receiptItems[i].quantity
  }
  // check if receipt's total cost== sum of receipt items
  if (allSet && receiptItems.length > 0 && totalCost === receipt.totalCost) {
    // Make it so receipt's items can't be updated anymore
    if (!receipt.finishedTransaction) {
      receipt.finishedTransaction = true
      await receipt.save()
    } else {
      return false
    }
    // Get wishlist and from that preferences.
    const wishlist = await findWishlistById(wishlistId)
    const wishlistItemIds = wishlist.wishlistItemIds
    const relevantPreferences = await findPreferencesByWishlistItemIdsAndUserIds(wishlistItemIds, group.userIds)
    const preferences = {}
    wishlistItemIds.forEach(wishlistItemId => {
      preferences[wishlistItemId] = []
    })
    relevantPreferences.forEach(preference => {
      preferences[preference.wishlistItemId] = [...preferences[preference.wishlistItemId], preference]
    })
    const amountPerUser = {}
    group.userIds.forEach(userId => {
      amountPerUser[userId] = 0
    })
    receiptItems.forEach(item => {
      const wishlistItemId = item.wishlistItemId
      //   assert(wishlistItemId)
      const itemPreferences = preferences[wishlistItemId]
      // For each user,
      let itemUsers = []
      itemPreferences.forEach(itemPreference => {
        const userId = itemPreference.userId
        const want = computeWant(itemPreference, wishlist.createdAt.getTime())
        if (want) {
          itemUsers = [...itemUsers, userId]
        }
      })
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
        if (!cancel) {
          await createTransaction({ fromId: receipt.payerId, toId: userId, amount: amountPerUser[userId], message: `Transaction for wishlist: ${wishlist.name}` })
        } else {
          await createTransaction({ fromId: receipt.payerId, toId: userId, amount: -amountPerUser[userId], message: `Canceling transaction for wishlist: ${wishlist.name}` })
        }
      }
    }
  }
  return true
}

async function reconductTransactionsFromMultipleReceiptItems (receiptItems, group, userId, wishlistItemId) {
  let output = true
  for (const receiptId in receiptItems) {
    output = output && await reconductTransactionsFromReceiptItems(receiptItems[receiptId], group, userId, wishlistItemId)
  }
  return output
}
async function reconductTransactionsFromReceiptItems (receiptItems, group, userId, wishlistItemId) {
  const wishlist = receiptItems.wishlist
  let allSet = true
  for (let i = 0; i < receiptItems.length && allSet; i++) {
    allSet = receiptItems[i].wishlistItemSet
  }
  const amountPerUser = {}
  group.userIds.forEach(userId => {
    amountPerUser[userId] = 0
  })
  const relevantPreferences = await findPreferencesByWishlistItemIdsAndUserIds([wishlistItemId], group.userIds)
  const preferences = {}
  group.userIds.forEach(userId => {
    preferences[userId] = []
  })
  relevantPreferences.forEach(preference => {
    preferences[preference.userId] = preference
  })
  let itemUsers = []
  for (const key in preferences) {
    if (await computeWant(preferences[key], wishlist.createdAt.getTime())) {
      itemUsers = [...itemUsers, key]
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
  if (!allSet) {
    return true
  }
  // Will be in form userId:
  receiptItems.receiptItems.forEach(item => {
    const pricePerUser = item.price * item.quantity / numUsers
    for (let i = 0; i < numUsers; i++) {
      amountPerUser[itemUsers[i]] -= pricePerUser
    }

    const newPricePerUser = item.price * item.quantity / newNumUsers
    for (let i = 0; i < numUsers; i++) {
      if (itemUsers[i] === userId) {
        continue
      }
      amountPerUser[itemUsers[i]] += newPricePerUser
    }
    if (!includesUser) {
      amountPerUser[userId] += newPricePerUser
    }
  })
  // Payer ignore own cost but conduct transaction on everyone else
  const user = await findUserById(userId)
  const wishlistItem = await findWishlistItemById(wishlistItemId)
  const payerId = receiptItems.payerId

  for (const key in amountPerUser) {
    if (key !== payerId) {
      await createTransaction({
        fromId: payerId,
        toId: key,
        amount: amountPerUser[key],
        message: `Updating prices after ${user.nameFirst} ${user.nameLast}'s changes on item: ${wishlistItem.name} to ${includesUser ? "Don't want" : 'Want'}`
      })
    }
  }
  return true
}
function computeWant (preference, time) {
  const initWant = preference.initWant
  const fromTimes = preference.fromTimes.map(fromTime => fromTime.getTime())
  let fromIdx = -1
  for (const idx in fromTimes) {
    const fromTime = fromTimes[idx]
    if (fromTime <= time) {
      fromIdx += 1
    }
  }
  if (fromIdx === -1) {
    return initWant
  }
  const noChange = (fromIdx % 2) === 0
  const currentWant = noChange ? initWant : !initWant
  return currentWant
}

async function conductTaxTransaction (group, receipt, wishlist) {
  const groupSize = group.userIds.length
  const taxPayAmount = receipt.tax / groupSize
  for (let i = 0; i < groupSize; i++) {
    const userId = group.userIds[i]
    if (userId !== receipt.payerId) {
      await createTransaction({ fromId: receipt.payerId, groupId: group._id, toId: userId, amount: taxPayAmount, message: `Tax from ${wishlist.name}` })
    }
  }
}

async function cancelTaxTransaction (group, receipt, wishlist) {
  const groupSize = group.userIds.length
  const taxPayAmount = receipt.tax / groupSize
  for (let i = 0; i < groupSize; i++) {
    const userId = group.userIds[i]
    if (userId !== receipt.payerId) {
      await createTransaction({ fromId: receipt.payerId, groupId: group._id, toId: userId, amount: -taxPayAmount, message: `Cancel tax from ${wishlist.name}` })
    }
  }
}
async function updateReceiptAndTaxTransaction (group, receipt, wishlist, updates) {
  const groupSize = group.userIds.length
  const taxPayAmount = receipt.tax / groupSize
  for (let i = 0; i < groupSize; i++) {
    const userId = group.userIds[i]
    if (userId !== receipt.payerId) {
      await createTransaction({ fromId: receipt.payerId, groupId: group._id, toId: userId, amount: -taxPayAmount, message: `Negating tax from ${wishlist.name}` })
    }
  }
  conductTaxTransaction(group, { ...receipt.toObject(), ...updates }, wishlist)
}
module.exports = { conductTransaction, reconductTransactionsFromMultipleReceiptItems, cancelTaxTransaction, conductTaxTransaction, updateReceiptAndTaxTransaction }
