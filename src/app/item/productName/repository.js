const ProductName = require("./model");


function createProductName(data) {
  return ProductName.create(data);
}

function updateProductName(productName, updates) {
  Object.assign(productName, updates);
  return productName.save();
}

function updateProductNameById(productNameId, updates) {
  return ProductName.updateOne({ _id: productNameId }, updates);
}

function findAllProductNames() {
  return ProductName.find({});
}

function findProductNameById(productNameId, { fields } = {}) {
  return ProductName.findOne({ _id: productNameId }).select(fields);
}

function findProductNameByIds(productNameIds, { fields } = {}) {
  return ProductName.find({ _id: {$in: productNameIds} }).select(fields);
}

function findProductNameByName(name, { fields } = {}) {
  return ProductName.findOne({ name }).select(fields);
}

function findProductNames({ ids, fields }) {
  const query = { _id: { $in: ids } };
  return ProductName.find(query).select(fields);
}

function updateProductName(productName, updates) {
  Object.assign(productName, updates);
  return productName.save();
}

async function removeProductNameById(productNameId) {
    return ProductName.deleteOne({ _id: productNameId });
}

module.exports = {
  createProductName,
  updateProductName,
  updateProductNameById,
  findAllProductNames,
  findProductNameById,
  findProductNameByIds,
  findProductNameByName,
  findProductNames,
  removeProductNameById,
};
