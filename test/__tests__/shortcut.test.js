const request = require('supertest');
const app = require('../../src/loaders/express');

describe('Create Shortcut Test', () => {
  it('should create shortcut', async () => {
    const shortcut = { shortcutLink: 'google.com', name: 'Google' };
    const res = await request(app())
      .post('/api/v1/projects/62edd13ce3af744361a45fec/shortcuts')
      .send({ ...shortcut });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ ...shortcut }));
  });
  it('should return 422', async () => {
    const shortcut = { shortcutLink: undefined, name: undefined };
    const res = await request(app())
      .post('/api/v1/projects/62edd13ce3af744361a45fec/shortcuts')
      .send({ ...shortcut });
    expect(res.statusCode).toEqual(422);
  });
});
describe('Update Shortcut Test', () => {
  it('should update shortcut', async () => {
    const newShortcut = { shortcutLink: 'facebook.com', name: 'Facebook' };
    const shortcutId = '62ee2acf9ec184ff866da4e3';
    const projectId = '62edd13ce3af744361a45fec';
    const res = await request(app())
      .put(`/api/v1/projects/${projectId}/shortcuts/${shortcutId}`)
      .send({ ...newShortcut });
    expect(res.statusCode).toEqual(200);
  });
  it('should Return Conflict', async () => {
    const newShortcut = { shortcutLink: 'twitter.com', name: 'Twitter' };
    const shortcutId = '62ee2acf9ec184ff866da4e3';
    const WrongProjectId = '62edd13ce3af744361a45fed';
    const res = await request(app())
      .put(`/api/v1/projects/${WrongProjectId}/shortcuts/${shortcutId}`)
      .send({ ...newShortcut });
    expect(res.statusCode).toEqual(409);
  });
  it('should return 422', async () => {
    const shortcut = { shortcutLink: undefined, name: undefined };
    const projectId = '62edd13ce3af744361a45fec';
    const shortcutId = '62ee2c4641dbc06481a70e03';
    const res = await request(app())
      .put(`/api/v1/projects/${projectId}/shortcuts/${shortcutId}`)
      .send({ ...shortcut });
    expect(res.statusCode).toEqual(422);
  });
});
describe('Destroy Shortcut Test', () => {
  it('should delete shortcut', async () => {
    const projectId = '62edd13ce3af744361a45fec';
    const shortcutId = '62ee274026b3bae33e26cee5';
    const res = await request(app()).delete(
      `/api/v1/projects/${projectId}/shortcuts/${shortcutId}`,
    );
    expect(res.statusCode).toEqual(200);
  });
  it('should return NOT_FOUND', async () => {
    const projectId = '62edd13ce3af744361a45fec';
    const shortcutId = '62ee2799394b89ec402b6433';
    const res = await request(app()).delete(
      `/api/v1/projects/${projectId}/shortcuts/${shortcutId}`,
    );
    expect(res.statusCode).toEqual(404);
  });
});
