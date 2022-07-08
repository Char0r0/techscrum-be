const users = require('../../model/userAccount');

export const emailCheck = async (email: string) => {
  const result = await users.findOne({ email });
  if (result && result.active) return true; 
  return false;
};