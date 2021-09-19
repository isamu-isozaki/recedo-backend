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
async function kickMember (req, res) {
  const { userId, groupId } = req.body
  const group = await findGroupById(groupId)
  if (userId === req.user._id) {
    res.badRequest('can\'t kick yourself from a group')
    return
  }
  if (!group.userIds.includes(req.user._id)) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  if (!group.userIds.includes(userId)) {
    // If user is not part of the group
    res.badRequest(`user with id ${userId} is not a member of this group.`)
    return
  }

  await updateGroup(group, { userIds: group.userIds.filter(groupUser => groupUser !== userId) })
  res.success({ group })
}

module.exports = { kickMember }
