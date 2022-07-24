import { Request, Response, NextFunction } from 'express';
const commits = require('../../../model/commit');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  // const { id } = req.params;
  // try {
  //   const result = await commits.getModel(req.dbConnection).find({ senderId: id });
  //   res.send(replaceId(result));
  // } catch (e) {
  //   next(e);
  // }
  res.send([]);
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId, senderId, content } = req.body;
  try {
    const newComment = await commits.getModel(req.dbConnection).create({
      taskId,
      senderId,
      content,
    });
    if (!newComment) {
      res.sendStatus(status.UNPROCESSABLE_ENTITY);
      return;
    }
    res.send(replaceId(newComment));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const { commitId, content } = req.body;
  const updatedAt = Date.now();
  try {
    const updatedComment = await commits
      .getModel(req.dbConnection)
      .findByIdAndUpdate({ _id: commitId }, { content, updatedAt });
    if (!updatedComment) {
      res.sendStatus(status.UNPROCESSABLE_ENTITY);
      return;
    }
    res.send(replaceId(updatedComment));
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const { commitId } = req.body;
  try {
    await commits.getModel(req.dbConnection).deleteOne({ _id: commitId });
    res.sendStatus(status.NO_CONTENT);
  } catch (e) {
    next(e);
  }
};
