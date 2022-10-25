export {};
const { param, body } = require('express-validator');

const show = [param('id').notEmpty()];

const store = [body('boardId').notEmpty()];

const update = [param('id').notEmpty().isString()];

const remove = [param('id').notEmpty().isString()];

module.exports = {
  show,
  store,
  update,
  remove,
};
