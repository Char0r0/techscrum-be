import { Request, Response } from 'express';
const { customerEmailUs } = require('../utils/emailSender');

const customerContactUs = async (req: Request, res: Response) => {
  const data = req.body;
  await customerEmailUs(data.email, data, 'http://localhost:3000/contact');
  return res.status(200).json(data);
};

module.exports = { customerContactUs };
