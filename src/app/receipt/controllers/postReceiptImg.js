const { findReceiptById, updateReceipt, removeReceiptItemById } = require('@/app/receipt/repository')
const fs = require('fs')
const { TEMP_DIR } = require('@/config')
const multiparty = require('multiparty')
const { findGroupById } = require('@/app/group/repository')
const { findReceiptItems } = require('@/app/item/receipt/repository')
const _keyBy = require('lodash/keyBy')

async function postReceiptImg (req, res) {
  const form = new multiparty.Form()
  const fields = {}
  let receiptUrls = []

  form.on('part', (part) => {
    if (!part.filename) {
      part.on('data', chunk => {
        fields[part.name] = chunk.toString()
      })
    }
    if (part.filename) {
      const fileName = require('crypto').randomBytes(32).toString('hex')

      const receiptUrl = `${fileName}.jpg`
      const writeStream = fs.createWriteStream(`${TEMP_DIR}/${receiptUrl}`)
      part.on('data', chunk => {
        writeStream.write(chunk)
      })

      part.on('end', chunk => {
        console.log('File writing done!')
        writeStream.end(chunk)
      })
      receiptUrls = [...receiptUrls, receiptUrl]
      updateReceiptImgsFromForm(req, res, fields, receiptUrls)
      return
    }
    part.resume()
  })
  form.on('error', (err) => {
    console.log({ err })
  })
  form.parse(req)
}

async function updateReceiptImgsFromForm (req, res, fields, receiptUrls) {
  const { receiptId } = fields

  const receipt = await findReceiptById(receiptId)
  if (!receipt) {
    res.unauthorized()
    return
  }
  const group = await findGroupById(receipt.groupId)
  if (!group || !group.userIds.includes(req.user._id)) {
    res.unauthorized()
    return
  }
  const updatedReceiptUrls = [...receipt.receiptUrls, ...receiptUrls]
  await updateReceipt(receipt, { receiptUrls: updatedReceiptUrls })
  res.success({ receipt: { ...receipt.toObject(), receiptUrls: updatedReceiptUrls, receiptItems: _keyBy(await findReceiptItems(receipt.receiptItems), '_id') } })
}

module.exports = { postReceiptImg }

