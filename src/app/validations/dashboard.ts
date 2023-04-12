const { generateIdValidationRule } = require('../validations/dailyScrum');

const show = [
  generateIdValidationRule('param', 'projectId', true),
  generateIdValidationRule('query', 'userId', true),
];

const showDailyScrums = [
  generateIdValidationRule('param', 'projectId', true),
  generateIdValidationRule('query', 'userId', true),
];

module.exports = { show, showDailyScrums };
