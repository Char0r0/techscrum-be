const request = require('supertest');
const { setup, restore } = require('../helpers');

let application = null;
const baseURL = '/api/v1/sprints';

beforeAll(async () => {
  const { app } = await setup();
  application = app();
});

afterAll(async () => {
  await restore();
});

const sprintInfo = {
  name: 'joe sprint',
  boardId: '6350d443bddbe8fed0138ffd',
  projectId: '6350d443bddbe8fed0138ffe',
};

describe('POST sprint', () => {
  it('should create a sprint if the least info is provided', async () => {
    const res = await request(application).post(baseURL).send(sprintInfo);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      __v: 0,
      _id: expect.any(String),
      boardId: '6350d443bddbe8fed0138ffd',
      createdAt: expect.any(String),
      endDate: null,
      isComplete: false,
      name: 'joe sprint',
      projectId: '6350d443bddbe8fed0138ffe',
      startDate: expect.any(String),
      taskId: [],
      updatedAt: expect.any(String),
    });
  });

  it.only('should create a sprint with extra info', async () => {
    const endDate = new Date(2022, 12, 1);

    const res = await request(application)
      .post(baseURL)
      .send({
        ...sprintInfo,
        endDate: endDate,
        description: 'a new sprint',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      __v: 0,
      _id: expect.any(String),
      boardId: '6350d443bddbe8fed0138ffd',
      createdAt: expect.any(String),
      endDate: endDate.toISOString(),
      isComplete: false,
      name: 'joe sprint',
      description: 'a new sprint',
      projectId: '6350d443bddbe8fed0138ffe',
      startDate: expect.any(String),
      taskId: [],
      updatedAt: expect.any(String),
    });
  });

  it.each`
    field           | value
    ${'name'}       | ${undefined}
    ${'boardId'}    | ${undefined}
    ${'projectId'}  | ${undefined}
    ${'startDate'}  | ${'not a date'}
    ${'endDate'}    | ${'not a date'}
    ${'isComplete'} | ${'not a boolean'}
  `('shoudl return 422 if $field is $value is provided', async ({ field, value }) => {
    const res = await request(application)
      .post(baseURL)
      .send({
        ...sprintInfo,
        [field]: value,
      });
    expect(res.statusCode).toBe(422);
  });
});
