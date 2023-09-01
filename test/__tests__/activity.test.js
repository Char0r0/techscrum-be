import request from 'supertest';
import dbHandler from '../dbHandler';
import * as User from '../../src/app/model/user';
import mongoose from 'mongoose';
import * as Task from '../../src/app/model/task';
import sinon from 'sinon';
import * as sassMiddleware from '../../src/app/middleware/saasMiddlewareV2';

let application = null;
let dbConnection = '';
let tenantConnection = '';

const userId = new mongoose.Types.ObjectId();
const taskId = new mongoose.Types.ObjectId();
const statusId = new mongoose.Types.ObjectId();
const projectId = new mongoose.Types.ObjectId();
const boardId = new mongoose.Types.ObjectId();
const reportedId = new mongoose.Types.ObjectId();
const typeId = new mongoose.Types.ObjectId();
const user = {
  _id: userId,
  email: 'test@gamil.com',
  password: 'testtesttest',
  active: true,
};
const task = {
  _id: taskId,
  title: 'demo',
  description: 'demo task',
  statusId: statusId,
  projectId: projectId,
  boardId: boardId,
  sprintId: null,
  reportedId: reportedId,
  typeId: typeId,
  attachmentUrls: [],
};
const activity = { operation: 'created', userId: userId, taskId: taskId };

beforeAll(async () => {
  let result = await dbHandler.connect();

  dbConnection = result.mainConnection;
  tenantConnection = result.tenantConnection;
  await dbHandler.clearDatabase();
  await User.getModel(tenantConnection).create(user);
  await Task.getModel(tenantConnection).create(task);
  sinon.stub(sassMiddleware, 'saas').callsFake(function (req, res, next) {
    req.dbConnection = dbConnection;
    req.tenantsConnection = tenantConnection;
    return next();
  });
  const app = require('../../src/loaders/express');
  application = app();
});

afterAll(async () => {
  sassMiddleware.saas.restore();
  await dbHandler.closeDatabase();
});

describe('Create and Get Activity Test', () => {
  it('should create shortcut', async () => {
    const res = await request(application)
      .post('/api/v2/activities')
      .send({ ...activity });
    expect(res.statusCode).toEqual(200);
  });
  it('should get existing activities', async () => {
    const res = await request(application).get(`/api/v2/activities/${taskId}`).send();
    expect(res.statusCode).toEqual(200);
  });
});

describe('Delete Activity Test', () => {
  it('Should delete activity', async () => {
    const res = await request(application).delete(`/api/v2/activities/${taskId}`).send();
    expect(res.statusCode).toEqual(200);
  });
  it('should return deleted activities', async () => {
    const res = await request(application).get(`/api/v2/activities/${taskId}`).send();
    const deletedActivity = {
      ...activity,
      isDeleted: true,
      taskId: taskId.toString(),
      userId: { _id: userId.toString() },
    };

    expect(res.body).toMatchObject([deletedActivity]);
  });
});
