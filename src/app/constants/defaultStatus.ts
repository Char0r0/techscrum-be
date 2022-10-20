import { IStatus } from '../model/status';

export const DEFAULT_STATUS: Omit<IStatus, 'board' | 'taskList'>[] = [
  {
    name: 'to do',
    slug: 'to-do',
    order: 0,
  },
  {
    name: 'in progress',
    slug: 'in-progress',
    order: 1,
  },
  {
    name: 'review',
    slug: 'review',
    order: 2,
  },
  {
    name: 'done',
    slug: 'done',
    order: 3,
  },
];
