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
const _ = require('lodash')
const { findPreferenceByUserId, findAllPreferences } = require('@/app/preference/repository')

async function getPreferences (req, res) {
  const preferences = await findPreferenceByUserId(req.user._id)
  res.success({ preferences: _.keyBy(preferences, '_id') })
}

module.exports = { getPreferences }
