/**
 * Author: Isamu Isozaki
 */
// Update current preference
// Default preference is want
// When a wishlistItem is created, make preference of want by default. If the user had a preference from before, use that instead
// Once preference is updated, update transaction too.

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Responds with preferences for user
 */
const { keyBy } = require('lodash')
const { findPreferenceByUserId, findAllPreferences } = require('@/app/preference/repository')
const { findGroupById } = require('@/app/group/repository')

async function getUserPreferences (req, res) {
  const { groupId, userId } = req.query
  const group = await findGroupById(groupId)
  if (!group.userIds.includes(userId) || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  res.success({ preference: keyBy(await findPreferenceByUserId(userId), '_id') })
}

module.exports = { getUserPreferences }
