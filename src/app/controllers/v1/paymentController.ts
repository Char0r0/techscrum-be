import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { createProductModel, createTenantsModel } from '../../utils/helper';
const { createPrice, subscribe } = require('../../services/paymentService');

let recurringPrice: Stripe.Price;
let priceId: string;
let productId: string | Stripe.Product | Stripe.DeletedProduct;
let freeTrial: number;
let planName: string;
const ADVANCED_PLAN = 0;
let FREE_TRIAL: number;

exports.createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { domainURL, planIdentifier, userId, paymentMode, isFreeTrial } = req.body;

  console.log('DOMAIN!!!!!!', domainURL);
  let freeTrialCheck: boolean = isFreeTrial;
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
    const productModel = await createProductModel();
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

    const tenantModel = await createTenantsModel();
    const tenantInfo = await tenantModel.findOne({ owner: userId }).exec();

    if (tenantInfo.productHistory.includes(productId)) {
      freeTrialCheck = false;
    }

    const payment = await subscribe(domainURL, productId, priceId, userId, freeTrial, freeTrialCheck, req.dbConnection);

    res.send(payment);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
