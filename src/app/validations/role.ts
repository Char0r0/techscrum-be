export {};
const { param } = require('express-validator');

const update = [param('id').notEmpty().isString(), param('permissionId').notEmpty().isString()];

const remove = [param('id').notEmpty().isString(), param('permissionId').notEmpty().isString()];

module.exports = {
  update,
  remove,
};
