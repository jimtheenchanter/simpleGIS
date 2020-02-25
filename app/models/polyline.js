'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const polylineSchema = new Schema({
  latlng: []

 
});

module.exports = Mongoose.model('Polyline', polylineSchema);