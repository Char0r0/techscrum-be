import { Request, Response } from 'express';

const User = require('../../model/user');
const PaymentHistory = require('../../model/paymentHistory');
const config = require('../../config/app');

exports.stripeController = async (req: Request, res: Response) => {
  let event;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payloadString = Buffer.from(JSON.stringify(req.body)).toString();
  const header = config.stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });

  try {
    event = config.stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const userModel2 = User.getModel(req.dbConnection);
      userModel2.findOneAndUpdate(
        { _id: event.data.object.metadata.userId },
        {
          customerId: event.data.object.customer,
        },
        { new: true },
      );
      break; 
      
    case 'customer.subscription.created':
      
      // reject directly, payment failed.
      // even failed, need to store into paymentHistory schema.
      // email sent to customers 
      
      const freeTrialStartDate = event.data.object.trial_start;
      const startDate = new Date(freeTrialStartDate * 1000);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const startDay = startDate.getDate();
      const formattedFreeTrialStartDate = `${startYear}-${startMonth}-${startDay}`;

      const freeTrialEndDate = event.data.object.trial_start;
      const endDate = new Date(freeTrialEndDate * 1000);
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;
      const endDay = endDate.getDate();
      const formattedFreeTrialEndDate = `${endYear}-${endMonth}-${endDay}`;

      const currentChargeStartDate = formattedFreeTrialStartDate;
      const currentChargeEndDate = formattedFreeTrialEndDate;
      const productId = event.data.object.metadata.productId;
      const currentChargeStatus = event.data.object.status;
      
      const paymentIntent = await config.stripe.paymentIntents.create({
        amount: event.data.object.plan.amount,
        currency: 'aud',
        payment_method_types: ['card'],
      });

      const PaymentHistoryModal = PaymentHistory.getModel(req.dbConnection);
      const PaymentHistoryInformation = new PaymentHistoryModal({
        subscriptionId: event.data.object.id,
        currentChargeStartDate,
        currentChargeEndDate,
        currentChargeStatus,
        stripeProductId: productId,
        stripePaymentIntentId: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status,
      });
      PaymentHistoryInformation.save();

      const userModel = User.getModel(req.dbConnection);
      userModel.findOneAndUpdate(
        { customerId: event.data.object.customer },
        {
          currentChargeStartDate,
          currentChargeEndDate,
          stripeProductId: productId,
          stripePaymentIntentId: paymentIntent.id,
          $addToSet: { paymentHistoryId: PaymentHistoryInformation._id }, 
        },
        { new: true },
        (err: any, updatedUser: any) => {
          if (err) {
            //console.log(err);
          } else {
            //console.log('INTENT', updatedUser.stripePaymentIntentId);
            //console.log(updatedUser);
          }
        }
      );
      break;

    // CHECK HERE !!!!!!!!!!!!!!!
    case 'invoice.payment_succeeded':
      console.log(event.data.object);
      break;
    
    case 'invoice.paid':
      
      break;
    
    case 'payment_intent.amount_refunded':
      //console.log(event.data.object);
      break;

    case 'customer.subscription.updated':
      break;

    case 'customer.subscription.trial_will_end':
      break; 

    case 'payment_intent.succeeded':
      console.log('HAHAHAHA2', event.data.object);
      break;

    case 'payment_intent.payment_failed':
      break;

    case 'charge.refunded':
      console.log(event.data.object);
      break;
      
    default:
  }

  res.status(200).send();
};

function refundController() {
  throw new Error('Function not implemented.');
}
