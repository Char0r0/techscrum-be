const request = require('supertest');
const sinon = require('sinon');
const dbHandler = require('../dbHandler');
const saasMiddleware = require('../../src/app/middleware/saasMiddleware');
const authMiddleware = require('../../src/app/middleware/authMiddleware');
const User = require('../../src/app/model/user');
const Project = require('../../src/app/model/project');
const Task = require('../../src/app/model/task');
const Board = require('../../src/app/model/board');
const Status = require('../../src/app/model/status');
const Type = require('../../src/app/model/type');
const fixture = require('../fixtures/task');
const bcrypt = require('bcrypt');

let application = null;
let dbConnection = '';
let token = '';

const projectId = '6350d443bddbe8fed0138ffe';
const boardId = '6350d443bddbe8fed0138ffd';
const userId = '632fc37a89d19ed1f57c7ab1';
const statusId = '6350d443bddbe8fed0138ff4';
const taskId = '6350e579d6a0ceeb4fc89fd9';
const typeId = '631d94d08a05945727602cd1';

beforeAll(async () => {
  dbConnection = await dbHandler.connect();
  await dbHandler.clearDatabase();

  await User.getModel(dbConnection).create({
    _id: userId,
    name: 'Joe',
    email: 'test@gmail.com',
    password: await bcrypt.hash('testPassword', 8),
    active: true,
    avatarIcon: 'https://example.png',
  });
  await Project.getModel(dbConnection).create({
    _id: projectId,
    name: 'test name',
    key: 'key123',
    projectLeadId: 'projectLead1',
    ownerId: userId,
    boardId: boardId,
  });

  await Type.getModel(dbConnection).create({
    _id: typeId,
    slug: 'story',
    name: 'Story',
    createdAt: '2022-09-11T07:57:04.258Z',
    updatedAt: '2022-09-11T07:57:04.258Z',
  });

  await Task.getModel(dbConnection).create({
    _id: taskId,
    title: 'test task',
    order: 0,
    description: '',
    projectId: projectId,
    boardId: boardId,
    reporterId: userId,
    typeId: typeId,
    status: statusId,
    dueAt: '2022-10-20T06:06:45.946Z',
    createdAt: '2022-10-20T06:06:49.590Z',
    updatedAt: '2022-10-20T06:06:49.590Z',
  });

  await Status.getModel(dbConnection).create([
    {
      _id: statusId,
      name: 'to do',
      slug: 'to-do',
      order: 0,
      board: '6350d443bddbe8fed0138ffd',
      taskList: ['6350e579d6a0ceeb4fc89fd9'],
    },
    {
      _id: '6350d443bddbe8fed0138ff5',
      name: 'in progress',
      slug: 'in-progress',
      order: 1,
      board: '6350d443bddbe8fed0138ffd',
    },
    {
      _id: '6350d443bddbe8fed0138ff6',
      name: 'review',
      slug: 'review',
      order: 2,
      board: '6350d443bddbe8fed0138ffd',
    },
    {
      _id: '6350d443bddbe8fed0138ff7',
      name: 'done',
      slug: 'done',
      order: 3,
      board: '6350d443bddbe8fed0138ffd',
    },
  ]);

  await Board.getModel(dbConnection).create({
    _id: boardId,
    title: 'Project X',
    taskStatus: [
      '6350d443bddbe8fed0138ff4',
      '6350d443bddbe8fed0138ff5',
      '6350d443bddbe8fed0138ff6',
      '6350d443bddbe8fed0138ff7',
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
    const res = await request(application).get(`/api/v1/tasks/${taskId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(fixture.getTask());
  });
});

describe('Post Task Test', () => {
  it('should create a task', async () => {
    const newTask = {
      title: 'create task test',
      boardId: boardId,
      status: 'to do',
      projectId: projectId,
    };
    const res = await request(application)
      .post('/api/v1/tasks')
      .send(newTask)
      .set('Authorization', token);
    expect(res.statusCode).toEqual(201);
  });
});

describe('Update Task Test', () => {
  it('should update task', async () => {
    const newTask = { title: 'updated task' };
    const res = await request(application)
      .put(`/api/v1/tasks/${taskId}`)
      .send({ ...newTask });
    expect(res.body).toMatchObject({ ...newTask });
    const checkUpdateTask = await Task.getModel(dbConnection).findById(taskId);
    expect(checkUpdateTask.title).toEqual(newTask.title);
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
    const newTask = { title: undefined };
    const res = await request(application)
      .put(`/api/v1/tasks/${taskId}`)
      .send({ ...newTask });
    expect(res.statusCode).toEqual(422);
  });
});

describe('Delete task test', () => {
  it('should delete task', async () => {
    const res = await request(application).delete(`/api/v1/tasks/${taskId}`);
    expect(res.statusCode).toEqual(204);
    const checkDeleteTask = await Task.getModel(dbConnection).findById(taskId);
    expect(checkDeleteTask).toBeFalsy();
  });
  it('should return 404 not found', async () => {
    const wrongId = '62e4bc9692266e6c8fcddddd';
    const res = await request(application).delete(`/api/v1/tasks/${wrongId}`);
    expect(res.statusCode).toEqual(404);
  });
});
