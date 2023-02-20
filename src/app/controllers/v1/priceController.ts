import { Request, Response, NextFunction } from 'express';
const { paymentEntrance } = require('../../services/paymentService');

exports.createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price } = req.body;
  try {
    const payment = await paymentEntrance(price);
    res.send(payment);
  } catch (e) {
    next(e);
  }
};
