/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: Get payer, receipt items and preferences for each receipt item by user
Created:  2022-05-16T17:16:15.344Z
Modified: !date!
Modified By: modifier
*/

const { findReceiptItems } = require('@/app/item/receipt/repository')
const { findReceiptById } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const { findUsers, findUserById } = require('@/app/user/repository')
const { findPreferencesByWishlistItemIdsAndUserIds } = require('@/app/preference/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { computeWant } = require('@/app/transaction/utils')
const _keyBy = require('lodash/keyBy')
const sanitize = require('mongo-sanitize')

async function getJson (req, res) {
  sanitize(req.query)
  const { receiptId } = req.query
  // TODO: Delete receipt image in firebase
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  if (!receipt.finishedTransaction) {
    res.unauthorized("Receipt hasn't been processed yet.")
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const users = await findUsers(group.userIds)
  const payerId = receipt.payerId
  const payer = await findUserById(payerId)
  const receiptItems = await findReceiptItems(receipt.receiptItems)
  const wishlist = await findWishlistById(receipt.wishlistId)
  const wishlistItemIds = receiptItems.map(item => item.wishlistItemId)
  const relevantPreferences = await findPreferencesByWishlistItemIdsAndUserIds(wishlistItemIds, group.userIds)
  const preferences = {}
  wishlistItemIds.forEach(wishlistItemId => {
    preferences[wishlistItemId] = []
  })
  relevantPreferences.forEach(preference => {
    preferences[preference.wishlistItemId] = [...preferences[preference.wishlistItemId], preference]
  })
  const userPreferences = {}
  users.forEach(user => {
    userPreferences[user._id] = []
  })
  receiptItems.forEach(receiptItem => {
    const preferencesForWishlistItem = preferences[receiptItem.wishlistItemId]
    group.userIds.forEach(userId => {
      const preferences = preferencesForWishlistItem.find(preference => preference.userId === userId)
      userPreferences[userId] = [...userPreferences[userId], computeWant(preferences, wishlist.createdAt.getTime())]
    })
  })
  //  Get receipt Items
  res.success({ payer: payer, userPreferences, receiptItems, receipt, wishlist, users })
}

module.exports = { getJson }
