/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with created group
 */
const { updateGroup, findGroupById } = require('@/app/group/repository')
const sanitize = require('mongo-sanitize')

async function cancelInvite (req, res) {
  sanitize(req.body)
  const { groupId, userId } = req.body
  const group = await findGroupById(groupId)
  if (!group.userIds.includes(req.user._id) && !group.invitedUserIds.includes(userId)) {
    // If user is not part of the group and isn't invited
    res.unauthorized()
    return
  }
  // If userId is not invited in the first place, bad request
  if (!group.invitedUserIds.includes(userId)) {
    res.badRequest(`user with id ${userId} is not invited.`)
    return
  }
  await updateGroup(group, { invitedUserIds: group.invitedUserIds.filter(invitedUserId => invitedUserId !== userId) })
  res.success({ group })
}

module.exports = { cancelInvite }
