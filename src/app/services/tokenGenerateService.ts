import jwt from 'jsonwebtoken';
import config from '../config/app';

export function tokenGenerate(input: string) {
  const encryptObj = { input };
  const token = jwt.sign(encryptObj, config.accessSecret, {
    expiresIn: process.env.EXPERT_TIME ?? '24h',
  });

  return token;
}

module.exports = tokenGenerate;
