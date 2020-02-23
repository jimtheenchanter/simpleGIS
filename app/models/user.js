'use strict';

const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
  };
  
  // new method
// userSchema.statics.findById = function(id) {
//   return this.findOne({id : id})
// }
  
  userSchema.methods.comparePassword = function(userPassword) {
    const isMatch = this.password === userPassword;
    if (!isMatch) {
      throw Boom('Password mismatch');
    }
    return this;
  };

module.exports = Mongoose.model('User', userSchema);