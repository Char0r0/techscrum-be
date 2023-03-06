import { Request, Response, NextFunction } from 'express';
const { createMonthlyPrice, createYearlyPrice, subscriptionEntrance } = require('../../services/paymentService');
const Product = require('../../model/product');

let monthlyRecurringPrice: any;
let yearlyRecurringPrice: any;
let priceId: string;
let productId:  string;
let planName: string;
let freeTrial: number;

exports.createAdvancedPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price, userId } = req.body;
  let totalPrice: number;
  try {
    if (price === 49) {
      const productModel = Product.getModel(req.dbConnection);
      planName = 'Advanced monthly plan';
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
    }
    if (price === 29) {
      planName = 'Advanced yearly plan';
      totalPrice = 348;
      const productModel = Product.getModel(req.dbConnection);
      const isYearlyProductExist = await productModel.findOne({ productName: planName }).exec();
      if (!isYearlyProductExist) {
        yearlyRecurringPrice = await createYearlyPrice(req, totalPrice, planName);
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
    }

  } catch (e) {
    next(e);
  }
};

exports.createUltraPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { price, userId } = req.body;
  let totalPrice: number;
  try {
    if (price === 149) {
      const productModel = Product.getModel(req.dbConnection);
      planName = 'Ultra monthly plan';
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
    }
    if (price === 59) {
      planName = 'Ultra yearly plan';
      totalPrice = 708;
      const productModel = Product.getModel(req.dbConnection);
      const isYearlyProductExist = await productModel.findOne({ productName: planName }).exec();
      if (!isYearlyProductExist) {
        yearlyRecurringPrice = await createYearlyPrice(req, totalPrice, planName);
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
    }

  } catch (e) {
    next(e);
  }
};