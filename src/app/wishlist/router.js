/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
   * Get
   */
const { getWishlist } = require('./controllers/getWishlist')
router.get('/', getWishlist)

const { getWishlists } = require('./controllers/getWishlists')
router.get('/me', getWishlists)

const { searchWishlistItem } = require('./controllers/searchWishlistItem')
router.get('/searchItem', searchWishlistItem)
/**
   * Put
   */

const { updateItemName } = require('./controllers/updateItemName')
router.put('/itemName', updateItemName)
/**
   * Delete
   */
const { deleteWishlist } = require('./controllers/deleteWishlist')
router.delete('/', deleteWishlist)

const { deleteWishlistItem } = require('./controllers/deleteWishlistItem')
router.delete('/item', deleteWishlistItem)

/**
  * Post
  */

const { postWishlist } = require('./controllers/postWishlist')
router.post('/', postWishlist)

const { postWishlistItem } = require('./controllers/postWishlistItem')
router.post('/me', postWishlistItem)

module.exports = router
