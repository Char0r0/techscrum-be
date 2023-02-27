const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

let session : any;
let monthlyPrice: any;

const createMonthlyPrice = async (price: number) => {
  try {
    const product = await stripe.products.create({ name: 'Advanced plan' });
    monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: 'aud',
      recurring: { interval: 'month' },
    });
  } catch (e) {
  }
  return monthlyPrice.id;
};

const paymentEntranceYearly = async (price: number) => {
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'aud',
          unit_amount: price * 100,
          product_data: {
            name: 'membership',
          },
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/price',
      cancel_url: 'http://localhost:3000/price',
    });
  } catch (e: any) {
  }
  return session.url;
};

const paymentEntrance = async (priceId: string) => {
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      subscription_data: {
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
        trial_period_days: 14,
      },
      mode: 'subscription',
      success_url: 'http://localhost:3000/price',
      cancel_url: 'http://localhost:3000/price',
    });
  } catch (e: any) {
  }
  return session.url;
};


export { createMonthlyPrice, paymentEntrance, paymentEntranceYearly };