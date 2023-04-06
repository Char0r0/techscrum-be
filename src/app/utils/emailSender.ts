const aws = require('aws-sdk');
const config = require('../config/app');
const logger = require('../../loaders/logger');
const awsConfig = require('../config/aws');

aws.config.update({
  region: awsConfig.awsRegion,
  accessKeyId: awsConfig.awsAccessKey,
  secretAccessKey: awsConfig.awsSecretKey,
});

function cb(email_err: any, email_data: any): void {
  if (email_err) {
    logger.error('Failed to send to email:' + email_err);
  } else {
    logger.info(`Email Sent Success: ${JSON.stringify(email_data)}`);
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

export const subscriptionSender = (
  email: string,
  validationCode: string,
  domain: string = config.frontEndAddress,
) => {
  const templateData = {
    name: email,
    appName: 'TECHSCRUMAPP',
    domain,
    url: 'verify',
    token: validationCode,
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2023',
    project: 'abc',
  };

  emailSenderTemplate(email, templateData, 'Subscription', cb);
};

export const emailRecipientTemplate = (
  emailFrom: string,
  emailTo: string[],
  data: {},
  templateName: string,
) => {
  const ses = new aws.SES();

  let params = {
    Source: emailFrom,
    Destination: {
      ToAddresses: emailTo,
    },
    Template: templateName,
    TemplateData: JSON.stringify(data),
  };

  return ses.sendTemplatedEmail(params).promise();
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
  domain: string,
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

export const forgetPassword = (email: string, name: string, token: string, domain: string) => {
  const templateData = {
    name: name ?? email,
    appName: 'TECHSCRUMAPP',
    domain,
    url: 'login/change-password',
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: 'abc',
    token: `token=${token}`,
    time: ' 30 minutes',
  };

  emailSenderTemplate(email, templateData, 'ForgotPassword', cb);
};

export const getDomain = (host: string, originHost: string) => {
  const protocol = originHost.includes('localhost') ? 'http://' : 'https://';
  if (originHost.includes('localhost') || originHost.includes('dev.')) {
    return protocol + originHost;
  }
  return host;
};
