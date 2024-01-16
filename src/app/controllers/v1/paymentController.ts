/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { createProductModel, createTenantsModel } from '../../utils/helper';
import { createPrice, subscribe } from '../../services/paymentService';
import logger from 'winston';

let recurringPrice: Stripe.Price;
let priceId: string;
let productId: string | Stripe.Product | Stripe.DeletedProduct;
let freeTrial: number;
let planName: string;
const ADVANCED_PLAN = 0;
let FREE_TRIAL: number;

enum FreeTrialLengths {
  ONE_WEEK = 7,
  ONE_MONTH = 30,
}

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { planIdentifier, userId, paymentMode, isFreeTrial } = req.body;
    const domainURL = req.headers.origin;
    
    if (!domainURL) {
      throw new Error('Domain URL is not found');
    }

    let freeTrialCheck: boolean = isFreeTrial;

    if (planIdentifier === ADVANCED_PLAN) {
      if (paymentMode) {
        FREE_TRIAL = FreeTrialLengths.ONE_WEEK;
        planName = 'Advanced monthly plan';
      } else {
        FREE_TRIAL = FreeTrialLengths.ONE_MONTH;
        planName = 'Advanced yearly plan';
      }
    } else {
      if (paymentMode) {
        FREE_TRIAL = FreeTrialLengths.ONE_WEEK;
        planName = 'Ultra monthly plan';
      } else {
        FREE_TRIAL = FreeTrialLengths.ONE_MONTH;
        planName = 'Ultra yearly plan';
      }
    }

    const productModel = await createProductModel(req);
    const isProductExist = await productModel.findOne({ productName: planName }).exec();
    if (!isProductExist) {
      recurringPrice = await createPrice(req, planIdentifier, planName, paymentMode);
      const { id, product } = recurringPrice;
      productId = product;
      priceId = id ;
    } else {
      productId = isProductExist.stripeProductId;
      priceId = isProductExist.productPrice;
    }

    if (typeof productId !== 'string') {
      if ('id' in productId) {
        productId = productId.id;
      } else {
        return new Error('Invalid product ID.');
      }
    }
    freeTrial = FREE_TRIAL;

    const tenantModel = await createTenantsModel(req);
    const tenantInfo = await tenantModel.findOne({ owner: userId }).exec();

    if (tenantInfo.productHistory.includes(productId)) {
      freeTrialCheck = false;
    }

    const payment = await subscribe(domainURL, productId, priceId, userId, freeTrial, freeTrialCheck);


    res.send(payment);
  } catch (e) {
    logger.info(e);
    next(e);
  }
};
