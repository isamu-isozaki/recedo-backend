/**
 * Author: Isamu Isozaki
 */
const { findUserByUsername, updateUser } = require("@/app/user/repository");

/**
 * 
 * @param {object} req request with object user in req.body
 * @param {object} res response
 * Updates user with non-null parts of user in req.body. Respond with key user in req.user
 */
async function putCurrentUser(req, res) {
  const { user: userUpdates } = req.body;

  if (userUpdates.userName && req.user.userName !== userUpdates.userName) {
    const existing = await findUserByUsername(userUpdates.userName, {
      fields: "_id",
    });
    if (existing) {
      return res.badRequest("users/user-taken");
    }
  }

  await updateUser(req.user, userUpdates);

  res.success({ user: req.user });
}

module.exports = { putCurrentUser };
