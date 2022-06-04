import { Request, Response } from "express";

const JWT = require("jsonwebtoken");
import { Token } from "../../../model/token"
import { emailCheck, register } from "../../../services/registerServices/register"

//Check if the email exist
exports.post = async(req: Request, res: Response) => {
    const email = req.params.email;

    const existUser: boolean = await emailCheck(email);

    if(existUser) return res.status(200).send({ "result": true })
    return res.status(406).send({ "result": false })
}

//Register
exports.store = async(req: Request, res: Response) => {
    const { email, name, password } = req.body.registerForm;
    
    const registerSuccessFlag: boolean = await register(email, name, password);

    if(!registerSuccessFlag) return res.status(406).send({ "result": false });
    const emailObj = { email };
    const token = JWT.sign(
        emailObj, 
        process.env.ACCESS_SECRET,
        {expiresIn: process.env.EXPERT_TIME || "24h"}
    )

    const resToken: Token = { token }
    res.status(201).send(resToken);
}