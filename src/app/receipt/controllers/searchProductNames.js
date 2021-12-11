/**
 * Author: Isamu Isozaki
 */

/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with receipt. Creates receipt
 */
const { queryProductNames } = require('@/app/item/productName/repository')
const _keyBy = require('lodash/keyBy')

async function searchProductNames (req, res) {
  const { name } = req.query
  const productNames = await queryProductNames(name)
  res.success({ productNames: _keyBy(productNames, '_id') })
}

module.exports = { searchProductNames }
