const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Product = require('../model/product');
import { Request } from 'express';


let session : any;
let monthlyPrice: any;
let yearlyPrice: any;

const createMonthlyPrice = async (req: Request, price: number, productName: string) => {
  try {
    const product = await stripe.products.create({ name: productName });
    monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: 'aud',
      recurring: { interval: 'month' },
    });
    const productModel = Product.getModel(req.dbConnection);
    const productInformation = new productModel({ productId: product.id, productName: productName, productPrice: monthlyPrice.id });
    await productInformation.save();
  } catch (e) {
  }
  return monthlyPrice;
};

const createYearlyPrice = async (req: Request, price: number, productName: string) => {
  try {
    const product = await stripe.products.create({ name: productName });
    yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: 'aud',
      recurring: { interval: 'year' },
    });
    const productModel = Product.getModel(req.dbConnection);
    const productInformation = new productModel({ productId: product.id, productName: productName, productPrice: yearlyPrice.id });
    await productInformation.save();
  } catch (e) {
  }
  return monthlyPrice;
};

const subscriptionEntrance = async (productId: string, priceId: string, userId: string, freeTrial: number) => {
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
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


export { createMonthlyPrice, createYearlyPrice, subscriptionEntrance };