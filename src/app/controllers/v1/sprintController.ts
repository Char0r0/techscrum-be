import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/helper';
const status = require('http-status');
const Sprint = require('../../model/sprint');
const Project = require('../../model/project');
const Board = require('../../model/board');
const Task = require('../../model/task');

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const sprintModel = Sprint.getModel(req.dbConnection);
  const sprints = await sprintModel
    .find({})
    .populate({ path: 'projectId', model: Project.getModel(req.dbConnection) })
    .populate({ path: 'boardId', model: Board.getModel(req.dbConnection) })
    .populate({ path: 'taskId', model: Task.getModel(req.dbConnection) });

  res.status(status.OK).json(sprints);
});

// get one
export const show = asyncHandler(async (req: Request, res: Response) => {
  const sprintModel = Sprint.getModel(req.dbConnection);
  const { id } = req.params;
  const sprint = await sprintModel
    .findById(id)
    .populate({ path: 'projectId', model: Project.getModel(req.dbConnection) })
    .populate({ path: 'boardId', model: Board.getModel(req.dbConnection) })
    .populate({ path: 'taskId', model: Task.getModel(req.dbConnection) });

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
  const sprintModel = Sprint.getModel(req.dbConnection);
  const { id } = req.params;
  const updatedSprint = await sprintModel
    .findByIdAndUpdate(id, req.body, {
      returnDocument: 'after',
    })
    .populate({ path: 'projectId', model: Project.getModel(req.dbConnection) })
    .populate({ path: 'boardId', model: Board.getModel(req.dbConnection) })
    .populate({ path: 'taskId', model: Task.getModel(req.dbConnection) });

  res.status(status.OK).json(updatedSprint);
});

// delete
export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const sprintModel = Sprint.getModel(req.dbConnection);
  const { id } = req.query;
  const deletedSprint = await sprintModel.findOneAndDelete(id);
  res.status(status.OK).json(deletedSprint);
});
