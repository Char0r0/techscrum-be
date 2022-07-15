const emailVerificationTemplate = {
  Source: 'admin@techscrumapp.com',
  Message: {
    Subject: {
      Charset: 'UTF-8',
      Data: 'Techscrum - Email Verification',
    },
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: 
        '<p>Thanks for registering your Techscrum account.</p>\\n' +
        '\\n<p>Please verify your email address by clicking on the link below to complete your registration.</p>\\n' +
        "<a href = '{{frontEndAddress}}/register/{{validationCode}}'>Verify your email address</a>//n" + 
        '<p>If you have any question, please contact us on {{email}}</p>//n' +
        '<p>Techscrum Team</p>',
      },
    },
  },
};

const emailInvesterTemplate = {
  Source: 'admin@techscrumapp.com',
};

export { emailVerificationTemplate, emailInvesterTemplate };
