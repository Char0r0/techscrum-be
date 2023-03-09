import { Request, Response, NextFunction } from 'express';
const { createPrice, subscriptionEntrance } = require('../../services/paymentService');
const Product = require('../../model/product');

let recurringPrice: any;
let priceId: string;
let productId:  string;
let freeTrial: number;
let planName: string;
const ADVANCED_PLAN = 0;
const FREE_TRIAL = 3;

exports.createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { planIdentifier, userId, paymentMode } = req.body;

  if (planIdentifier === ADVANCED_PLAN) {
    if (paymentMode) {
      planName = 'Advanced monthly plan';
    } else {
      planName = 'Advanced yearly plan';
    }
  } else {
    if (paymentMode) {
      planName = 'Ultra monthly plan';
    } else {
      planName = 'Ultra yearly plan';
    }
  }
  try {
    const productModel = Product.getModel(req.dbConnection);
    const isProductExist = await productModel.findOne({ productName: planName }).exec();
    if (!isProductExist) {
      recurringPrice = await createPrice(req, planIdentifier, planName, paymentMode);
      const { id, product } = recurringPrice;
      productId = product; 
      priceId = id;
    } else {
      productId = isProductExist.productId;
      priceId = isProductExist.productPrice;
    }
    freeTrial = FREE_TRIAL;
    const payment = await subscriptionEntrance(productId, priceId, userId, freeTrial, req.dbConnection);
    res.send(payment);
  } catch (e) {
    next(e);
  }
};
