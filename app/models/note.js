'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const noteSchema = new Schema({
  date: String,
  comment: String,
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

 
});

module.exports = Mongoose.model('Note', noteSchema);