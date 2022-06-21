const expressLoader = require("./express");
const swaggerLoader = require("./swagger");
const mongooseLoader = require("./mongoose");

exports.init = () => {
  const app = expressLoader();
  //swaggerLoader(app);
  mongooseLoader();
};
