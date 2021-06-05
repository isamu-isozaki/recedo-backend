/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
   * Get
   */
const { getTransactions } = require('./controllers/getTransactions')
router.get('/', getTransactions)

/**
  * Post
  */

const { pay } = require('./controllers/pay')
router.post('/', pay)

module.exports = router
