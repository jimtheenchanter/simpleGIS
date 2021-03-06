'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const propertySchema = new Schema({
  eircode: String,
  address: String,
  long: Number,
  lat: Number,
  color: String,
  comment: String,
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
 
});

module.exports = Mongoose.model('Property', propertySchema);