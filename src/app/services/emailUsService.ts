import { Request, Response } from 'express';
const { customerEmailUs } = require('../utils/emailSender');
const status = require('http-status');

const customerContactUs = async (req: Request, res: Response) => {
  const data = req.body;
  const response = await customerEmailUs(data.email, data, 'http://localhost:3000/contact');
  if (response == null || response === undefined) return res.status(status.SERVICE_UNAVAILABLE).send();
  return res.status(status.CREATED).send(response);
};

module.exports = { customerContactUs };
