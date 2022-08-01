export {};
const { param } = require('express-validator');

const show = [
  param('id').isEmail(),
];

module.exports = {
  show,
};
