const request = require('supertest');
const sinon = require('sinon');
const dbHandler = require('../dbHandler');
const saasMiddleware = require('../../src/app/middleware/saasMiddleware');
const authMiddleware = require('../../src/app/middleware/authMiddleware');
const User = require('../../src/app/model/user');
const Project = require('../../src/app/model/project');
const Task = require('../../src/app/model/task');
const Board = require('../../src/app/model/board');
const fixture = require('../fixtures/task');
const bcrypt = require('bcrypt');
let application = null;
let dbConnection = '';
let token = '';

beforeAll(async () => {
  dbConnection = await dbHandler.connect();
  await dbHandler.clearDatabase();

  await User.getModel(dbConnection).create({
    _id: '62f33512e420a96f31ddcccc',
    email: 'test@gamil.com',
    password: await bcrypt.hash('testPassword', 8),
    active: true,
  });
  await Project.getModel(dbConnection).create({
    _id: '62f33512e420a96f31ddc2bd',
    name: 'test name',
    key: 'key123',
    projectLeadId: 'projectLead1',
    ownerId: '62e8d28a182f4561a92f6aed',
    boardId: '62e38d7e4b07fa1f2af7ba45',
  });

  await Task.getModel(dbConnection).create({
    _id: '62e4bc9692266e6c8fcd0bbe',
    title: 'test task',
    projectId: '62f33512e420a96f31ddc2bd',
    statusId: '62e38d7e4b07fa1f2af7ba46',
    boardId: '62e38d7e4b07fa1f2af7ba45',
    createdAt: '2022-08-17T05:00:10.443Z',
    updatedAt: '2022-08-17T05:00:10.443Z',
  });

  await Board.getModel(dbConnection).create({
    _id: '62e38d7e4b07fa1f2af7ba45',
    title: 'Project X',
    taskStatus: [
      {
        _id: '62e38d7e4b07fa1f2af7ba46',
        name: 'To Do',
        slug: 'to-do',
      },
      {
        _id: '62e38d7e4b07fa1f2af7ba47',
        name: 'In Progress',
        slug: 'in-progress',
      },
      {
        _id: '62e38d7e4b07fa1f2af7ba48',
        name: 'Review',
        slug: 'review',
      },
      {
        _id: '62e38d7e4b07fa1f2af7ba49',
        name: 'Done',
        slug: 'done',
      },
    ],
  });

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

describe('Get One Task Test', () => {
  it('should show one task', async () => {
    const id = '62e4bc9692266e6c8fcd0bbe';
    const res = await request(application).get(`/api/v1/tasks/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(fixture.getTask());
  });
});

describe('Post Task Test', () => {
  it('should create a task', async () => {
    const newTask = {
      title: 'create task test',
      boardId: '62e38d7e4b07fa1f2af7ba45',
      statusId: '62e38d7e4b07fa1f2af7ba46',
      projectId: '62f33512e420a96f31ddc2bd',
    };
    const res = await request(application)
      .post('/api/v1/tasks')
      .send({ ...newTask })
      .set('Authorization', token);
    expect(res.statusCode).toEqual(201);
  });
});

describe('Update Task Test', () => {
  it('should update task', async () => {
    const id = '62e4bc9692266e6c8fcd0bbe';
    const newTask = { title: 'updated task' };
    const res = await request(application)
      .put(`/api/v1/tasks/${id}`)
      .send({ ...newTask });
    expect(res.body).toMatchObject({ ...newTask });
  });
  it('should return 404 not found', async () => {
    const wrongId = '62e4bc9692266e6c8fcd0bb1';
    const newTask = { title: 'updated task' };
    const res = await request(application)
      .put(`/api/v1/tasks/${wrongId}`)
      .send({ ...newTask });
    expect(res.statusCode).toEqual(404);
  });
  it('should return 422 unprocessable entity', async () => {
    const id = '62e4bc9692266e6c8fcd0bbe';
    const newTask = { title: undefined };
    const res = await request(application)
      .put(`/api/v1/tasks/${id}`)
      .send({ ...newTask });
    expect(res.statusCode).toEqual(422);
  });
});

describe('Delete task test', () => {
  it('should delete task', async () => {
    const id = '62e4bc9692266e6c8fcd0bbe';
    const res = await request(application).delete(`/api/v1/tasks/${id}`);
    expect(res.statusCode).toEqual(200);
  });
});
