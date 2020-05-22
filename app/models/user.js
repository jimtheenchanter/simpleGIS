'use strict';

const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: Boolean,
  date: String,
    
});


userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
  };
  
userSchema.methods.comparePassword = async function(userPassword) {    
    const isMatch = await bcrypt.compare(userPassword, this.password);
//uses bcrypt to compare password
    return isMatch;
  };



module.exports = Mongoose.model('User', userSchema);