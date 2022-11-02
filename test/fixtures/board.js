const BOARD_SEED = {
  _id: '6350d443bddbe8fed0138ffd',
  title: 'test board',
  taskStatus: [
    '6350d443bddbe8fed0138ff4',
    '6350d443bddbe8fed0138ff5',
    '6350d443bddbe8fed0138ff6',
    '6350d443bddbe8fed0138ff7',
  ],
};

const BOARD_TEST = {
  id: '6350d443bddbe8fed0138ffd',
  title: 'test board',
  taskStatus: [
    {
      id: '6350d443bddbe8fed0138ff4',
      name: 'to do',
      slug: 'to-do',
      order: 0,
      taskList: [
        {
          attachmentUrls: [],
          boardId: '6350d443bddbe8fed0138ffd',
          comments: [],
          description: '',
          id: '6350e579d6a0ceeb4fc89fd9',
          projectId: '6350d443bddbe8fed0138ffe',
          reporterId: '632fc37a89d19ed1f57c7ab1',
          sprintId: null,
          status: '6350d443bddbe8fed0138ff4',
          storyPoint: 0,
          tags: [],
          title: 'test task',
          typeId: '631d94d08a05945727602cd1',
          createdAt: expect.any(String),
          dueAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    },
    {
      id: '6350d443bddbe8fed0138ff5',
      name: 'in progress',
      slug: 'in-progress',
      order: 1,
      taskList: [],
    },
    {
      id: '6350d443bddbe8fed0138ff6',
      name: 'review',
      slug: 'review',
      order: 2,
      taskList: [],
    },
    {
      id: '6350d443bddbe8fed0138ff7',
      name: 'done',
      slug: 'done',
      order: 3,
      taskList: [],
    },
  ],
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

module.exports = {
  BOARD_SEED,
  BOARD_TEST,
};
