import { Request, Response } from 'express';

const User = require('../../model/user');
const config = require('../../config/app');
const PaymentHistory = require('../../model/paymentHistory');

exports.stripeController = async (req: Request, res: Response) => {
  let event;
  const payloadString = Buffer.from(JSON.stringify(req.body)).toString();
  const header = config.stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: process.env.STRIPE_WEBHOOK_SECRET,
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
          $addToSet: { paymentHistoryId: event.data.object.subscription },
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

      const userModel = User.getModel(req.dbConnection);
      userModel.findOneAndUpdate(
        { customerId: event.data.object.customer },
        {
          currentChargeStartDate,
          currentChargeEndDate,
          stripeProductId: productId,
        },
        { new: true },
      );

      const paymentHistoryModel = PaymentHistory.getModel(req.dbConnection);
      const paymentHistory = new paymentHistoryModel({
        subscriptionId: event.data.object.id,
        currentChargeStartDate,
        currentChargeEndDate,
        currentChargeStatus,
        stripeProductId: productId,
      });
      await paymentHistory.save();
      break;
      
    case 'customer.subscription.updated':
      break;

    case 'customer.subscription.trial_will_end':
      break; 

    case 'payment_intent.succeeded':
      break;

    case 'payment_intent.payment_failed':
      break;
      
    default:
  }

  res.status(200).send();
};