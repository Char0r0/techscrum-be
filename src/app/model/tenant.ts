export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tenantSchema = new Schema({
  origin: {
    type: String,
    required: true,
  },
  passwordSecret: {
    type: String, 
    // required: true,
  },
},
{ timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('tenants', tenantSchema);
};
