/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with created group
 */
const { createGroup } = require('@/app/group/repository')
async function postGroup (req, res) {
  const { invitedUserIds } = req.body
  const group = await createGroup({ userIds: [req.user], invitedUserIds })
  res.success({ group })
}

module.exports = { postGroup }
