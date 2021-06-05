const {assert} = require('chai');
const crypto = require('crypto');
require("module-alias/register");
require("env-smart").load();
const {createUser, updateUserById, findUserById, removeUserById} = require('@/app/user/repository');

const randString = () => {
    return crypto.randomBytes(10).toString('hex');
}
const randInt = (min, max)=> {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}
describe('DB test', () => {
    it('can connect to db', async () => {
        await require("@/database").connect();
    });
    describe('User', () => {
        const userId = randString();
        const nameFirst = randString();
        const nameLast = randString();
        const userName = randString();
        const email = randString()+"@"+randString()+"."+randString();
        const country = "jp";
        const birth = "20200406";
        const profileTextId = randString();
        it('can create', async () => {
            const user = await createUser({
                _id: userId,
                nameFirst,
                nameLast,
                userName,
                email,
                country,
                birth,
                profileTextId,
            });
            assert.isNotNull(user);
            assert.strictEqual(user._id, userId);
            assert.strictEqual(user.nameFirst, nameFirst);
            assert.strictEqual(user.nameLast, nameLast);
            assert.strictEqual(user.userName, userName);
            assert.strictEqual(user.email, email);
            assert.strictEqual(user.country, country);
        });
        it('can find', async () => {
            const user = await findUserById(userId);
            assert.isNotNull(user);
            assert.strictEqual(user._id, userId);
            assert.strictEqual(user.nameFirst, nameFirst);
            assert.strictEqual(user.nameLast, nameLast);
            assert.strictEqual(user.userName, userName);
            assert.strictEqual(user.email, email);
            assert.strictEqual(user.country, country);
        });
        it('can update', async () => {
            const dummyName = randString();
            await updateUserById(userId, {userName: dummyName});
            let user = await findUserById(userId);
            assert.isNotNull(user);
            assert.strictEqual(user.userName, dummyName);
            await updateUserById(userId, {userName: userName});
            user = await findUserById(userId);
            assert.isNotNull(user);
            assert.strictEqual(user.userName, userName);
        });
        
        it('can remove', async () => {
            await removeUserById(userId);
            const user = await findUserById(userId);
            assert.isNotNull(!user);
        });
    });
})
