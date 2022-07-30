const request = require('supertest');
const app = require('../src/loaders/express');

describe('User Test', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .get('/');
    console.log(res);
    expect(res.statusCode).toEqual(201);
    //expect(res.body).toHaveProperty('post')
  });
});