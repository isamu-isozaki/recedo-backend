/**
 * Author: Isamu Isozaki
 * Firebase init
 */
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

module.exports = admin
