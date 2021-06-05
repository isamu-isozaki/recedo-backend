/**
 * Author: Isamu Isozaki
 */
/**
 * 
 * @param {object} req request
 * @param {object} res response
 * Respond with created group
 */
 const {updateGroup, findGroupById} = require('@/app/group/repository');
 async function cancelInvite(req, res) {
     const { groupId, userId } = req.body;
     const group = await findGroupById(groupId);
     if(!group.userIds.includes(req.user._id)) {
         //If user is not part of the group
         res.unauthorized();
         return;
    }
     //If userId is not invited in the first place, bad request
    if(!group.invitedUserIds.includes(userId)) {
        res.badRequest(message=`user with id ${userId} is not invited.`);
        return;
    }
    await updateGroup(group, {invitedUserIds: group.invitedUserIds.filter(invitedUserId => invitedUserId !== userId)})
    res.success({ group });
 }
 
 module.exports = { cancelInvite };
   