import { Request, Response } from "express";

import { Token } from "../../../model/token"
import { emailCheck, register } from "../../../services/register/register"
import { UserRegister } from '../../../model/userRegister'

//Check if the email exist
exports.post = async (req: Request, res: Response) => {
    console.log("test");
    const email = req.params.email;

    const existUser: boolean = await emailCheck(email);
    if(existUser) return res.status(200).send({ "result": true })
    
    return res.status(406).send({ "result": false })
}

//Register
exports.store = async(req: Request, res: Response) => {
    const tokenGenerate = require("../../../services/tokenGenerate/tokenGenerate");
    const newUser: UserRegister = req.body.registerForm;
    
    const registerSuccessFlag: boolean = await register(newUser);

    if(!registerSuccessFlag) return res.status(406).send({ "result": false });
    
    const token = tokenGenerate(newUser.email);
    const resToken: Token = { token }
    res.status(201).send(resToken);
}