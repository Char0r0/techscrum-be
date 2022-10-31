const Board = require('../src/app/model/board');
const Status = require('../src/app/model/status');
const Task = require('../src/app/model/task');
const { BOARD_SEED } = require('./fixtures/board');
const { STATUS_SEED } = require('./fixtures/statuses');
const { getTask } = require('./fixtures/task');

module.exports = async (dbConnection) => {
  await Board.getModel(dbConnection).create(BOARD_SEED);
  await Status.getModel(dbConnection).create(STATUS_SEED);
  await Task.getModel(dbConnection).create(getTask());
};
