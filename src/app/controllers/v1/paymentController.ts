import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
const { createPrice, subscribe } = require('../../services/paymentService');
const Product = require('../../model/product');
const User = require('../../model/user');

let recurringPrice: Stripe.Price;
let priceId: string;
let productId: string | Stripe.Product | Stripe.DeletedProduct;
let freeTrial: number;
let planName: string;
const ADVANCED_PLAN = 0;
let FREE_TRIAL: number;

exports.createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { planIdentifier, userId, paymentMode, isFreeTrial } = req.body;
  let isFreeTrialExist: boolean = isFreeTrial;
  if (planIdentifier === ADVANCED_PLAN) {
    if (paymentMode) {
      FREE_TRIAL = 1;
      planName = 'Advanced monthly plan';
    } else {
      FREE_TRIAL = 1;
      planName = 'Advanced yearly plan';
    }
  } else {
    if (paymentMode) {
      FREE_TRIAL = 7;
      planName = 'Ultra monthly plan';
    } else {
      FREE_TRIAL = 30;
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
      productId = isProductExist.stripeProductId;
      priceId = isProductExist.productPrice;
    }
    freeTrial = FREE_TRIAL;

    const userModel = User.getModel(req.dbConnection);
    const userInfo = await userModel.findOne({ _id: userId }).exec();
    if (userInfo.productHistory.includes(productId)) {
      isFreeTrialExist = false;
    }
    const payment = await subscribe(productId, priceId, userId, freeTrial, isFreeTrialExist, req.dbConnection);

    res.send(payment);
  } catch (e) {
    next(e);
  }
};
