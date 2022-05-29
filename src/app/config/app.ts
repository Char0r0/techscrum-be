const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || "/api/v1",
  },
  db:
    process.env.MONGODB_URL ||
    "mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority",
};
