import { Request, Response, NextFunction } from 'express';
import {
  deleteSprint,
  findAllSprint,
  findOneSprint,
  updateSprint,
} from '../../services/sprintService';
import { asyncHandler } from '../../utils/helper';
const status = require('http-status');
const Sprint = require('../../model/sprint');

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const sprints = await findAllSprint(req.dbConnection);
  res.status(status.OK).json(sprints);
});

// get one
export const show = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sprint = await findOneSprint(req.dbConnection, id);
  res.status(status.OK).json(sprint);
});

// create
export const store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sprintModel = Sprint.getModel(req.dbConnection);
    const sprint = new sprintModel(req.body);
    await sprint.save();
    res.status(status.CREATED).send(sprint);
  } catch (e) {
    next(e);
  }
};

// update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedSprint = await updateSprint(req.dbConnection, id, req.body);
  res.status(status.OK).json(updatedSprint);
});

// delete
export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSprint(req.dbConnection, id);
  res.status(status.OK).json({});
});
