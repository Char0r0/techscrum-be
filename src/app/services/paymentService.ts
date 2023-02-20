const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

let session : any;
const paymentEntrance = async (price: number) => {
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

export { paymentEntrance };