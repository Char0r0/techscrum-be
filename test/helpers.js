const sinon = require('sinon');
const dbHandler = require('./dbHandler');
const saasMiddleware = require('../src/app/middleware/saasMiddleware');
const authMiddleware = require('../src/app/middleware/authMiddleware');
const Board = require('../src/app/model/board');
const Status = require('../src/app/model/status');
const board = require('./fixtures/board');
const statuses = require('./fixtures/statuses');

let authStub = null;
let sassStub = null;

const setup = async () => {
  dbConnection = await dbHandler.connect();
  await dbHandler.clearDatabase();

  /**
   * seed database
   */
  await Board.getModel(dbConnection).create(board);
  await Status.getModel(dbConnection).create(statuses);

  authStub = sinon
    .stub(authMiddleware, 'authenticationTokenMiddleware')
    .callsFake(function (req, res, next) {
      return next();
    });
  sassStub = sinon.stub(saasMiddleware, 'saas').callsFake(function (req, res, next) {
    req.dbConnection = dbConnection;
    return next();
  });

  const app = require('../src/loaders/express');

  return app();
};

const restore = async () => {
  if (!authStub || !sassStub) return;
  await authStub.restore();
  await sassStub.restore();
  await dbHandler.closeDatabase();
};

module.exports = {
  setup,
  restore,
};
