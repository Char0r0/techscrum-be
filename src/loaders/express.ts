import express, { NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
const apiRouter = require('../app/routes/v2/api');
const config = require('../app/config/app');
const cors = require('cors');
const helmet = require('helmet');
const swagger = require('./swagger');
const { errorHandler } = require('./errorHandler');
const status = require('http-status');
const compression = require('compression');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = () => {
  const app = express();

  //global middleware
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use(limiter);
  app.use(helmet());
  app.use(config.api.prefix, apiRouter);
  swagger(app);
  app.use((err: Error, req: express.Request, res: express.Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
    res.status(status.INTERNAL_SERVER_ERROR).send();
    next();
  });

  return app;
};
