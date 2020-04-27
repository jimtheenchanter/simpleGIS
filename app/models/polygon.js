'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const polygonSchema = new Schema({
  title: String,
  latlng: [],
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
 
});

module.exports = Mongoose.model('Polygon', polygonSchema);