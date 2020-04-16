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
  agent: Boolean

    
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
  };
  
<<<<<<< HEAD
=======
userSchema.methods.comparePassword = async function(userPassword) {    
    const isMatch = await bcrypt.compare(userPassword, this.password);
//uses bcrypt to compare password
    return isMatch;
  };




>>>>>>> develop
  // new method
// userSchema.statics.findById = function(id) {
//   return this.findOne({id : id})
// }
  
<<<<<<< HEAD
  userSchema.methods.comparePassword = function(userPassword) {
    const isMatch = this.password === userPassword;
    if (!isMatch) {
      throw Boom('Password mismatch');
    }
    return this;
  };
=======
// userSchema.methods.comparePassword = function(userPassword) {
//   const isMatch = this.password === userPassword;
//   if (!isMatch) {
//     const message = 'Password mismatch';
//     throw new Boom(message);
//   }
//   return this;
// };
>>>>>>> develop

module.exports = Mongoose.model('User', userSchema);