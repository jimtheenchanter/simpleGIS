'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const polylineSchema = new Schema({
  title: String,
  latlng: [],
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
 
});

module.exports = Mongoose.model('Polyline', polylineSchema);