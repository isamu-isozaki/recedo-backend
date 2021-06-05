/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()

/**
 * Group
 */
const groupRouter = require('./group/router')
router.use('/group', groupRouter)
/**
 * Preference
 */
const preferenceRouter = require('./preference/router')
router.use('/preference', preferenceRouter)
/**
 * Receipt
 */
const receiptRouter = require('./receipt/router')
router.use('/receipt', receiptRouter)
/**
 * Transaction
 */
const transactionRouter = require('./transaction/router')
router.use('/transaction', transactionRouter)
/**
 * User
 */
const userRouter = require('./user/router')
router.use('/user', userRouter)
/**
 * Wishlist
 */
const wishlistRouter = require('./wishlist/router')
router.use('/wishlist', wishlistRouter)

module.exports = router
