import { Request, Response } from 'express';
const { emailRecipientTemplate } = require('../utils/emailSender');

const FULLNAME_REGEX = /^[a-z ,.'-]+$/i;
const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const enquiryTitles = [
  'Just saying hi!',
  "I'd like to request a feature",
  'I have a question about billing',
  "I'm confused about how something works",
  'Other',
];

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
    enquiryTitles.includes(title),
  ].every((each) => each);
  if (!isAllFilled || !isAllRegexPassed) {
    return res.status(400).json({
      error: 'The data you passed were not all valid',
      fullName: 'required, string, no special symbols',
      company: 'required, string',
      phone: 'required, string, 10 digit',
      email: 'required, valid email',
      message: 'required, string',
      title: {
        one: 'Just saying hi!',
        two: "I'd like to request a feature",
        three: 'I have a question about billing',
        four: "I'm confused about how something works",
        five: 'Other',
      },
    });
  }

  const emailFrom = 'noreply@techscrumapp.com';
  const emailTo = ['infotechscrum@gmail.com'];
  emailRecipientTemplate(emailFrom, emailTo, data, 'contactPageEmailTemplate')
    .then(() => {
      res.status(202).json({ message: 'Email Sent Successfully.' });
    })
    .catch((err: any) => {
      res.status(400).json(err);
    });
};

module.exports = { customerContactUs };
