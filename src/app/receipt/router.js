/**
 * Author: Isamu Isozaki
 */
const express = require('express')
const router = express.Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
  * Get
  */
const { getReceipt } = require('./controllers/getReceipt')
router.get('/', getReceipt)

const { getReceipts } = require('./controllers/getReceipts')
router.get('/me', getReceipts)

const { searchProductNames } = require('./controllers/searchProductNames')
router.get('/searchProductNames', searchProductNames)
/**
  * Put
  */
const { updateReceiptPayer } = require('./controllers/updateReceiptPayer')
router.put('/payer', updateReceiptPayer)

const { updateReceiptTax } = require('./controllers/updateReceiptTax')
router.put('/tax', updateReceiptTax)

const { updateReceiptTotalCost } = require('./controllers/updateReceiptTotalCost')
router.put('/totalCost', updateReceiptTotalCost)

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

const { postReceiptImg } = require('./controllers/postReceiptImg')
router.post('/img', postReceiptImg)

const { postReceiptItem } = require('./controllers/postReceiptItem')
router.post('/item', postReceiptItem)
// const { postReceipts } = require('./controllers/postReceipts')
// router.post('/me', postReceipts)

module.exports = router
