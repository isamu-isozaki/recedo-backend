/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const fs = require('fs')
const firebase = require('@/services/firebase')
const { BUCKET_NAME } = require('@/config')
const { createReceipt } = require('@/app/receipt/repository')
const { findGroupById } = require('@/app/group/repository')
const { findWishlistById } = require('@/app/wishlist/repository')
const { conductTaxTransaction } = require('@/app/transaction/utils')
const { findReceiptItems } = require('@/app/item/receipt/repository')
const _keyBy = require('lodash/keyBy')
const { TEMP_DIR } = require('../../../config')
const multiparty = require('multiparty')
const sanitize = require('mongo-sanitize')

async function postReceipt (req, res) {
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
      createReceiptFromForm(req, res, fields, receiptUrls)
      return
    }
    part.resume()
  })
  form.on('error', (err) => {
    console.log({ err })
  })
  form.parse(req)
}

async function createReceiptFromForm (req, res, fields, receiptUrls) {
  sanitize(fields)
  const { payerId, wishlistId } = fields
  let { totalCost, tax } = fields
  totalCost = parseFloat(totalCost)
  tax = parseFloat(tax)
  const wishlist = await findWishlistById(wishlistId)
  if (!wishlist) {
    res.notFound('Wishlist failed to be found')
    return
  }
  const group = await findGroupById(wishlist.groupId)
  if (!group || !group.userIds.includes(payerId) || !group.userIds.includes(req.user._id)) {
    res.unauthorized('You aren\'t a member of this group')
    return
  }
  if (totalCost <= tax || totalCost <= -tax) {
    res.badRequest('Total cost is less than tax')
    return
  }
  const receipt = await createReceipt({ payerId, wishlistId, receiptUrls, tax, totalCost, groupId: group._id })
  conductTaxTransaction(group, receipt, wishlist)
  res.success({ receipt: { ...receipt.toObject(), receiptItems: _keyBy(await findReceiptItems(receipt.receiptItems), '_id') } })
}

module.exports = { postReceipt }
