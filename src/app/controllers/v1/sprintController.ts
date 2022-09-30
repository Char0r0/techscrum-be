import { Request, Response, NextFunction } from 'express';
const status = require('http-status');
const Sprint = require('../../model/sprint');
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sprintModel = Sprint.getModel(req.dbConnection);
    const sprint = new sprintModel({ name: req.body.name, description:req.body.desc, isComplete:false });
    await sprint.save();
    res.status(status.CREATED).send(sprint);
  } catch (e) {
    next(e);
  }
};