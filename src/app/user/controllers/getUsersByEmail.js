/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: description
Created:  2021-08-28T20:57:41.446Z
Modified: !date!
Modified By: modifier
*/

const { searchUsersByEmail } = require('@/app/user/repository')
const _keyBy = require('lodash/keyBy')
const sanitize = require('mongo-sanitize')

async function getUsersByEmail (req, res) {
  sanitize(req.query)
  const { email } = req.query
  let users = []
  if (email) {
    users = await searchUsersByEmail(email)
  }
  res.success({ users: _keyBy(users.filter(user => user._id !== req.user.__id), '_id') })
}
module.exports = { getUsersByEmail }
