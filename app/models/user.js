'use strict';

const Boom = require('boom');
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
  
  userSchema.methods.comparePassword = async function(userPassword) {     // EDITED
    const isMatch = await bcrypt.compare(userPassword, this.password);
    // if (!isMatch) {
    //        const message = 'Password mismatch';
    //       throw new Boom(message);
    //      }
    return isMatch;
  };




  // new method
// userSchema.statics.findById = function(id) {
//   return this.findOne({id : id})
// }
  
// userSchema.methods.comparePassword = function(userPassword) {
//   const isMatch = this.password === userPassword;
//   if (!isMatch) {
//     const message = 'Password mismatch';
//     throw new Boom(message);
//   }
//   return this;
// };

module.exports = Mongoose.model('User', userSchema);