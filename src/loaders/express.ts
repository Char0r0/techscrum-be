import express from "express";
import rateLimit from "express-rate-limit";
const apiRouter = require("../app/routes/v1/api");
const config = require("../app/config/app");
const cors = require("cors");
const helmet = require("helmet");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

function startServer() {
  const application = express();

  application
    .listen(config.port, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${config.port}`
      );
    })
    .on("error", () => {
      console.log("Error");
    });
  return application;
}

module.exports = () => {
  const app = startServer();
  //global middleware
  app.use(cors());
  app.use(express.json());
  app.use(limiter);
  app.use(helmet());
  app.use(config.api.prefix, apiRouter);

  return app;
};
