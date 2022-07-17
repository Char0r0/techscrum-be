export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tenantSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  passwordSecret: {
    type: String, 
    required: true,
  },
});

module.exports = tenantSchema;