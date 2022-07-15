import { Request, Response, NextFunction } from 'express';
const commits = require('../../../model/commit');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const senderId = req.params;
  try {
    const result = await commits.find({ sender_id: senderId });
    res.send(replaceId(result));
  } catch (e) {
    next(e);
  }
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId, senderId, content } = req.body;
  try {
    const newComment = await commits.create({
      taskId,
      senderId,
      content,
    });
    if (newComment) {
      res.send(replaceId(newComment));
    }
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const { commitId, content } = req.body;
  const updatedAt = Date.now();
  try {
    const updatedComment = await commits.findByIdAndUpdate(
      { _id: commitId },
      { content, updatedAt },
    );
    if (updatedComment) {
      res.send(replaceId(updatedComment));
    }
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  const { commitId } = req.body;
  try {
    await commits.deleteOne({ _id: commitId });
    res.sendStatus(status.NOT_CONNECTED);
  } catch (e) {
    next(e);
  }
};
