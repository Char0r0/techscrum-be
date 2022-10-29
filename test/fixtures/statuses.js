const board = require('./board');

module.exports = [
  {
    _id: '6350d443bddbe8fed0138ff4',
    name: 'to do',
    slug: 'to-do',
    order: 0,
    board: board._id,
  },
  {
    _id: '6350d443bddbe8fed0138ff5',
    name: 'in progress',
    slug: 'in-progress',
    order: 1,
    board: board._id,
  },
  {
    _id: '6350d443bddbe8fed0138ff6',
    name: 'review',
    slug: 'review',
    order: 2,
    board: board._id,
  },
  {
    _id: '6350d443bddbe8fed0138ff7',
    name: 'done',
    slug: 'done',
    order: 3,
    board: board._id,
  },
];
