const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Product = require('../model/product');
import { Request } from 'express';


let session : any;
let productPrice: any;
let price: number;
let interval: string;
const ADVANCED_PLAN = 0;
const ADVANCED_MONTHLY_PRICE = 49;
const ADVANCED_YEARLY_PRICE = 348;
const ULTRA_MONTHLY_PRICE = 149;
const ULTRA_YEARLY_PRICE = 708;
const PRICE_UNIT = 100;
const PRODUCT_QUANTILITY = 1; 


const createPrice = async (req: Request, planIdentifier: number, productName: string, paymentMode: boolean) => {
  if (planIdentifier === ADVANCED_PLAN) {
    if (paymentMode) {
      price = ADVANCED_MONTHLY_PRICE;
      interval = 'month';
    } else {
      price = ADVANCED_YEARLY_PRICE;
      interval = 'year';
    }
  } else {
    if (paymentMode) {
      price = ULTRA_MONTHLY_PRICE;
      interval = 'month';
    } else {
      price = ULTRA_YEARLY_PRICE;
      interval = 'year';
    }
  }

  try {
    const product = await stripe.products.create({ name: productName });
    productPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * PRICE_UNIT,
      currency: 'aud',
      recurring: { interval: interval },
    });
    const productModel = Product.getModel(req.dbConnection);
    const productInformation = new productModel({ productId: product.id, productName: productName, productPrice: productPrice.id });
    await productInformation.save();
  } catch (e) {
  }
  return productPrice;
};

const subscriptionEntrance = async (productId: string, priceId: string, userId: string, freeTrial: number) => {
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: PRODUCT_QUANTILITY,
      }],
      metadata: {
        userId: userId,
        productId: productId,
      },
      subscription_data: {
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
        trial_period_days: freeTrial,
      },
      mode: 'subscription',
      success_url: 'http://localhost:3000/price',
      cancel_url: 'http://localhost:3000/price',
    });
  } catch (e: any) {
  }
  return session.url;
};


export { createPrice, subscriptionEntrance };