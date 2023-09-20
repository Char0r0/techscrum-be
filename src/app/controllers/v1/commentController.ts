import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import status from 'http-status';
import * as comment from '../../model/comment';
import * as User from '../../model/user';
import { replaceId } from '../../services/replaceService';


export const show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const userModel = await User.getModel(req.tenantsConnection);

  try {
    const result = await comment
      .getModel(req.dbConnection)
      .find({})
      .populate({ path: 'senderId', model: userModel });
    res.send(replaceId(result));
  } catch (e) {
    next(e);
  }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { taskId, senderId, content } = req.body;
  try {
    const newComment = await comment.getModel(req.dbConnection).create({
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

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { id } = req.params;
  const { content } = req.body;
  const updatedAt = Date.now();
  try {
    const updatedComment = await comment
      .getModel(req.dbConnection)
      .findByIdAndUpdate({ _id: id }, { content, updatedAt }, { new: true });
    if (!updatedComment) {
      res.sendStatus(status.NOT_FOUND);
      return;
    }
    res.send(replaceId(updatedComment));
  } catch (e) {
    next(e);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { id } = req.params;
  try {
    const deleteComment = await comment.getModel(req.dbConnection).findByIdAndDelete({ _id: id });
    if (!deleteComment) {
      res.sendStatus(status.NOT_FOUND);
      return;
    }
    res.sendStatus(status.NO_CONTENT);
  } catch (e) {
    next(e);
  }
};
