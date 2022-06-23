import { Request, Response } from 'express';
// import commits from '../../../model/commit';
const mongoose = require('mongoose');
const commits = require('../../../model/commit');

exports.index = async (req: Request, res: Response) => {
  const result = await commits.find();
  res.send(result);
};

exports.store = async (req: Request, res: Response) => {
  const { taskId, senderId, content } = req.body;
  const createdAt = Date.now();
  const newCommit = await commits.create({ taskId, senderId, content, createdAt });
  const result = newCommit ? res.send('Success') : res.status(406).send('Something Went Wrong');
};

exports.update = async (req: Request, res: Response) => {
  const { _id, content } = req.body;
  const updatedAt = Date.now();
  const updatedCommit = await commits.findByIdAndUpdate({ _id }, { content, updatedAt });
  const result = updatedCommit ? res.send('Success') : res.status(406).send('Something Went Wrong');
};

exports.delete = async (req: Request, res: Response) => {
  const { _id } = req.body;
  const deletedCommit = await commits.deleteOne({ _id });
  const result = deletedCommit ? res.send('Success') : res.status(406).send('Something Went Wrong');
};
