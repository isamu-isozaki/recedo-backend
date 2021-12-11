/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
const { authenticateUser } = require('@/middlewares/auth')

router.use(authenticateUser)

/**
  * Get
  */
const { getGroups } = require('./controllers/getGroups')
router.get('/', getGroups)

/**
  * Put
  */

const { inviteMembers } = require('./controllers/inviteMembers')
router.put('/invite', inviteMembers)

const { cancelInvite } = require('./controllers/cancelInvite')
router.put('/cancelInvite', cancelInvite)

const { acceptInvite } = require('./controllers/acceptInvite')
router.put('/acceptInvite', acceptInvite)

const { kickMember } = require('./controllers/kickMember')
router.put('/kick', kickMember)

const { leaveGroup } = require('./controllers/leaveGroup')
router.put('/leave', leaveGroup)

/**
  * Post
  */
const { postGroup } = require('./controllers/postGroup')
router.post('/', postGroup)

module.exports = router
