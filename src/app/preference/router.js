/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
 * Get
 */
const { getPreferences } = require('./controllers/getPreferences')
router.get('/', getPreferences)

const { getUserPreferences } = require('./controllers/getUserPreferences')
router.get('/user', getUserPreferences)
/**
 * Put
 */
const { putPreference } = require('./controllers/putPreference')
router.put('/', putPreference)

module.exports = router
