import { Request, Response } from 'express';
const mongoose = require('mongoose');
const commits = require('../../../model/commit');

exports.index = async (req: Request, res: Response) => {
  const result = await commits.find();
  res.send(result);
};

exports.store = async (req: Request, res: Response) => {
  try {
    const { taskId, senderId, content } = req.body;
    const createdAt = Date.now();
    const newCommitFlag = await commits.create({
      task_id: taskId,
      sender_id: senderId,
      content,
      created_at: createdAt,
    });
    if (newCommitFlag) {
      res.send('New Comment Created');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Something Went Wrong');
    }
  }
};

exports.update = async (req: Request, res: Response) => {
  try {
    const { commitId, content } = req.body;
    const updatedAt = Date.now();
    const successUpdatedFlag = await commits.findByIdAndUpdate(
      { _id: commitId },
      { content, updated_at: updatedAt }
    );
    if (successUpdatedFlag) {
      res.send('Comment Updated');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Something Went Wrong');
    }
  }
};

exports.delete = async (req: Request, res: Response) => {
  try {
    const { commitId } = req.body;
    const successDeletedFlag = await commits.deleteOne({ _id: commitId });
    if (successDeletedFlag) {
      res.send('Comment has been deleted');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Something Went Wrong');
    }
  }
};
