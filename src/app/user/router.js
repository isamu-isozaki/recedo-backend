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

const { getUsersByEmail } = require('./controllers/getUsersByEmail')
router.get('/email', getUsersByEmail)

const { getUsersByIds } = require('./controllers/getUsersByIds')
router.get('/ids', getUsersByIds)

/**
 * Put
 */
const { putCurrentUser } = require('./controllers/putCurrentUser')
router.put('/me', putCurrentUser)

module.exports = router
