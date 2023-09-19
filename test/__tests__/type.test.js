import request from 'supertest';
import * as fixture from '../fixtures/types';
import dbHandler from '../dbHandler';
import sinon from 'sinon';
import * as saasMiddleware from '../../src/app/middleware/saasMiddlewareV2';


let application = null;
let dbConnection = '';
beforeAll(async () => {
  let result = await dbHandler.connect();
  dbConnection = result.mainConnection;
  
  sinon.stub(saasMiddleware, 'saas').callsFake(function (req, res, next) {
    req.dbConnection = dbConnection;
    return next();
  });
  async function loadApp() {
    const appModule = await import('../../src/loaders/express');
    const app = appModule.default;
    application = app();
  }
  await loadApp();
},
);

afterAll(async () => {
  sassMiddleware.saas.restore();
  await dbHandler.closeDatabase();
});

describe('Types Test', () => {
  it('should get types', async () => {
    const res = await request(application).get('/api/v2/types');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(fixture.getUsers());
  });
});
