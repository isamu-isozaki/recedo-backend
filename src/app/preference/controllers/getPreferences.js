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
const { findPreferenceByUserId } = require('@/app/preference/repository')

async function getPreferences (req, res) {
  res.success({ preference: _.keyBy('wishlistItemId', await findPreferenceByUserId(req.user._id)) })
}

module.exports = { getPreferences }
