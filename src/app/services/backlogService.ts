import escapeStringRegexp from 'escape-string-regexp';
import { Request } from 'express';
import { findSprints } from './sprintService';
import { findTasks } from './taskService';

export const getAllBacklog = async (req: Request) => {
  const { projectId } = req.params;

  // Backlog tasks are task whose sprintId is null
  // Sprint tasks are task whose sprintId is not null
  const backlogTasksFilter = { sprintId: null, projectId };
  const sprintFilter = { projectId };
  const backlogTasks = await findTasks(
    backlogTasksFilter,
    {},
    {},
    {},
    req.dbConnection,
    req.tenantsConnection,
  );
  const sprints = await findSprints(sprintFilter, {}, req.dbConnection, req.tenantsConnection);

  const result = {
    backlog: {
      cards: backlogTasks,
    },
    sprints: sprints,
  };

  return result;
};

export const filterBacklog = async (req: Request) => {
  const { projectId, inputCase, userCase, typeCase, labelCase } = req.params;

  if (!projectId) throw new Error('no projectId provided');

  let inputFilter;
  let fuzzySearchFilter: any;
  let userFilter: any;
  let typeFilter: object | string;
  let labelFilter: object | string;

  enum Cases {
    searchAll = 'all',
  }

  if (inputCase === Cases.searchAll) {
    fuzzySearchFilter = { projectId };
  } else {
    inputFilter = inputCase;
    const escapeRegex = escapeStringRegexp(inputFilter.toString());
    const regex = new RegExp(escapeRegex, 'i');
    fuzzySearchFilter = { title: regex, projectId };
  }

  if (userCase === Cases.searchAll) {
    userFilter = { projectId };
  } else {
    userFilter = userCase;
    const userIds = userFilter.split('-');
    userFilter = { assignId: { $in: userIds }, projectId };
  }

  if (typeCase === Cases.searchAll) {
    typeFilter = { projectId };
  } else {
    typeFilter = typeCase;
    const taskTypeIds = typeFilter.split('-');
    typeFilter = { typeId: { $in: taskTypeIds }, projectId };
  }

  if (labelCase === Cases.searchAll) {
    labelFilter = { projectId };
  } else {
    labelFilter = labelCase;
    const labelIds = labelFilter.split('-');
    labelFilter = { tags: { $all: labelIds }, projectId };
  }

  const sprints = await findSprints(
    { projectId },
    { isComplete: false },
    req.dbConnection,
    req.tenantsConnection,
  );
  for (const sprint of sprints) {
    sprint.taskId = await findTasks(
      { ...fuzzySearchFilter, sprintId: sprint.id },
      { ...userFilter, sprintId: sprint.id },
      { ...typeFilter, sprintId: sprint.id },
      { ...labelFilter, sprintId: sprint.id },
      req.dbConnection,
      req.tenantsConnection,
    );
  }

  const tasks = await findTasks(
    { ...fuzzySearchFilter, sprintId: null },
    { ...userFilter, sprintId: null },
    { ...typeFilter, sprintId: null },
    { ...labelFilter, sprintId: null },
    req.dbConnection,
    req.tenantsConnection,
  );

  return {
    backlog: {
      cards: tasks,
    },
    sprints: sprints,
  };
};

export const getBacklogTasks = async (req: Request) => {
  const { projectId } = req.params;
  const { query } = req.query;

  if (!projectId) throw new Error('no projectId provided');
  if (!query) throw new Error('No Query Found');

  // escape unsafe regex
  const escapeRegex = escapeStringRegexp(query.toString());

  const regex = new RegExp(escapeRegex);
  const fuzzySearchFilter = { title: regex, projectId };
  return findTasks(fuzzySearchFilter, {}, {}, {}, req.dbConnection, req.tenantsConnection);
};
