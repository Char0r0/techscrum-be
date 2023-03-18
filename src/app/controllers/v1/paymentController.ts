import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
const { createPrice, subscribe } = require('../../services/paymentService');
const Product = require('../../model/product');

let recurringPrice: Stripe.Price;
let priceId: string;
let productId: string | Stripe.Product | Stripe.DeletedProduct;
let freeTrial: number;
let planName: string;
const ADVANCED_PLAN = 0;
let FREE_TRIAL: number;

exports.createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { planIdentifier, userId, paymentMode, isFreeTrial } = req.body;

  if (planIdentifier === ADVANCED_PLAN) {
    if (paymentMode) {
      FREE_TRIAL = 7;
      planName = 'Advanced monthly plan';
    } else {
      FREE_TRIAL = 30;
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
    const payment = await subscribe(productId, priceId, userId, freeTrial, isFreeTrial, req.dbConnection);

    /*
      const a = billOverviewService.getOverview();
      const b = billOverviewService.getDetails(); 
      const c = .....
      const d = .....
    */
    res.send(payment);
  } catch (e) {
    next(e);
  }
};
