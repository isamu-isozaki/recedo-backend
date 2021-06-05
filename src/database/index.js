const mongoose = require('mongoose')
const { DB_URI, DB_USER, DB_PASSWORD } = require('@/config')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  user: DB_USER,
  pass: DB_PASSWORD
}

async function connect () {
  console.log('[db] Connecting to database...')
  await mongoose.connect(DB_URI, options)
  console.log('[db] Database connection established')
}

module.exports = { connect }
