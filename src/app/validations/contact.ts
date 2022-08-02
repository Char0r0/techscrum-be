export {};
const { param } = require('express-validator');

const store = [param('fullName').notEmpty().isString()];

module.exports = {
  store,
};
