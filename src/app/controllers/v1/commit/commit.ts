import { Request, Response } from 'express';
const commits = require('../../../model/commit');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');

exports.show = async (req: Request, res: Response) => {
  const senderId = req.params.senderid;
  const result = await commits.find({ sender_id: senderId });
  res.send(replaceId(result));
};

exports.store = async (req: Request, res: Response) => {
  const { taskId, senderId, content } = req.body;
  const newComment = await commits.create({
    taskId,
    senderId,
    content,
  });
  if (newComment) {
    res.send(replaceId(newComment));
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

exports.update = async (req: Request, res: Response) => {
  const { commitId, content } = req.body;
  const updatedAt = Date.now();
  const updatedComment = await commits.findByIdAndUpdate(
    { _id: commitId },
    { content, updatedAt },
  );
  if (updatedComment) {
    res.send(replaceId(updatedComment));
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

exports.delete = async (req: Request, res: Response) => {
  const { commitId } = req.body;
  await commits.deleteOne({ _id: commitId });
  res.sendStatus(status.NOTCONNECTED);
};
