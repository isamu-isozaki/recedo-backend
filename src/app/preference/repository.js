const Preference = require('./model')

function createPreference (data) {
  return Preference.create(data)
}

function updatePreference (preference, updates) {
  Object.assign(preference, updates)
  return preference.save()
}

function updatePreferenceById (preferenceId, updates) {
  return Preference.updateOne({ _id: preferenceId }, updates)
}

function findAllPreferences () {
  return Preference.find({})
}

function findPreferenceById (preferenceId, { fields } = {}) {
  return Preference.findOne({ _id: preferenceId }).select(fields)
}

function findPreferenceByWishlistId (wishlistItemId, { fields } = {}) {
  return Preference.find({ wishlistItemId }).select(fields)
}

function findPreferenceByWishlistItemIdAndUserId (wishlistItemId, userId, { fields } = {}) {
  return Preference.find({ wishlistItemId, userId }).select(fields)
}

function findPreferencesByWishlistItemIds (wishlistItemIds, { fields } = {}) {
  return Preference.find({ wishlistItemId: { $in: wishlistItemIds } }).select(fields)
}

function findPreferencesByWishlistItemIdAndUserIds (wishlistItemIds, userIds, { fields } = {}) {
  return Preference.find({ wishlistItemId: { $in: wishlistItemIds }, userId: { $in: userIds } }).select(fields)
}

function findPreferences ({ ids, fields }) {
  const query = { _id: { $in: ids } }
  return Preference.find(query).select(fields)
}

async function removePreferenceById (preferenceId) {
  return Preference.deleteOne({ _id: preferenceId })
}

module.exports = {
  createPreference,
  updatePreference,
  updatePreferenceById,
  findAllPreferences,
  findPreferenceById,
  findPreferenceByWishlistId,
  findPreferenceByWishlistItemIdAndUserId,
  findPreferencesByWishlistItemIdAndUserIds,
  findPreferences,
  findPreferencesByWishlistItemIds,
  removePreferenceById
}
