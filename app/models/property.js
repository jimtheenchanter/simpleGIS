'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const propertySchema = new Schema({
  eircode: String,
  long: Number,
  lat: Number,
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
 
});

module.exports = Mongoose.model('Property', propertySchema);