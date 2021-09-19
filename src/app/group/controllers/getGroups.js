/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * All users can find groups people are in
 * Respond group req.user is in
 */
const { findGroupsByUserId, findGroupByInviteId } = require('@/app/group/repository')
// const { findUsers } = require('@/app/group/repository')
const _keyBy = require('lodash/keyBy')

async function getGroups (req, res) {
  const groups = await findGroupsByUserId(req.user._id)
  const inviteGroups = await findGroupByInviteId(req.user._id)
  res.success({ groups: _keyBy(groups, '_id'), invitedGroups: _keyBy(inviteGroups, '_id') })
}

module.exports = { getGroups }
