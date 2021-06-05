/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const firebase = require('@/services/firebase')
const { createReceipt } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { createTransaction } = require('@/app/transaction/repository')

async function postReceipt (req, res) {
  const { payerId, wishlistId, receiptImg, tax } = req.body
  if (payerId !== req.user._id) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(payerId)) {
    res.unauthorized()
    return
  }
  const storageRef = firebase.storage().ref()
  const fileName = require('crypto').randomBytes(48, function (_err, buffer) {
    return buffer.toString('hex')
  })
  // Create a reference to 'mountains.jpg'
  const imgRef = storageRef.child(`imgs/${fileName}.jpg`)
  // Assume receiptImg is a blob
  imgRef.put(receiptImg)
  // If userId is not invited in the first place, bad request
  const receipt = await createReceipt({ payerId, wishlistId, receiptUrl: `imgs/${fileName}.jpg`, tax: tax })
  const groupSize = group.userIds.length
  const taxPayAmount = tax / groupSize
  for (let i = 0; i < groupSize; i++) {
    const userId = group.userIds[i]
    if (userId !== payerId) {
      await createTransaction({ fromId: payerId, groupId: group._id, toId: userId, amount: -taxPayAmount })
    }
  }
  res.success({ receipt })
}

module.exports = { postReceipt }
