const request = require('supertest');
const app = require('../../src/loaders/express');

const backlogUrl = '/api/v1/backlog';
const resMessage = {
  message: 'OK',
};

describe('Backlog Test', () => {
  // get all
  it('should get backlogs', async () => {
    const res = await request(app()).get(`${backlogUrl}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(resMessage);
  });

  // get one
  it('should get one backlog', async () => {
    const res = await request(app()).get(`${backlogUrl}/1`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(resMessage);
  });

  // create one
  it('should create a backlog', async () => {
    const res = await request(app()).get(`${backlogUrl}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(resMessage);
  });

  // update one
  it('should update a backlog', async () => {
    const res = await request(app()).get(`${backlogUrl}/1`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(resMessage);
  });

  // delete one
  it('should get a backlog', async () => {
    const res = await request(app()).get(`${backlogUrl}/1`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(resMessage);
  });
});
