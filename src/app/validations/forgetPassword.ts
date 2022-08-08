export {};
const { body } = require('express-validator');

const forgetPasswordApplication = [body('email').notEmpty().isEmail()];

const put = [body('password').notEmpty().isString()];

module.exports = {
  forgetPasswordApplication,
  put,
};
