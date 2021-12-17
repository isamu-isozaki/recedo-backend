const mongoose = require('mongoose')
const { DB_URI } = require('@/config')

async function connect () {
  console.log('[db] Connecting to database...')
  await mongoose.connect(DB_URI)
  console.log('[db] Database connection established')
}

module.exports = { connect }
