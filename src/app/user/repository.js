const User = require('./model')

function createUser (data) {
  return User.create(data)
}

function updateUser (user, updates) {
  Object.assign(user, updates)
  return user.save()
}

function updateUserById (userId, updates) {
  return User.updateOne({ _id: userId }, updates)
}

function findAllUsers () {
  return User.find({})
}

function findUserById (userId, { fields } = {}) {
  return User.findOne({ _id: userId }).select(fields)
}

function findUserByUser (user, { fields } = {}) {
  return User.find({ authorId: user }).select(fields)
}

function searchUsersByEmail (email, { fields } = {}) {
  return User.find({ $text: { $search: email } }).select(fields)
}

function findUsers (ids, { fields } = {}) {
  const query = { _id: { $in: ids } }
  return User.find(query).select(fields)
}

async function removeUserById (userId) {
  return User.deleteOne({ _id: userId })
}

module.exports = {
  createUser,
  updateUser,
  updateUserById,
  findAllUsers,
  findUserById,
  findUserByUser,
  searchUsersByEmail,
  findUsers,
  removeUserById
}
