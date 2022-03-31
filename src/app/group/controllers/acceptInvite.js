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
async function acceptInvite (req, res) {
  sanitize(req.body)
  const { groupId } = req.body
  const group = await findGroupById(groupId)
  const userId = req.user._id
  if (!group.invitedUserIds.includes(userId)) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  await updateGroup(group, { userIds: [...group.userIds, userId], invitedUserIds: group.invitedUserIds.filter(invitedUserId => invitedUserId !== userId) })
  res.success({ group })
}

module.exports = { acceptInvite }
