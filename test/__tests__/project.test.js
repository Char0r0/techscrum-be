//62e4b5606fb0da0a12dcfe67
import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';
import * as authMiddleware from '../../src/app/middleware/authMiddleware';
import * as saasMiddleware from '../../src/app/middleware/saasMiddlewareV2';
import dbHandler from '../dbHandler';
import * as User from '../../src/app/model/user';
import * as Project from '../../src/app/model/project';
import * as permissionMiddleware from '../../src/app/middleware/permissionMiddleware';
import { PROJECT_SEED, PROJECT_USER_SEED }  from '../fixtures/project';
let application = null;
let dbConnection = '';
let tenantConnection = '';
let projectId = new mongoose.Types.ObjectId() ;    

beforeAll(async () => {

  let result = await dbHandler.connect();
  dbConnection = result.mainConnection;
  tenantConnection = result.tenantConnection;
  await dbHandler.clearDatabase();

  await User.getModel(tenantConnection).create(PROJECT_USER_SEED);
  await Project.getModel(dbConnection).create({ ...PROJECT_SEED, _id:projectId });

  sinon.stub(saasMiddleware, 'saas').callsFake(function (req, res, next) {
    req.dbConnection = dbConnection;
    req.tenantsConnection = tenantConnection;
    return next();
  });

  sinon.stub(authMiddleware, 'authenticationTokenMiddleware')
    .callsFake(function (req, res, next) {
      return next();
    });

  sinon.stub(permissionMiddleware, 'permission')
    .callsFake(function (slug) {
      return (req, res, next) => {
        return next();
      };
    });


  // after you can create app:
  async function loadApp() {
    const appModule = await import('../../src/loaders/express');
    const app = appModule.default;
    application = app();
  }
  await loadApp();
});

afterAll(async function () {
  // restore original method
  authMiddleware.authenticationTokenMiddleware.restore();
  saasMiddleware.saas.restore();
  await dbHandler.closeDatabase();
});

describe('Project Test', () => {
  it('should get projects', () => {
    return request(application)
      .get('/api/v2/projects').expect(200);
  });
});

describe('Get One project', () => {
  it('should get one project', () => {
    return request(application)
      .get(`/api/v2/projects/${projectId}`).expect(200);
  });


  describe('Create Project Test', () => {
    it('should create project', async () => {
      const newProject = {
        name:'new project',
        key:'key123',
        ownerId: '62e8d28a182f4561a92f6aed',
        projectLeadId: new mongoose.Types.ObjectId(),
        assigneeId: '62e8d28a182f4561a92f6aed',
        iconUrl:'123331',
        description:'1234',
        userId: '62e8d28a182f4561a92f6aed',
      };

      const expectNewProject = {
        name:'new project',
        key:'key123',
        ownerId: '62e8d28a182f4561a92f6aed',
        projectLeadId: newProject.projectLeadId.toString(),
        assigneeId: '62e8d28a182f4561a92f6aed',
        iconUrl:'123331',
        description:'1234',
      };

      const res = await request(application)
        .post('/api/v2/projects')
        .send({ ...newProject });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject(expectNewProject);
    });


    it('should return error code 422', async () => {
      const newProject = { name: undefined,  key:'123', userId:'62e8d28a182f4561a92f6aed' };
      const res = await request(application)
        .post('/api/v2/projects')
        .send({ ...newProject });
      expect(res.statusCode).toEqual(422);
    },
    );

    it('should return error code 422', async () => {
      const newProject = { name: '123', key:undefined, userId:'62e8d28a182f4561a92f6aed' };
      const res = await request(application)
        .post('/api/v2/projects')
        .send({ ...newProject });
      expect(res.statusCode).toEqual(422);
    },
    );

    it('should return error code 422', async () => {
      const newProject = { name: undefined, key:undefined, userId:undefined };
      const res = await request(application)
        .post('/api/v2/projects')
        .send({ ...newProject });
      expect(res.statusCode).toEqual(422);
    },
    );
  
    it('should return error code 500', async () => {
      const newProject = { name: '123', key:'123', userId: undefined };
      const res = await request(application)
        .post('/api/v2/projects')
        .send({ ...newProject });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('Update Project Test', () => {
    it('should update project test', async () => {
      const newProject = { name: 'Updated Project' };
      const res = await request(application)
        .put(`/api/v2/projects/${projectId}`)
        .send({ ...newProject });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({ ...newProject });
    },
    );
  });

  describe('Delete Project Test', () => {
    it('should delete project test', async () => {
      const res = await request(application)
        .delete(`/api/v2/projects/${projectId}`)
        .send();
      expect(res.statusCode).toEqual(204);
    });
  });
});
