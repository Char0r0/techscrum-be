const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

exports.refundController = async (paymentIntent: string) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);
    const refund = await stripe.refunds.create({ payment_intent: intent.id });
    return refund;
  } catch (e) {

  }
};