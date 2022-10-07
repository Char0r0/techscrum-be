import { Request, Response, NextFunction } from 'express';
import { deleteSprint, updateSprint } from '../../services/sprintService';
import { asyncHandler } from '../../utils/helper';
const status = require('http-status');
const Sprint = require('../../model/sprint');

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
