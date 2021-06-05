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
async function inviteMembers (req, res) {
  const { groupId, invitedUserIds } = req.body
  const group = await findGroupById(groupId)
  if (invitedUserIds.length === 0) {
    res.success({ group })
    return
  }
  if (!group.userIds.includes(req.user._id)) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  // If already invited or is a member, bad request
  for (const invitedUserId in invitedUserIds) {
    if (group.userIds.includes(invitedUserId)) {
      res.badRequest(`user with id ${invitedUserId} is already a member.`)
      return
    }
    if (group.invitedUserIds.includes(invitedUserId)) {
      res.badRequest(`user with id ${invitedUserId} is already invited.`)
      return
    }
  }
  await updateGroup(group, { invitedUserIds: [...group.invitedUserId, ...invitedUserIds] })
  res.success({ group })
}

module.exports = { inviteMembers }
