const { check } = require('express-validator');

const store = [check('name', 'Name Empty').notEmpty(), check('key', 'Key Empty').notEmpty()];

export { store };
