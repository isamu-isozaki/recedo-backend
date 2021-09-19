/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: description
Created:  2021-08-28T20:57:41.446Z
Modified: !date!
Modified By: modifier
*/

const { findUsers } = require('@/app/user/repository')
const _keyBy = require('lodash/keyBy')

async function getUsersByIds (req, res) {
  const { ids } = req.query
  const users = await findUsers({ ids })
  res.success({ users: _keyBy(users, '_id') })
}
module.exports = { getUsersByIds }
