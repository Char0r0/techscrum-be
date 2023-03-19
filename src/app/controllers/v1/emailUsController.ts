import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
const { emailRecipientTemplate } = require('../../utils/emailSender');

exports.contactForm = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  try {
    const emailFrom = 'noreply@techscrumapp.com';
    const emailTo = ['infotechscrum@gmail.com'];
    await emailRecipientTemplate(emailFrom, emailTo, req.body, 'contactPageEmailTemplate');
    res.status(202).json({ message: 'Email Sent Successfully.' });
  } catch (err) {
    res.status(400).json(err);
  }
};