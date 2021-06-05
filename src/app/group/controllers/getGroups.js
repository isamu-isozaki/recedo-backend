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
const { findGroupsByUserId } = require('@/app/group/repository')
async function getGroups (req, res) {
  const group = await findGroupsByUserId(req.user._id)
  res.success({ group })
}

module.exports = { getGroups }
