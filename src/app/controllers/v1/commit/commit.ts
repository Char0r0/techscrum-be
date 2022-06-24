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
    const newCommit = await commits.create({ taskId, senderId, content, createdAt });
    if (newCommit) {
      res.send('New Comment Created');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(406).send('Something Went Wrong');
    }
  }
};

exports.update = async (req: Request, res: Response) => {
  try {
    const { commitId, content } = req.body;
    const updatedAt = Date.now();
    const updatedCommit = await commits.findByIdAndUpdate(
      { _id: commitId },
      { content, updatedAt }
    );
    if (updatedCommit) {
      res.send('Comment Updated');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(406).send('Something Went Wrong');
    }
  }
};

exports.delete = async (req: Request, res: Response) => {
  try {
    const { commitId } = req.body;
    const deletedCommit = await commits.deleteOne({ _id: commitId });
    if (deletedCommit) {
      res.send('Comment has been deleted');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(406).send('Something Went Wrong');
    }
  }
};
