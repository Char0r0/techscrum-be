const request = require('supertest');
const { BOARD_TEST } = require('../fixtures/board');
const { setup, restore } = require('../helpers');

let application = null;

beforeAll(async () => {
  const { app } = await setup();
  application = app();
});

afterAll(async () => {
  await restore();
});

describe('Show one board', () => {
  it('should show on board if all info is provided', async () => {
    const { statusCode, body } = await request(application).get(`/api/v1/board/${BOARD_TEST.id}`);
    expect(statusCode).toBe(200);
    expect(body).toEqual(BOARD_TEST);
  });

  it('should should return 500 if invalid boardId provided', async () => {
    const wrongId = '123';
    const { statusCode } = await request(application).get(`/api/v1/board/${wrongId}`);
    expect(statusCode).toBe(500);
  });
});
