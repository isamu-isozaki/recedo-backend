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
const sanitize = require('mongo-sanitize')

async function postGroup (req, res) {
  sanitize(req.body)
  const { name, invitedUserIds } = req.body
  // TODO: restrict group names to unique
  const group = await createGroup({ name: name, userIds: [req.user._id], invitedUserIds })
  res.success({ group })
}

module.exports = { postGroup }
