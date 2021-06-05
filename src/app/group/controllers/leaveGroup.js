// If all members left the group, delete group
/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with created group
 */
const { updateGroup, findGroupById, removeGroupById } = require('@/app/group/repository')
async function leaveGroup (req, res) {
  const { groupId } = req.body
  const group = await findGroupById(groupId)
  if (!group.userIds.includes(req.user._id)) {
    // If user is not part of the group
    res.unauthorized()
    return
  }
  const newUserIds = group.userIds.filter(groupUser => groupUser !== req.user._id)
  if (newUserIds.length === 0) {
    await removeGroupById(group._id)
    res.success({})
    return
  }

  await updateGroup(group, { userIds: newUserIds })
  res.success({ group })
}

module.exports = { leaveGroup }
