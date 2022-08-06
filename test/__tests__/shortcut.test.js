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
// describe('Update Shortcut Test', () => {
//   it('should update shortcut', async () => {
//     const newShortcut = { shortcutLink: 'google.com', name: 'Google' };
//     const shortcutId = '62eca03b0caa6400308af9a2';
//     const projectId = '62e4b5606fb0da0a12dcfe6d';
//     const res = await request(app())
//       .put(`/api/v1/projects/${projectId}/shortcuts/${shortcutId}`)
//       .send({ ...newShortcut });
//     expect(res.statusCode).toEqual(200);
//   });
//   it('should Return Conflict', async () => {
//     const newShortcut = { shortcutLink: undefined, name: undefined };
//     const wrongId = '62eca03b0caa6400308af9b4';
//     const projectId = '62e4b5606fb0da0a12dcfe6d';
//     const res = await request(app())
//       .put(`/api/v1/projects/${projectId}/shortcuts/${wrongId}`)
//       .send({ ...newShortcut });
//     expect(res.statusCode).toEqual(422);
//   });
//   it('should return 422', async () => {
//     const shortcut = { shortcutLink: undefined, name: undefined };
//     const projectId = '62e4b5606fb0da0a12dcfe6d';
//     const shortcutId = '62eca03b0caa6400308af9a2';
//     const res = await request(app())
//       .put(`/api/v1/projects/${projectId}/shortcuts/${shortcutId}`)
//       .send({ ...shortcut });
//     expect(res.statusCode).toEqual(422);
//   });
// });
describe('Destroy Shortcut Test', () => {
  it('should delete shortcut', async () => {
    const projectId = '62edd13ce3af744361a45fec';
    const shortcutId = '62ee28c1f1416250a34a771c';
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
