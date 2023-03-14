import { Request, Response } from 'express';
const User = require('../../model/user');
const config = require('../../config/app');

exports.refundController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    //const userId = '63fea39da93a3876770a34e9';
    const userModel = User.getModel(req.dbConnection);
    const user = await userModel.findOne({ _id: userId });

    const intent = await config.stripe.paymentIntents.retrieve(user.stripePaymentIntentId);
    const refund = await config.stripe.refunds.create({ payment_intent: intent.id });
    
    res.status(200).send(refund);
  } catch (e) {
  }
};