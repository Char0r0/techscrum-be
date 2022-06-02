const mongosse = require("mongoose");

const tenantsSchema = new mongosse.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const tenants = mongosse.model("tenants", tenantsSchema);
module.exports = tenants;
