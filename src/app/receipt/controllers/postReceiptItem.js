/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Sends receipt items to receipt
 */

const { findReceiptById, updateReceipt, removeReceiptItemById } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const { findWishlistById, updateWishlist } = require('@/app/wishlist/repository')
const { createReceiptItem, findReceiptItems, findReceiptItemByName, updateReceiptItem } = require('@/app/item/receipt/repository')
const { findWishlistItems, createWishlistItem } = require('@/app/item/wishlist/repository')
const _keyBy = require('lodash/keyBy')
const sanitize = require('mongo-sanitize')
const { setPreferencesForWishlistItem } = require('@/app/wishlist/utils')

async function postReceiptItem (req, res) {
  // TODO: Get prev wishlist item and if in wishlist automatically assign that. Otherwise, create a new wishlist item with that namce
  sanitize(req.body)
  let { receiptId, receiptItem } = req.body
  // Assume receipt Items is an array of dictionaries with structure {name, price, quantity}
  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.notFound()
    return
  }
  if (receipt.finishedTransaction) {
    res.unauthorized('Transaction has already been done')
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }

  receiptItem.name = receiptItem.name.toLowerCase()
  let receiptItemIds = []

  try {
    // If there's duplicate receiptItems within current receipt items return res.badRequest
    const currReceiptItems = await findReceiptItems(receipt.receiptItems)
    for (let i = 0; i < currReceiptItems.length; i++) {
      if (currReceiptItems[i].name === receiptItem.name) {
        res.badRequest('Receipt item already in receipt.')
        return
      }
    }
    const wishlist = await findWishlistById(receipt.wishlistId)
    const wishlistItems = await findWishlistItems(wishlist.wishlistItemIds)

    const wishlistItemNames = wishlistItems.map(item => item.name)

    // TODO: Only allow machine read items in receipt items
    receiptItem = await createReceiptItem(receiptItem)
    receiptItemIds = [receiptItem._id]
    receiptItemIds = [...receipt.receiptItems, ...receiptItemIds]
    const pastReceiptItems = await findReceiptItemByName(receiptItem.name)
    if (pastReceiptItems.length > 0) {
      // Get previous wishlistItems
      const prevWishlistItemIds = []
      for (let i = 0; i < pastReceiptItems.length; i++) {
        if (pastReceiptItems[i].wishlistItemSet) {
          prevWishlistItemIds.push(pastReceiptItems[i].wishlistItemId)
        }
      }
      if (prevWishlistItemIds.length === 0) {
        await updateReceipt(receipt, { receiptItems: receiptItemIds })
        res.success({ receipt: { ...receipt.toObject(), receiptItems: _keyBy(await findReceiptItems(receiptItemIds), '_id') } })
        return
      }
      const prevWishlistItems = await findWishlistItems(prevWishlistItemIds)
      const prevWishlistItemNames = prevWishlistItems.map(item => item.name)
      const name = prevWishlistItemNames[prevWishlistItemNames.length - 1]
      const wishlistItemIdx = wishlistItemNames.indexOf(name)
      // Creates wishlist item if not defined
      let wishlistItem
      if (wishlistItemIdx === -1) {
        // Add wishlist item to wishlist
        wishlistItem = await createWishlistItem({ name })
        await updateWishlist(wishlist, { wishlistItemIds: [...wishlist.wishlistItemIds, wishlistItem._id] })
      } else {
        wishlistItem = wishlistItems[wishlistItemIdx]
      }
      setPreferencesForWishlistItem(group, wishlist, wishlistItem, req)
      await updateReceiptItem(receiptItem, { wishlistItemId: wishlistItem._id, wishlistItemSet: true })
    }
    await updateReceipt(receipt, { receiptItems: receiptItemIds })
  } catch (error) {
    // console.log({error})
    res.badRequest(error)
    return
  }

  res.success({ receipt: { ...receipt.toObject(), receiptItems: _keyBy(await findReceiptItems(receiptItemIds), '_id') } })
}

module.exports = { postReceiptItem }
