/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with user in req.user
 */
function getCurrentUser (req, res) {
  res.success({ user: req.user })
}

module.exports = { getCurrentUser }
