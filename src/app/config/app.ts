const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config();

module.exports = {
  name: process.env.NAME || "techscrumapp",
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || "/api/v1",
  },
  version: "1.0.0",
  db:
    process.env.MONGODB_URL ||
    "mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority",
};
