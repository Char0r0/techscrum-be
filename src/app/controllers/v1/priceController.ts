import { Request, Response, NextFunction } from 'express';
const { createMonthlyPrice, createYearlyPrice, subscriptionEntrance } = require('../../services/paymentService');
const Product = require('../../model/product');

let monthlyRecurringPrice: any;
let yearlyRecurringPrice: any;
let priceId: string;
let productId:  string;
let freeTrial: number;

exports.createMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price, userId, planName } = req.body;
  try {
    const productModel = Product.getModel(req.dbConnection);
    const isMonthlyProductExist = await productModel.findOne({ productName: planName }).exec();
    if (!isMonthlyProductExist) {
      monthlyRecurringPrice = await createMonthlyPrice(req, price, planName);
      const { id, product } = monthlyRecurringPrice;
      productId = product; 
      priceId = id;
    } else {
      productId = isMonthlyProductExist.productId;
      priceId = isMonthlyProductExist.productPrice;
    }
    freeTrial = 3;
    const payment = await subscriptionEntrance(productId, priceId, userId, freeTrial, req.dbConnection);
    res.send(payment);
  } catch (e) {
    next(e);
  }
};

exports.createYearlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price, userId, planName } = req.body;
  try {
    const productModel = Product.getModel(req.dbConnection);
    const isYearlyProductExist = await productModel.findOne({ productName: planName }).exec();
    if (!isYearlyProductExist) {
      yearlyRecurringPrice = await createYearlyPrice(req, price, planName);
      const { id, product } = yearlyRecurringPrice;
      productId = product; 
      priceId = id;
    } else {
      productId = isYearlyProductExist.productId;
      priceId = isYearlyProductExist.productPrice;
    }
    freeTrial = 3;
    const payment = await subscriptionEntrance(productId, priceId, userId, freeTrial, req.dbConnection);
    res.send(payment);
  } catch (e) {
    next(e);
  }
};