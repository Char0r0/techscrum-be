import { Request, Response } from 'express';
const { emailRecipientTemplate } = require('../utils/emailSender');

const FULLNAME_REGEX = /^[a-z ,.'-]+$/i;
const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

interface IdataReqType {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  title: string;
}

const customerContactUs = (req: Request, res: Response) => {
  // req.body validation
  const data: IdataReqType = req.body;
  const { fullName, company, phone, email, message, title } = data;
  const isAllFilled = [fullName, company, phone, email, message, title].every((item) => item);
  const isAllRegexPassed = [
    FULLNAME_REGEX.test(data.fullName),
    PHONE_REGEX.test(data.phone),
    EMAIL_REGEX.test(data.email),
  ].every((each) => each);
  if (!isAllFilled || !isAllRegexPassed) {
    return res.status(400).json({
      error: 'Required fields: fullName (valid), company, phone (10 digit), email (valid), message',
    });
  }

  const emailFrom = 'noreply@techscrumapp.com';
  const emailTo = ['infotechscrum@gmail.com'];
  emailRecipientTemplate(emailFrom, emailTo, data, 'contactPageEmailTemplate')
    .then(() => {
      res.status(200).json({ message: 'Successful, sent to infotechscrum@gmail.com.' });
    })
    .catch((err: any) => {
      res.status(400).json(err);
    });
};

module.exports = { customerContactUs };
