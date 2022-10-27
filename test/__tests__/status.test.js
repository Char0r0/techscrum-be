const request = require('supertest');
const sinon = require('sinon');
const dbHandler = require('../dbHandler');
const saasMiddleware = require('../../src/app/middleware/saasMiddleware');
const authMiddleware = require('../../src/app/middleware/authMiddleware');
const Board = require('../../src/app/model/board');
const Status = require('../../src/app/model/status');

let application = null;
let dbConnection = '';

const boardId = '6350d443bddbe8fed0138ffd';

const statuses = [
  {
    _id: '6350d443bddbe8fed0138ff4',
    name: 'to do',
    slug: 'to-do',
    order: 0,
    board: boardId,
  },
  {
    _id: '6350d443bddbe8fed0138ff5',
    name: 'in progress',
    slug: 'in-progress',
    order: 1,
    board: boardId,
  },
  {
    _id: '6350d443bddbe8fed0138ff6',
    name: 'review',
    slug: 'review',
    order: 2,
    board: boardId,
  },
  {
    _id: '6350d443bddbe8fed0138ff7',
    name: 'done',
    slug: 'done',
    order: 3,
    board: boardId,
  },
];

beforeAll(async () => {
  dbConnection = await dbHandler.connect();
  await dbHandler.clearDatabase();

  await Board.getModel(dbConnection).create({
    _id: boardId,
    title: 'test board',
    taskStatus: [
      '6350d443bddbe8fed0138ff4',
      '6350d443bddbe8fed0138ff5',
      '6350d443bddbe8fed0138ff6',
      '6350d443bddbe8fed0138ff7',
    ],
  });

  await Status.getModel(dbConnection).create(statuses);

  sinon.stub(authMiddleware, 'authenticationTokenMiddleware').callsFake(function (req, res, next) {
    return next();
  });
  sinon.stub(saasMiddleware, 'saas').callsFake(function (req, res, next) {
    req.dbConnection = dbConnection;
    return next();
  });

  const app = require('../../src/loaders/express');
  application = app();
});

afterAll(async () => {
  authMiddleware.authenticationTokenMiddleware.restore();
  saasMiddleware.saas.restore();
  await dbHandler.closeDatabase();
});

describe('Test statuses', () => {
  it('should get all statuses', async () => {
    const res = await request(application).get(`/api/v1/boards/${boardId}/statuses`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(statuses);
  });

  it('should response with 404 if no boardId provided', async () => {
    const res = await request(application).get('/api/v1/boards//statuses');
    expect(res.statusCode).toEqual(404);
  });
});
