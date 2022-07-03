const jwt = require('jsonwebtoken');

function tokenGenerate(email: string) {
  const emailObj = { email };
  const token = jwt.sign(emailObj, process.env.ACCESS_SECRET, {
    expiresIn: process.env.EXPERT_TIME || '24h',
  });

  return token;
}

module.exports = tokenGenerate;
