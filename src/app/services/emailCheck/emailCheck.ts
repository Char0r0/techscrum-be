const users = require('../../model/user');

export const emailCheck = async (email: string) => {
  const result = await users.find({ email });
  if (result.length > 0) return false;
  return true;
};
