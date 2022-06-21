const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

exports.init = () => {
  const app = expressLoader();
  mongooseLoader();
};
