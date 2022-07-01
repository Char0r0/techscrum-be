import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require('express-validator');
const Project = require('../../../model/project');
const Board = require('../../../model/board');
const status = require('http-status');
//get
exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const projects = await Project.project.find({});
  res.send(projects);
};

// put

exports.update = (req: Request, res: Response) => {
  // const id = parseInt(req.body.id);
  // const index = projectsList.findIndex((project) => project.id === id);
  // if (index >= 0) {
  //   projectsList[index] = { ...req.body };
  //   res.status(200).send(true);
  // }

  return res.status(400).send(false);
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const board = new Board({ title: req.body.name });
  board.save();
  const boardObj = { board_id: board._id };
  const project = new Project.project({ ...req.body, ...boardObj });

  try {
    await project.save();
    res.status(status.CREATED).send(project);
  } catch (e: any) {
    next(e);
  }
};

exports.delete = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  Project.project.findByIdAndRemove(ObjectId(req.params.id), function (err: any) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(status.NO_CONTENT).json({});
  });
};
