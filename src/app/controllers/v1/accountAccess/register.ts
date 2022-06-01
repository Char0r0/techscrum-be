import { Request, Response } from "express";

const JWT = require("jsonwebtoken");
import { Token } from "../../../model/token"
import { emailCheck, register } from "../../../services/dbAccess/dbAccess"

//Check if the email exist
exports.post = async(req: Request, res: Response) => {
    const email = req.params.email;

    const existUser: boolean = await emailCheck(email);

    if(existUser) return res.status(200).send({ "result": true })
    return res.status(406).send({ "result": false })
}

//Register
exports.store = async(req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const notExistUser: boolean = await register(email, password);

    if(!notExistUser) res.status(406).send({ "result": false })

    const emailObj = { email }

    const token = JWT.sign(
        emailObj, 
        process.env.ACCESS_SECRET,
        {expiresIn: process.env.EXPERT_TIME || "24h"}
    )

    const resToken: Token = { token }
    res.status(201).send(resToken);
}