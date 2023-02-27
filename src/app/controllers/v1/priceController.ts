import { Request, Response, NextFunction } from 'express';
const { createMonthlyPrice, paymentEntrance, paymentEntranceYearly } = require('../../services/paymentService');

let monthlyRecurringPrice: string;
exports.createAdvancedPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price } = req.body;
  let totalPrice: number;
  try {
    if (price === 49) {
      monthlyRecurringPrice = await createMonthlyPrice(price);
      const payment = await paymentEntrance(monthlyRecurringPrice);
      res.send(payment);
    }
    if (price === 29) {
      totalPrice = 348;
      const payment = await paymentEntranceYearly(totalPrice);
      res.send(payment);
    }

  } catch (e) {
    next(e);
  }
};

exports.createUltraPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price } = req.body;
  let totalPrice: number;
  try {
    if (price === 149) {
      monthlyRecurringPrice = await createMonthlyPrice(price);
      const payment = await paymentEntrance(monthlyRecurringPrice);
      res.send(payment);
    }
    if (price === 59) {
      totalPrice = 708; 
      const payment = await paymentEntranceYearly(totalPrice);
      res.send(payment);
    }

  } catch (e) {
    next(e);
  }
};