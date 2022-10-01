export const backlogFakeData = {
  backlog: {
    cards: [
      {
        id: '10437',
        issue: {
          id: '10437',
          key: 'TEC-333',
          summary: 'UI Improvement',
          labels: [],
          type: {
            id: '10100',
            name: 'Story',
            iconUrl: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
          },
          status: {
            id: '10100',
            name: 'To Do',
            category: 'new',
          },
          assignee: {
            accountId: '5d3e7db727c72d0daf92a365',
            displayName: 'Xiaoxin Wang',
            avatarUrl:
              'https://secure.gravatar.com/avatar/c26a47f518d71035adadc3046d272213?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FXW-0.png',
          },
        },
        flagged: false,
        done: false,
        priority: {
          name: 'Medium',
        },
        dueDate: null,
      },
      {
        id: '10438',
        issue: {
          id: '10438',
          key: 'TEC-334',
          summary: 'Backend Improvement',
          labels: [],
          type: {
            id: '10101',
            name: 'Task',
            iconUrl: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
          },
          status: {
            id: '10101',
            name: 'In Progress',
            category: 'new',
          },
          assignee: {
            accountId: '5d3e7db727c72d0daf92a365',
            displayName: 'Joe Zhou',
            avatarUrl:
              'https://secure.gravatar.com/avatar/c26a47f518d71035adadc3046d272213?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FXW-0.png',
          },
        },
        flagged: false,
        done: false,
        priority: {
          name: 'Medium',
        },
        dueDate: null,
      },
    ],
  },
  sprints: [
    [
      {
        id: '20',
        name: 'TEC Sprint 16',
        goal: '',
        startDate: '2022-09-28T23:13:39+10',
        endDate: '2022-10-06T00:13:20+11',
        daysRemaining: 3,
        cards: [
          {
            id: '10328',
            issue: {
              id: '10328',
              key: 'TEC-225',
              summary: 'change icon for project settings and manage members',
              labels: [],
              type: {
                id: '10100',
                name: 'Story',
                iconUrl:
                  '/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
              },
              status: {
                id: '10100',
                name: 'To Do',
                category: 'new',
              },
              assignee: null,
            },
            flagged: false,
            done: false,
            parentId: '10447',
            estimate: {
              storyPoints: null,
              originalEstimate: null,
            },
            priority: {
              name: 'Medium',
              iconUrl: '/images/icons/priorities/medium.svg',
            },
            dueDate: null,
            childIssuesMetadata: {
              complete: 0,
              total: 0,
            },
            fixVersions: [],
          },
        ],
        sprintState: 'ACTIVE',
      },
    ],
  ],
};
