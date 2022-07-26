import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Mongoose } from 'mongoose';
const status = require('http-status');
const { emailCheck } = require('../../../services/accountAccess/emailCheck');
const { emailRegister } = require('../../../services/accountAccess/register');
const User = require('../../../model/user');
const Tenant = require('../../../model/tenant');
const config = require('../../../config/app');
declare module 'express-serve-static-core' {
  interface Request {
    verifyEmail?: string;
  }
}

//Emil Register
exports.register = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.params.email;
  const { appName } = req.body;
  const origin  = req.headers.origin;
  let tenantUrl = req.headers.origin;
  let tenantId: string = '629173f74060424a41145125';

  if (origin !== 'http://localhost:3000' && origin !== 'https://www.techscrumapp.com/' && origin !== 'https://www.techscrumapp.com') {
    const dataConnectionMongoose = new Mongoose();
    const tenantConnection  = await dataConnectionMongoose.connect(config.tenantConnection);
    const tenantModel = Tenant.getModel(tenantConnection);
    const tenantOrigin =  `https://${appName}.techscrumapp.com`;
    const result = await tenantModel.find({ origin: tenantOrigin });
    if (result) {
      res.send(500).end();
      return; 
    }
    const tenant = new tenantModel({ origin: tenantOrigin } );
    tenant.save();
    tenantId = tenant._id;
    tenantUrl = tenantOrigin;
  }

  const secondDataConnectionMongoose = new Mongoose();
  const url = config.db.replace('techscrumapp', tenantId);
  const resdbConnection = await secondDataConnectionMongoose.connect(url);

  try {
    const existUser: boolean = await emailCheck(email, resdbConnection);
    if (!existUser) {
      const user = await emailRegister(email, resdbConnection, tenantUrl);
      if (user == null || user === undefined) return res.status(status.SERVICE_UNAVAILABLE).send();
      return res.status(status.CREATED).send(user);
    }
    res.status(status.FOUND).send();
  } catch (e) {
    next(e);
  }
};

//Verify Email by token
exports.get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.verifyEmail ?? '';
    res.send({ email });
  } catch (e) {
    next(e);
  }
};

//Active account
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    const { email, name, password } = req.body;
    const user = await User.getModel(req.dbConnection).activeAccount(email, name, password, req);
    const token = await user.generateAuthToken();
    res.send({ user, ...token });
  } catch (e) {
    next(e);
  }
};
