const users = require('../../model/userAccount');

export const emailCheck = async (email: string, req:any) => {
  const result = await users.getModel(req.dbConnection).findOne({ email });
  if (result && result.active) return true; 
  return false;
};