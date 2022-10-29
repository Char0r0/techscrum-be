const request = require('supertest');
const { setup, restore } = require('../helpers');
const board = require('../fixtures/board');
const statuses = require('../fixtures/statuses');

let application = null;

beforeAll(async () => {
  application = await setup();
});

afterAll(async () => {
  await restore();
});

describe('Test statuses', () => {
  it('should get all statuses', async () => {
    const res = await request(application).get(`/api/v1/boards/${board._id}/statuses`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(statuses);
  });

  it('should response with 404 if no boardId provided', async () => {
    const res = await request(application).get('/api/v1/boards//statuses');
    expect(res.statusCode).toEqual(404);
  });
});
