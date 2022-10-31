const request = require('supertest');
const { BOARD_TEST } = require('../fixtures/board');
const { setup, restore } = require('../helpers');

let app = null;

beforeAll(async () => {
  app = await setup();
});

afterAll(async () => {
  await restore();
});

describe('Show one board', () => {
  it('should show on board if all info is provided', async () => {
    const { statusCode, body } = await request(app).get(`/api/v1/board/${BOARD_TEST.id}`);
    expect(statusCode).toBe(200);
    expect(body).toEqual(BOARD_TEST);
  });
});
