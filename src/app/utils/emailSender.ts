const aws = require('aws-sdk');
const config = require('../config/app');

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

function cb(email_err: any, email_data: any): void {
  if (email_err) {
    console.log('Failed to send to email:' + email_err);
  } else {
    console.log(`Email Sent Success: ${email_data}`);
  }
}

const emailSenderTemplate = (
  email: string,
  data: any,
  templateName: string,
  callback: (email_err: any, email_data: any) => void,
) => {
  const ses = new aws.SES();

  const destination = {
    ToAddresses: [email],
  };

  let params = {
    Source: 'noreply@techscrumapp.com',
    Destination: destination,
    Template: templateName,
    TemplateData: JSON.stringify(data),
  };

  ses.sendTemplatedEmail(params, function (email_err: any, email_data: any) {
    if (email_err) {
      callback(email_err, email_data);
    } else {
      callback(null, email_data);
    }
  });
};

export const emailSender = (
  email: string,
  validationCode: string,
  domain: string = config.frontEndAddress,
) => {
  // Create sendEmail params
  const templateData = {
    name: email,
    appName: 'TECHSCRUMAPP',
    domain,
    url: 'verify',
    token: validationCode,
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: 'abc',
  };
  emailSenderTemplate(email, templateData, 'CustomEmailVerify', cb);
};

export const invite = (
  email: string,
  name: string,
  validationCode: string,
  roleType: string,
  projectName: string,
  domain: string = config.frontEndAddress,
) => {
  // Create sendEmail params
  const url = validationCode === '' ? 'projects' : 'verify';
  const templateData = {
    name,
    appName: 'TECHSCRUMAPP',
    domain,
    url,
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: projectName,
    token: `token=${validationCode}`,
    roleType: roleType,
  };
  emailSenderTemplate(email, templateData, 'Access', cb);
};

export const forgetPassword = (
  email: string,
  name: string,
  token: string,
  domain: string = config.frontEndAddress,
) => {
  // Create sendEmail params
  const templateData = {
    name: name,
    appName: 'TECHSCRUMAPP',
    domain,
    url: 'register',
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: 'abc',
    token: token,
    time: ' 4 hours',
  };
  emailSenderTemplate(email, templateData, 'ForgotPassword', cb);
};
