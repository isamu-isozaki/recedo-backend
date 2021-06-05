/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
  * Get
  */
const { getReceipt } = require('./controllers/getReceipt')
router.get('/', getReceipt)

const { getReceipts } = require('./controllers/getReceipts')
router.get('/me', getReceipts)
/**
  * Put
  */
const { updateItemPrice } = require('./controllers/updateItemPrice')
router.put('/price', updateItemPrice)

const { updateItemQuantity } = require('./controllers/updateItemQuantity')
router.put('/quantity', updateItemQuantity)

const { setWishlistItem } = require('./controllers/setWishlistItem')
router.put('/setWishlistItem', setWishlistItem)
/**
  * Delete
  */
const { deleteReceipt } = require('./controllers/deleteReceipt')
router.delete('/', deleteReceipt)

const { deleteReceiptItem } = require('./controllers/deleteReceiptItem')
router.delete('/item', deleteReceiptItem)

/**
 * Post
 */

const { postReceipt } = require('./controllers/postReceipt')
router.post('/', postReceipt)

// const { postReceipts } = require('./controllers/postReceipts')
// router.post('/me', postReceipts)

module.exports = router
