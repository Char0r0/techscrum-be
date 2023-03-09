exports.refundController = async (paymentIntent: string) => {
  try {
    const intent = await config.stripe.paymentIntents.retrieve(paymentIntent);
    const refund = await config.stripe.refunds.create({ payment_intent: intent.id });
    return refund;
  } catch (e) {
    
  }
};