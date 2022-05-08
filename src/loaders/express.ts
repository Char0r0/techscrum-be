import express from "express";
const apiRouter = require("../app/routes/v1/api");
const config = require("../app/config/app");
const cors = require("cors");

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
  app.use(config.api.prefix, apiRouter);
  return app;
};
