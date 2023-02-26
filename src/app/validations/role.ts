export {};
const { param } = require('express-validator');

const update = [param('projectId').notEmpty().isString(), param('roleId').notEmpty().isString()];

const getProject = [param('projectId').notEmpty().isString()];

const remove = [param('projectId').notEmpty().isString(), param('roleId').notEmpty().isString()];

module.exports = {
  update,
  remove,
  getProject,
};
