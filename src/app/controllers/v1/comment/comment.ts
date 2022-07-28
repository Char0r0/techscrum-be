import { Request, Response, NextFunction } from 'express';
const Comment = require('../../../model/comment');
const Task = require('../../../model/task');
const mongoose = require('mongoose');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');
import { validationResult } from 'express-validator';

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const commentModel = Comment.getModel(req.dbConnection);

    let result = new commentModel({
      senderId: req.body.senderId,
      content: req.body.content,
    });
    result.save();
    const taskModel = Task.getModel(req.dbConnection);
    const task = await taskModel.findById(req.params.taskId);
    task.comments.push(mongoose.Types.ObjectId(result._id));
    task.save();
    return res.send(replaceId(result));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { content } = req.body;
  const updatedAt = Date.now();
  try {
    const updatedComment = await Comment.getModel(req.dbConnection).findByIdAndUpdate(
      req.params.id,
      { content, updatedAt },
      { new: true },
    );
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { taskId, commentId } = req.params;
  try {
    const checkCommentExistUnderComment = await Comment.getModel(req.dbConnection).findById({
      _id: commentId,
    });
    const checkCommentExistUnderTask = await Task.getModel(req.dbConnection).find({
      'comments._id': commentId,
    });
    if (!checkCommentExistUnderComment && checkCommentExistUnderTask.length === 0) {
      res.sendStatus(status.NOT_FOUND);
      return;
    }
    const taskModel = Task.getModel(req.dbConnection);
    const task = await taskModel.findById(taskId);
    task.comments = await task.comments.filter((item: any) => {
      return item._id.toString() !== commentId;
    });
    const removeCommentUnderTask = await task.save();
    const deleteComment = await Comment.getModel(req.dbConnection).findByIdAndRemove({
      _id: commentId,
    });
    if (!removeCommentUnderTask && !deleteComment) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.sendStatus(status.NO_CONTENT);
  } catch (e) {
    next(e);
  }
};
