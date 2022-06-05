import { UserRigister } from "../../model/userRegister"
import encryption from '../encryption/encryption'

const registerSchema = require('../../model/userRegister');

export const emailCheck = async (email: string) => {
    const result = await registerSchema.find({ email });
    if(result) return false;
    return true;
}

export const register = async (email: string, name: string, password: string) =>{
    const userNotExistFlag = await emailCheck(email);
    if(!userNotExistFlag) return false;

    const user: UserRigister = { email, name, password: await encryption(password) };
    const newUser = new registerSchema(user);
    await newUser.save();
    return true;
}