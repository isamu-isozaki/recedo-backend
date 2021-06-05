/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
 * Get
 */
const { getCurrentUser } = require('./controllers/getCurrentUser')
router.get('/me', getCurrentUser)

/**
 * Put
 */
const { putCurrentUser } = require('./controllers/putCurrentUser')
router.put('/me', putCurrentUser)

module.exports = router
