export {};
const { param } = require('express-validator');

const update = [param('index').notEmpty().isString(), param('permissionId').notEmpty().isString()];

const remove = [param('index').notEmpty().isString(), param('permissionId').notEmpty().isString()];

module.exports = {
  update,
  remove,
};
